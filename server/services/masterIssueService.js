const { pool } = require("../config/database");

const {
  createMasterIssue,
  findById,
  findByCode,
  findDepartmentById,
  findDepartmentByCode,
  countComplaintsByMasterIssueId,
  findAll,
  findComplaintsForMasterIssue,
  updateById,
  findCandidateMasterIssues,
  updateComplaintMasterIssue,
} = require("../models/masterIssueModel");

const {
  validateMasterIssuePayload,
  validateMasterIssueUpdatePayload,
} = require("../validators/masterIssueValidator");

const fuseIssues = require("../../ai/issueFusion/fuseIssues");

const DEPARTMENT_CODE_MAP = {
  "Roads & Infrastructure": "ROADS",
  "Street Lighting": "LIGHTING",
  "Sanitation & Waste": "SANITATION",
  "Water Supply": "WATER",
  Drainage: "DRAINAGE",
  "Public Safety": "SAFETY",
};

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

function normalizeSeverity(severity) {
  const value = Number(severity);

  if (value >= 9) return "critical";
  if (value >= 7) return "high";
  if (value >= 4) return "medium";

  return "low";
}

function getDepartmentCode(department, category) {
  const value = String(department || "").toLowerCase();
  const issueCategory = String(category || "").toLowerCase();

  // Prefer the AI issue category when it clearly maps to a department
  if (issueCategory.includes("drain")) return "DRAINAGE";
  if (issueCategory.includes("road") || issueCategory.includes("pothole")) {
    return "ROADS";
  }
  if (issueCategory.includes("light")) return "LIGHTING";
  if (issueCategory.includes("water")) return "WATER";
  if (issueCategory.includes("sanitation") || issueCategory.includes("waste")) {
    return "SANITATION";
  }
  if (issueCategory.includes("safety")) return "SAFETY";

  // Fallback to AI department
  if (value.includes("road")) return "ROADS";
  if (value.includes("light")) return "LIGHTING";
  if (value.includes("sanitation") || value.includes("waste")) {
    return "SANITATION";
  }
  if (value.includes("water")) return "WATER";
  if (value.includes("drain")) return "DRAINAGE";
  if (value.includes("safety") || value.includes("police")) return "SAFETY";

  return null;
}

async function createMasterIssueFromComplaint({
  complaintId,
  category,
  department,
  title,
  summary,
  severity,
}) {
  const departmentCode = getDepartmentCode(department, category);

  if (!departmentCode) {
    const error = new Error(
      `Unknown department returned by AI: ${department}.`,
    );
    error.statusCode = 422;
    error.code = "INVALID_AI_DEPARTMENT";
    throw error;
  }

  const departmentRecord = await findDepartmentByCode(departmentCode, pool);

  if (!departmentRecord) {
    const error = new Error(`Department "${departmentCode}" not found.`);
    error.statusCode = 404;
    error.code = "DEPARTMENT_NOT_FOUND";
    throw error;
  }

  const code = `MI-${departmentCode}-${Date.now()}-${complaintId}`;

  const masterIssue = await createMasterIssue(
    {
      department_id: departmentRecord.id,
      code,
      title: title.slice(0, 255),
      description: summary,
      severity: normalizeSeverity(severity),
      is_active: true,
    },
    pool,
  );

  await updateComplaintMasterIssue(complaintId, masterIssue.id, pool);

  return masterIssue;
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

async function attachOrCreateMasterIssue({
  complaintId,
  category,
  department,
  latitude,
  longitude,
  title,
  summary,
  severity,
}) {
  const candidates = await findCandidateMasterIssues({
    category,
    latitude,
    longitude,
    radiusKm: 2,
  });

  // No nearby same-category Master Issue
  if (!candidates.length) {
    const masterIssue = await createMasterIssueFromComplaint({
      complaintId,
      category,
      department,
      title,
      summary,
      severity,
    });

    return {
      action: "CREATED",
      masterIssue,
    };
  }

  // Compare the new complaint with each candidate separately.
  for (const candidate of candidates) {
    const reports = [
      {
        location: `${latitude},${longitude}`,
        category,
        description: summary || title,
        severity,
        source: "NEW_COMPLAINT",
      },
      {
        location: `${candidate.complaint_latitude},${candidate.complaint_longitude}`,
        category: candidate.ai_category,
        description:
          candidate.ai_summary || candidate.description || candidate.title,
        severity: candidate.ai_severity || candidate.severity,
        source: `MASTER_ISSUE_${candidate.id}`,
      },
    ];

    const fusionResult = await fuseIssues(reports);

    if (fusionResult && fusionResult.isSameIssue === true) {
      await updateComplaintMasterIssue(complaintId, candidate.id, pool);

      const complaintCount = await countComplaintsByMasterIssueId(
        candidate.id,
        pool,
      );

      return {
        action: "MERGED",
        masterIssue: candidate,
        complaintCount,
        fusion: fusionResult,
      };
    }
  }

  // Candidates existed, but none represented the same issue.
  const masterIssue = await createMasterIssueFromComplaint({
    complaintId,
    department,
    title,
    summary,
    severity,
  });

  return {
    action: "CREATED",
    masterIssue,
  };
}

module.exports = {
  createMasterIssueRecord,
  listMasterIssuesForAdmin,
  getMasterIssueByIdForAdmin,
  getMasterIssueComplaintsForAdmin,
  updateMasterIssueById,
  attachOrCreateMasterIssue,
};
