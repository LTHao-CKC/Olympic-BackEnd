const QuestionService = require("../services/questionService");

// Tạo câu hỏi
exports.createQuestion = async (req, res) => {
  try {
    const question = await QuestionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy danh sách câu hỏi
exports.getQuestions = async (req, res) => {
  try {
    const questions = await QuestionService.getQuestions();
    res.json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy chi tiết câu hỏi theo ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await QuestionService.getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "⚠️ Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật trạng thái câu hỏi
exports.updateQuestionStatus = async (req, res) => {
  try {
    const question = await QuestionService.updateStatus(
      req.params.id,
      req.body.status
    );
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa câu hỏi
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await QuestionService.deleteQuestion(req.params.id);
    res.json({ message: "✅ Xóa câu hỏi thành công" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
