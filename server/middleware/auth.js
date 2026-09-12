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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret",
    );
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

module.exports = {
  authenticate,
  getTokenFromRequest,
};
