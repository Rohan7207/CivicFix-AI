const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateMasterIssuePayload,
  validateMasterIssueUpdatePayload,
} = require("../validators/masterIssueValidator");

test("validateMasterIssuePayload rejects missing required fields", () => {
  const result = validateMasterIssuePayload({
    department_id: 1,
    code: "MI-2026-001",
    title: "",
    description: "A pothole issue",
    severity: "high",
  });

  assert.equal(result.valid, false);
  assert.match(result.error.message, /title/i);
});

test("validateMasterIssuePayload accepts valid master issue payload", () => {
  const result = validateMasterIssuePayload({
    department_id: 1,
    code: "MI-2026-001",
    title: "Large road pothole",
    description:
      "A large pothole is creating traffic hazards on the main street.",
    severity: "high",
    is_active: true,
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.severity, "high");
  assert.equal(result.data.is_active, true);
});

test("validateMasterIssueUpdatePayload rejects unsupported update fields", () => {
  const result = validateMasterIssueUpdatePayload({
    title: "Updated title",
    status: "IN_PROGRESS",
  });

  assert.equal(result.valid, false);
  assert.match(result.error.message, /not allowed/i);
});
