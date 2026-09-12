const authService = require("../services/authService");
const {
  validateRegistration,
  validateLogin,
} = require("../validators/authValidator");

async function register(req, res, next) {
  try {
    const validation = validateRegistration(req.body);
    if (!validation.valid) {
      const error = new Error(validation.message);
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.registerUser(validation.data);
    authService.setAuthCookie(res, result.token);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const validation = validateLogin(req.body);
    if (!validation.valid) {
      const error = new Error(validation.message);
      error.statusCode = 400;
      throw error;
    }

    const result = await authService.loginUser(validation.data);
    authService.setAuthCookie(res, result.token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
