const express = require("express");
const multer = require("multer");

const { authenticate, requireAdmin } = require("../middleware/auth");
const {
  createComplaint,
  listComplaints,
  getComplaintById,
  verifyComplaint,
} = require("../controllers/complaintController");

const { updateStatus } = require("../controllers/masterIssueController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  createComplaint,
);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "Uploaded file exceeds the allowed size limit.",
        },
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "UNEXPECTED_FILE",
          message: "Unexpected file field.",
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        code: "FILE_UPLOAD_ERROR",
        message: err.message,
      },
    });
  }

  next(err);
});

router.get("/", authenticate, listComplaints);
router.post("/:id/verify", authenticate, verifyComplaint);
router.patch("/:id/status", authenticate, requireAdmin, updateStatus);
router.get("/:id", authenticate, getComplaintById);

module.exports = router;
