import { api } from "./api";

export const authService = {
  /**
   * Register a new user
   * @param {string} full_name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} role - User's role
   * @returns {Promise<Object>} - User data
   */
  async register(full_name, email, password, role = "CITIZEN") {
    const response = await api.post("/api/auth/register", {
      full_name,
      email,
      password,
      role,
    });

    if (!response.success) {
      throw new Error(
        response.message || "Registration failed"
      );
    }

    return response.user;
  },

  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - User data
   */
  async login(email, password) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    if (!response.success) {
      throw new Error(
        response.message || "Login failed"
      );
    }

    return response.user;
  },

  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  async logout() {
    const response = await api.post("/api/auth/logout");

    if (!response.success) {
      throw new Error(
        response.message || "Logout failed"
      );
    }
  },

  /**
   * Get the current authenticated user
   * @returns {Promise<Object>} - Current user data
   */
  async getCurrentUser() {
    const response = await api.get("/api/auth/me");

    if (!response.success) {
      throw new Error(
        response.message || "Failed to get current user"
      );
    }

    return response.user;
  },
};