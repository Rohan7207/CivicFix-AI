const { pool } = require("../config/database");
const {
  createMasterIssue,
  findById,
  findByCode,
  findDepartmentById,
  countComplaintsByMasterIssueId,
  findAll,
  findComplaintsForMasterIssue,
  updateById,
} = require("../models/masterIssueModel");
const {
  validateMasterIssuePayload,
  validateMasterIssueUpdatePayload,
} = require("../validators/masterIssueValidator");

function parseMasterIssueId(rawId) {
  const value = Number(rawId);
  if (!Number.isInteger(value) || value <= 0) {
    const error = new Error("Master issue ID must be a positive integer.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
  return value;
}

function buildNotFoundError() {
  const error = new Error("Master issue not found.");
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  return error;
}

async function createMasterIssueRecord({ body }) {
  const validation = validateMasterIssuePayload(body || {});
  if (!validation.valid) {
    const error = new Error(validation.error.message);
    error.statusCode = 400;
    error.code = validation.error.code || "VALIDATION_ERROR";
    throw error;
  }

  const department = await findDepartmentById(
    validation.data.department_id,
    pool,
  );
  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    error.code = "NOT_FOUND";
    throw error;
  }

  const existing = await findByCode(validation.data.code, pool);
  if (existing) {
    const error = new Error("A master issue with this code already exists.");
    error.statusCode = 409;
    error.code = "CONFLICT";
    throw error;
  }

  const masterIssue = await createMasterIssue(validation.data, pool);
  return {
    masterIssue,
  };
}

async function listMasterIssuesForAdmin({
  page = 1,
  limit = 20,
  department_id = null,
}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100);
  const offset = (safePage - 1) * safeLimit;

  const issues = await findAll(
    {
      department_id,
      limit: safeLimit,
      offset,
    },
    pool,
  );

  return {
    masterIssues: issues,
    pagination: {
      page: safePage,
      limit: safeLimit,
      offset,
    },
  };
}

async function getMasterIssueByIdForAdmin({ masterIssueId }) {
  const id = parseMasterIssueId(masterIssueId);

  const masterIssue = await findById(id, pool);
  if (!masterIssue) {
    throw buildNotFoundError();
  }

  const complaintCount = await countComplaintsByMasterIssueId(id, pool);

  return {
    masterIssue: {
      ...masterIssue,
      complaint_count: complaintCount,
    },
  };
}

async function getMasterIssueComplaintsForAdmin({ masterIssueId }) {
  const id = parseMasterIssueId(masterIssueId);

  const masterIssue = await findById(id, pool);
  if (!masterIssue) {
    throw buildNotFoundError();
  }

  const complaints = await findComplaintsForMasterIssue(id, pool);

  return {
    masterIssueId: id,
    complaintCount: complaints.length,
    complaints,
  };
}

async function updateMasterIssueById({ masterIssueId, body }) {
  const id = parseMasterIssueId(masterIssueId);

  const existingIssue = await findById(id, pool);
  if (!existingIssue) {
    throw buildNotFoundError();
  }

  const validation = validateMasterIssueUpdatePayload(body || {});
  if (!validation.valid) {
    const error = new Error(validation.error.message);
    error.statusCode = 400;
    error.code = validation.error.code || "VALIDATION_ERROR";
    throw error;
  }

  if (
    validation.data.department_id !== undefined &&
    validation.data.department_id !== null
  ) {
    const department = await findDepartmentById(
      validation.data.department_id,
      pool,
    );
    if (!department) {
      const error = new Error("Department not found.");
      error.statusCode = 404;
      error.code = "NOT_FOUND";
      throw error;
    }
  }

  const updatedIssue = await updateById(id, validation.data, pool);
  return {
    masterIssue: updatedIssue,
  };
}

module.exports = {
  createMasterIssueRecord,
  listMasterIssuesForAdmin,
  getMasterIssueByIdForAdmin,
  getMasterIssueComplaintsForAdmin,
  updateMasterIssueById,
};
