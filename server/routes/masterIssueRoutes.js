const express = require("express");

const { authenticate, requireAdmin } = require("../middleware/auth");
const {
  createMasterIssue,
  listMasterIssues,
  getMasterIssueById,
  getMasterIssueComplaints,
  updateMasterIssue,
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
router.patch("/:id", authenticate, requireAdmin, updateMasterIssue);

module.exports = router;
