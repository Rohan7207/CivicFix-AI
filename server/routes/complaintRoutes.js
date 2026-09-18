const express = require("express");
const multer = require("multer");

const { authenticate } = require("../middleware/auth");
const {
  createComplaint,
  listComplaints,
  getComplaintById,
  verifyComplaint,
} = require("../controllers/complaintController");

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
router.get("/", authenticate, listComplaints);
router.post("/:id/verify", authenticate, verifyComplaint);
router.get("/:id", authenticate, getComplaintById);

module.exports = router;
