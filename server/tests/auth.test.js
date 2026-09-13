const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateRegistration,
  validateLogin,
} = require("../validators/authValidator");

test("validateRegistration rejects invalid full name", () => {
  const result = validateRegistration({
    full_name: "  ",
    email: "citizen@example.com",
    password: "Password123",
    role: "CITIZEN",
  });

  assert.equal(result.valid, false);
  assert.match(result.message, /full name/i);
});

test("validateRegistration accepts valid citizen payload", () => {
  const result = validateRegistration({
    full_name: "Test Citizen",
    email: "citizen@example.com",
    password: "Password123",
    role: "CITIZEN",
  });

  assert.equal(result.valid, true);
  assert.equal(result.data.role, "CITIZEN");
});

test("validateLogin rejects short password", () => {
  const result = validateLogin({
    email: "citizen@example.com",
    password: "123",
  });

  assert.equal(result.valid, false);
  assert.match(result.message, /password/i);
});
