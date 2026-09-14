const VALID_SEVERITIES = new Set(["low", "medium", "high", "critical"]);

function normalizeString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  return null;
}

function validateMasterIssuePayload(payload = {}) {
  const departmentId = Number(payload.department_id);
  const code = normalizeString(payload.code);
  const title = normalizeString(payload.title);
  const description = normalizeString(payload.description);
  const severity = normalizeString(payload.severity).toLowerCase();
  const isActive =
    payload.is_active === undefined ? true : parseBoolean(payload.is_active);

  if (!Number.isInteger(departmentId) || departmentId <= 0) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Department ID is required and must be a positive integer.",
      },
    };
  }

  if (!code) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Master issue code is required.",
      },
    };
  }

  if (!title) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Title is required.",
      },
    };
  }

  if (!description) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Description is required.",
      },
    };
  }

  if (severity && !VALID_SEVERITIES.has(severity)) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Severity must be one of: low, medium, high, critical.",
      },
    };
  }

  if (isActive === null) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "is_active must be a boolean value.",
      },
    };
  }

  return {
    valid: true,
    data: {
      department_id: departmentId,
      code,
      title,
      description,
      severity: severity || "medium",
      is_active: isActive,
    },
  };
}

function validateMasterIssueUpdatePayload(payload = {}) {
  const allowedFields = new Set([
    "department_id",
    "title",
    "description",
    "severity",
    "is_active",
  ]);

  const unsupportedField = Object.keys(payload).find(
    (field) => !allowedFields.has(field),
  );

  if (unsupportedField) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Field "${unsupportedField}" is not allowed for master issue updates.`,
      },
    };
  }

  if (Object.keys(payload).length === 0) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "At least one valid field must be provided for the update.",
      },
    };
  }

  const nextPayload = {};

  if (payload.department_id !== undefined) {
    const departmentId = Number(payload.department_id);
    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      return {
        valid: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Department ID must be a positive integer.",
        },
      };
    }
    nextPayload.department_id = departmentId;
  }

  if (payload.title !== undefined) {
    const title = normalizeString(payload.title);
    if (!title) {
      return {
        valid: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Title cannot be empty.",
        },
      };
    }
    nextPayload.title = title;
  }

  if (payload.description !== undefined) {
    const description = normalizeString(payload.description);
    if (!description) {
      return {
        valid: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Description cannot be empty.",
        },
      };
    }
    nextPayload.description = description;
  }

  if (payload.severity !== undefined) {
    const severity = normalizeString(payload.severity).toLowerCase();
    if (!VALID_SEVERITIES.has(severity)) {
      return {
        valid: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Severity must be one of: low, medium, high, critical.",
        },
      };
    }
    nextPayload.severity = severity;
  }

  if (payload.is_active !== undefined) {
    const parsed = parseBoolean(payload.is_active);
    if (parsed === null) {
      return {
        valid: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "is_active must be a boolean value.",
        },
      };
    }
    nextPayload.is_active = parsed;
  }

  return {
    valid: true,
    data: nextPayload,
  };
}

module.exports = {
  VALID_SEVERITIES,
  validateMasterIssuePayload,
  validateMasterIssueUpdatePayload,
};
