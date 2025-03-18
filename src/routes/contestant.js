const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const router = express.Router();
const ContestantController = require("../controllers/contestantController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const validate = require("../middleware/validate");
const {
  createContestantSchema,
  updateContestantSchema,
} = require("../schemas/contestantSchema");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Lấy danh sách thí sinh theo class ,class_year, status ,
router.get("/list", ContestantController.getListContestants);
// Lấy danh sách thí sinh (public)
router.get("/", ContestantController.getContestants);

// Lấy chi tiết thí sinh (public)
router.get("/:id", ContestantController.getContestantById);

// Lay danh sach trang thai
router.get("/list/status", ContestantController.getListStatus);

// Lay danh sach lop
router.get("/list/class", ContestantController.getListClass);

router.get("/download/excel", ContestantController.downloadExcel);

//API lấy total thí sinh và thí sinh còn lại (status = đang thi)
router.get("/total", ContestantController.getTotalContestants);

/**
 * Các route dưới đây cần xác thực
 *  */
router.use(auth);

// Tạo thí sinh mới (admin)
router.post(
  "/upload/excel",
  upload.single("file"),
  role("admin"),
  ContestantController.uploadExcel
);

router.patch(
  "/update/group",
  role("admin"),
  ContestantController.updateContestantGroup
);
router.post(
  "/",
  role("admin"),
  validate(createContestantSchema),
  ContestantController.createContestant
);

// Cập nhật thí sinh (admin) - chỉ cập nhật những trường được gửi lên
router.patch(
  "/:id",
  role("admin"),
  validate(updateContestantSchema),
  ContestantController.updateContestant
);

// Cập nhật trạng thái thí sinh (admin hoặc judge)
router.patch("/:id/status", ContestantController.updateContestantStatus);

// Xóa thí sinh (admin)
router.delete("/:id", role("admin"), ContestantController.deleteContestant);

// lấy danh sách thí sinh theo group dựa vào judge_id và match_id (lấy tên group, tên trận đấu...)
router.get(
  "/judge-match/:judge_id/:match_id",
  role("judge"),
  ContestantController.getContestantByJudgeAndMatch
);

module.exports = router;
