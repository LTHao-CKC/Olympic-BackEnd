const VideoSubmissionService = require('../services/videoSubmissionService');

class VideoSubmissionController {
  // Lấy danh sách video
  static async getVideoSubmissions(req, res) {
    try {
      const filters = {
        type: req.query.type,
        search: req.query.search
      };
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const result = await VideoSubmissionService.getVideoSubmissions(filters, page, limit);
      
      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách video thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Đã có lỗi xảy ra'
      });
    }
  }

  // Lấy chi tiết video
  static async getVideoSubmissionById(req, res) {
    try {
      const videoId = req.params.id;
      const video = await VideoSubmissionService.getVideoSubmissionById(videoId);
      
      res.status(200).json({
        status: 'success',
        message: 'Lấy thông tin video thành công',
        data: video
      });
    } catch (error) {
      res.status(error.message === 'Video không tồn tại' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Tạo video mới
  static async createVideoSubmission(req, res) {
    try {
      const videoData = req.body;
      const newVideo = await VideoSubmissionService.createVideoSubmission(videoData);
      
      res.status(201).json({
        status: 'success',
        message: 'Tạo video thành công',
        data: newVideo
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Cập nhật video
  static async updateVideoSubmission(req, res) {
    try {
      const videoId = req.params.id;
      const videoData = req.body;
      
      const updatedVideo = await VideoSubmissionService.updateVideoSubmission(videoId, videoData);
      
      res.status(200).json({
        status: 'success',
        message: 'Cập nhật video thành công',
        data: updatedVideo
      });
    } catch (error) {
      res.status(error.message === 'Video không tồn tại' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Xóa video
  static async deleteVideoSubmission(req, res) {
    try {
      const videoId = req.params.id;
      await VideoSubmissionService.deleteVideoSubmission(videoId);
      
      res.status(200).json({
        status: 'success',
        message: 'Xóa video thành công'
      });
    } catch (error) {
      res.status(error.message === 'Video không tồn tại' ? 404 : 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  // Lấy video theo loại
  static async getVideoSubmissionsByType(req, res) {
    try {
      const type = req.params.type;
      
      if (!['Team', 'Sponsor'].includes(type)) {
        return res.status(400).json({
          status: 'error',
          message: 'Loại video không hợp lệ. Chỉ chấp nhận "Team" hoặc "Sponsor"'
        });
      }
      
      const videos = await VideoSubmissionService.getVideoSubmissionsByType(type);
      
      res.status(200).json({
        status: 'success',
        message: `Lấy danh sách video loại ${type} thành công`,
        data: videos
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = VideoSubmissionController;