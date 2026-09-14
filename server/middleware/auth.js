const jwt = require("jsonwebtoken");

const { getUserById } = require("../services/authService");

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((accumulator, currentCookie) => {
      const [key, ...valueParts] = currentCookie.split("=");
      if (!key) return accumulator;
      accumulator[key] = decodeURIComponent(valueParts.join("="));
      return accumulator;
    }, {});
}

function getTokenFromRequest(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = parseCookies(cookieHeader);

  if (cookies.token) {
    return cookies.token;
  }

  const authorizationHeader = req.headers.authorization || "";
  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.replace("Bearer ", "").trim();
  }

  return null;
}

async function authenticate(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      const error = new Error("Authentication required.");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.id);

    req.user = user;
    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      const jwtError = new Error("Invalid or expired token.");
      jwtError.statusCode = 401;
      return next(jwtError);
    }

    return next(error);
  }
}

function requireRole(requiredRole) {
  return function requireRoleMiddleware(req, res, next) {
    const userRole = String(
      req.user && req.user.role ? req.user.role : "",
    ).toUpperCase();
    const targetRole = String(requiredRole || "").toUpperCase();

    if (userRole !== targetRole) {
      const error = new Error(
        `Only ${targetRole.toLowerCase()} users can access this resource.`,
      );
      error.statusCode = 403;
      error.code = "FORBIDDEN";
      return next(error);
    }

    return next();
  };
}

const requireAdmin = requireRole("ADMIN");

module.exports = {
  authenticate,
  getTokenFromRequest,
  requireRole,
  requireAdmin,
};
