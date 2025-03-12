const { Group, User, Match, Contestant } = require('../models');
const { Op } = require('sequelize');

class GroupService {
  // Lấy danh sách nhóm (có hỗ trợ lọc và phân trang)
  static async getGroups(filters = {}, page = 1, limit = 20) {
    const options = {
      where: {},
      include: [
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'match_name', 'round_name', 'status']
        }
      ],
      order: [['id', 'ASC']],
      offset: (page - 1) * limit,
      limit
    };

    // Xử lý các bộ lọc
    if (filters.match_id) options.where.match_id = filters.match_id;
    if (filters.judge_id) options.where.judge_id = filters.judge_id;
    if (filters.search) {
      options.where.group_name = { [Op.like]: `%${filters.search}%` };
    }

    const { count, rows } = await Group.findAndCountAll(options);
    
    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      groups: rows
    };
  }

  // Lấy chi tiết của một nhóm (bao gồm thành viên)
  static async getGroupById(id) {
    const group = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: 'judge',
          attributes: ['id', 'username', 'email', 'role']
        },
        {
          model: Match,
          as: 'match',
          attributes: ['id', 'match_name', 'round_name', 'status']
        },
        {
          model: Contestant,
          as: 'contestants',
          attributes: ['id', 'fullname', 'email', 'class', 'status']
        }
      ]
    });

    if (!group) {
      throw new Error('Nhóm không tồn tại');
    }

    return group;
  }

  // Tạo nhóm mới
  static async createGroup(groupData) {
    // Kiểm tra match_id và judge_id đã tồn tại chưa
    if (groupData.match_id) {
      const match = await Match.findByPk(groupData.match_id);
      if (!match) {
        throw new Error('Trận đấu không tồn tại');
      }
    }

    if (groupData.judge_id) {
      const judge = await User.findByPk(groupData.judge_id);
      if (!judge) {
        throw new Error('Trọng tài không tồn tại');
      }
      if (judge.role !== 'judge') {
        throw new Error('Người dùng được chọn không phải là trọng tài');
      }
    }

    return await Group.create(groupData);
  }

  // Cập nhật thông tin nhóm
  static async updateGroup(id, groupData) {
    const group = await Group.findByPk(id);

    if (!group) {
      throw new Error('Nhóm không tồn tại');
    }

    // Kiểm tra match_id và judge_id nếu được cập nhật
    if (groupData.match_id) {
      const match = await Match.findByPk(groupData.match_id);
      if (!match) {
        throw new Error('Trận đấu không tồn tại');
      }
    }

    if (groupData.judge_id) {
      const judge = await User.findByPk(groupData.judge_id);
      if (!judge) {
        throw new Error('Trọng tài không tồn tại');
      }
      if (judge.role !== 'judge') {
        throw new Error('Người dùng được chọn không phải là trọng tài');
      }
    }

    await group.update(groupData);
    return group;
  }

  // Xóa nhóm
  static async deleteGroup(id) {
    const group = await Group.findByPk(id);

    if (!group) {
      throw new Error('Nhóm không tồn tại');
    }

    await group.destroy();
    return { message: 'Đã xóa nhóm thành công' };
  }

  // Lấy thí sinh trong nhóm
  static async getContestantsByGroupId(groupId) {
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new Error('Nhóm không tồn tại');
    }

    const contestants = await Contestant.findAll({
      where: { group_id: groupId }
    });

    return contestants;
  }

  // Thêm thí sinh vào nhóm
  static async addContestantsToGroup(groupId, contestantIds) {
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new Error('Nhóm không tồn tại');
    }

    await Contestant.update(
      { group_id: groupId },
      {
        where: {
          id: { [Op.in]: contestantIds }
        }
      }
    );

    return await this.getContestantsByGroupId(groupId);
  }

  // Xóa thí sinh khỏi nhóm
  static async removeContestantFromGroup(groupId, contestantId) {
    const contestant = await Contestant.findOne({
      where: {
        id: contestantId,
        group_id: groupId
      }
    });

    if (!contestant) {
      throw new Error('Thí sinh không thuộc nhóm này');
    }

    await contestant.update({ group_id: null });
    return { message: 'Đã xóa thí sinh khỏi nhóm' };
  }
}

module.exports = GroupService;