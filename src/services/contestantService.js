const { Contestant, Group, Score_log, Answer, Match, User } = require("../models");
const { Op, where, Sequelize } = require("sequelize");

class ContestantService {
  // Lấy danh sách thí sinh (có hỗ trợ lọc và phân trang)
  static async getContestants(filters = {}, page = 1, limit = 20) {
    const options = {
      where: {},
      include: [
        {
          model: Group,
          as: "group",
        },
      ],
      order: [["id", "ASC"]],
      offset: (page - 1) * limit,
      limit,
    };

    // Xử lý các bộ lọc
    if (filters.status) options.where.status = filters.status;
    if (filters.group_id) options.where.group_id = filters.group_id;
    if (filters.search) {
      options.where[Op.or] = [
        { fullname: { [Op.like]: `%${filters.search}%` } },
        { email: { [Op.like]: `%${filters.search}%` } },
        { class: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const { count, rows } = await Contestant.findAndCountAll(options);

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      contestants: rows,
    };
  }

  // Lấy thông tin chi tiết của một thí sinh
  static async getContestantById(id) {
    const contestant = await Contestant.findByPk(id, {
      include: [
        { model: Group, as: "group" },
        { model: Score_log, as: "score_logs" },
        { model: Answer, as: "answers" },
      ],
    });

    if (!contestant) {
      throw new Error("Thí sinh không tồn tại");
    }

    return contestant;
  }

  // Tạo thí sinh mới
  static async createContestant(contestantData) {
    // Kiểm tra email đã tồn tại chưa
    const existingContestant = await Contestant.findOne({
      where: { email: contestantData.email },
    });

    if (existingContestant) {
      throw new Error("Email đã được sử dụng");
    }

    return await Contestant.create(contestantData);
  }

  // Cập nhật thông tin thí sinh
  static async updateContestant(id, contestantData) {
    const contestant = await Contestant.findByPk(id);

    if (!contestant) {
      throw new Error("Thí sinh không tồn tại");
    }

    // Nếu thay đổi email, kiểm tra email mới đã tồn tại chưa
    if (contestantData.email && contestantData.email !== contestant.email) {
      const existingContestant = await Contestant.findOne({
        where: { email: contestantData.email },
      });

      if (existingContestant) {
        throw new Error("Email đã được sử dụng");
      }
    }

    await contestant.update(contestantData);
    return contestant;
  }

  // Cập nhật trạng thái của thí sinh
  static async updateContestantStatus(id, status) {
    const contestant = await Contestant.findByPk(id);

    if (!contestant) {
      throw new Error("Thí sinh không tồn tại");
    }

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["Chưa thi", "Đang thi", "Xác nhận 1", "Chờ cứu", "Bị loại"];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    await contestant.update({ status });
    return contestant;
  }

  // Xóa thí sinh
  static async deleteContestant(id) {
    const contestant = await Contestant.findByPk(id);

    if (!contestant) {
      throw new Error("Thí sinh không tồn tại");
    }

    await contestant.destroy();
    return { message: "Đã xóa thí sinh thành công" };
  }


  // lấy ds trạng thái thí sinh
  static async getListStatus() {
    return Object.values(Contestant.getAttributes().status.values);
  }

  // lấy ds lớp thí sinh
  static async getListClass() {
    return Contestant.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("class")), "class"], // Lấy giá trị duy nhất
      ],
      raw: true,
    });
  }

  // lấy danh sách thí sinh dựa vào judge_id, match_id (kết bảng với groups, contestants, matches)
  static async getContestantByJudgeAndMatch(judge_id, match_id) {
    const contestants = await Contestant.findAll({
      include: [
        {
          model: Group,
          as: "group",
          where: { 
            judge_id,
            match_id 
          },
          include: [
            {
              model: Match,
              as: "match",
            },
          ],
        },
      ],
    });

    return contestants;
  }

  // lấy group_id, group_name, match_id, match_name, judge_id, username dựa vào judge_id, match_id (GROUPS)
  static async getGroupAndMatch(judge_id, match_id) {
    const groupAndMatch = await Group.findOne({
      where: { judge_id, match_id },
      attributes: ['id', 'group_name', 'judge_id'],
      include: [
      {
        model: Match,
        as: "match",
        attributes: ['id', 'match_name']
      },
      {
        model: User,
        as: "judge",
        attributes: ['username']
      }
      ],
    });

    return groupAndMatch;
  }
}

module.exports = ContestantService;
