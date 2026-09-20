function validateRegistration(payload = {}) {
  const full_name =
    typeof payload.full_name === "string" ? payload.full_name.trim() : "";

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  const password = typeof payload.password === "string" ? payload.password : "";

  const role =
    typeof payload.role === "string"
      ? payload.role.trim().toUpperCase()
      : "CITIZEN";

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
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  const password = typeof payload.password === "string" ? payload.password : "";
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
