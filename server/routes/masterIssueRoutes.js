const express = require("express");

const { authenticate, requireAdmin } = require("../middleware/auth");
const {
  createMasterIssue,
  listMasterIssues,
  getMasterIssueById,
  getMasterIssueComplaints,
  updateMasterIssue,
  updateStatus,
} = require("../controllers/masterIssueController");

const router = express.Router();

router.post("/", authenticate, requireAdmin, createMasterIssue);
router.get("/", authenticate, requireAdmin, listMasterIssues);
router.get(
  "/:id/complaints",
  authenticate,
  requireAdmin,
  getMasterIssueComplaints,
);
router.get("/:id", authenticate, requireAdmin, getMasterIssueById);
router.patch("/:id/status", authenticate, requireAdmin, updateStatus);
router.patch("/:id", authenticate, requireAdmin, updateMasterIssue);

module.exports = router;
