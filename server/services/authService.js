const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findByEmail,
  findById,
  sanitizeUser,
} = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = "7d";
const TOKEN_COOKIE_NAME = "token";

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_TTL,
    },
  );
}

function setAuthCookie(res, token) {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function registerUser(payload) {
  const existingUser = await findByEmail(payload.email);
  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(payload.password, 12);
  const newUser = await createUser({
    full_name: payload.full_name,
    email: payload.email,
    password_hash,
    role: payload.role,
  });

  const token = signToken(newUser);

  return {
    user: sanitizeUser(newUser),
    token,
  };
}

async function loginUser(payload) {
  const user = await findByEmail(payload.email);
  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.password_hash,
  );
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

async function getUserById(id) {
  const user = await findById(id);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  TOKEN_COOKIE_NAME,
  setAuthCookie,
  registerUser,
  loginUser,
  getUserById,
  signToken,
};
