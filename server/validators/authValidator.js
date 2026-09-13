function validateRegistration(payload = {}) {
  const full_name = String(payload.full_name || "").trim();
  const email = String(payload.email || "")
    .trim()
    .toLowerCase();
  const password = String(payload.password || "");
  const role = String(payload.role || "CITIZEN")
    .trim()
    .toUpperCase();

  if (!full_name || full_name.length < 2) {
    return {
      valid: false,
      message: "Full name is required and must be at least 2 characters long.",
    };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      valid: false,
      message: "A valid email address is required.",
    };
  }

  if (!password || password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  return {
    valid: true,
    data: {
      full_name,
      email,
      password,
      role: "CITIZEN",
    },
  };
}

function validateLogin(payload = {}) {
  const email = String(payload.email || "")
    .trim()
    .toLowerCase();
  const password = String(payload.password || "");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      valid: false,
      message: "A valid email address is required.",
    };
  }

  if (!password || password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  return {
    valid: true,
    data: {
      email,
      password,
    },
  };
}

module.exports = {
  validateRegistration,
  validateLogin,
};
