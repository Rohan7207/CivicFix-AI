const masterIssueService = require("../services/masterIssueService");
const { updateMasterIssueStatus } = require("../services/masterIssueService");

function respondWithError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

async function createMasterIssue(req, res) {
  try {
    const result = await masterIssueService.createMasterIssueRecord({
      body: req.body,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Unable to create master issue.",
    );
  }
}

async function listMasterIssues(req, res) {
  try {
    const result = await masterIssueService.listMasterIssuesForAdmin({
      page: req.query.page,
      limit: req.query.limit,
      department_id: req.query.department_id,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Unable to load master issues.",
    );
  }
}

async function getMasterIssueById(req, res) {
  try {
    const result = await masterIssueService.getMasterIssueByIdForAdmin({
      masterIssueId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Unable to load master issue.",
    );
  }
}

async function getMasterIssueComplaints(req, res) {
  try {
    const result = await masterIssueService.getMasterIssueComplaintsForAdmin({
      masterIssueId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Unable to load master issue complaints.",
    );
  }
}

async function updateMasterIssue(req, res) {
  try {
    const result = await masterIssueService.updateMasterIssueById({
      masterIssueId: req.params.id,
      body: req.body,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Unable to update master issue.",
    );
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const masterIssue = await updateMasterIssueStatus(id, status);

    res.status(200).json({
      success: true,
      data: {
        masterIssue,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMasterIssue,
  listMasterIssues,
  getMasterIssueById,
  getMasterIssueComplaints,
  updateMasterIssue,
  updateStatus,
};
