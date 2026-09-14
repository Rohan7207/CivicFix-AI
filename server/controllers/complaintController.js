const complaintService = require("../services/complaintService");

function respondWithError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

async function createComplaint(req, res) {
  try {
    console.log("REQ.FILES:", req.files);
    const result = await complaintService.createComplaintRecord({
      user: req.user,
      body: req.body,
      files: req.files || {},
    });

    return res.status(201).json({
      success: true,
      data: {
        complaint: result.complaint,
        evidence: result.evidence,
      },
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNAL_SERVER_ERROR",
      error.message || "Unable to create complaint.",
    );
  }
}

async function listComplaints(req, res) {
  try {
    const { status, page, limit } = req.query;
    const result = await complaintService.listComplaintsForUser({
      user: req.user,
      status,
      page,
      limit,
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
      error.message || "Unable to load complaints.",
    );
  }
}

async function getComplaintById(req, res) {
  try {
    const result = await complaintService.getComplaintByIdForUser({
      user: req.user,
      complaintId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      data: {
        complaint: result.complaint,
        evidence: result.evidence,
      },
    });
  } catch (error) {
    return respondWithError(
      res,
      error.statusCode || 500,
      error.code || "INTERNA_SERVER_ERROR",
      error.message || "Complaint not found or not accessible.",
    );
  }
}

module.exports = {
  createComplaint,
  listComplaints,
  getComplaintById,
};
