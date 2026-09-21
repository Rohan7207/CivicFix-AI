import { api } from "./api";

function getUserPayload(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  if (response.data && typeof response.data === "object") {
    return response.data.user ?? response.data;
  }

  return response.user ?? response;
}

function getErrorFromResponse(response, fallbackMessage) {
  const error = new Error(
    response?.error?.message || response?.message || fallbackMessage,
  );
  error.code = response?.error?.code || response?.code || "AUTH_ERROR";
  return error;
}

export const authService = {
  async register(full_name, email, password) {
    const response = await api.post("/api/auth/register", {
      full_name,
      email,
      password,
      role: "CITIZEN",
    });

    if (!response.success) {
      throw getErrorFromResponse(response, "Registration failed.");
    }

    return getUserPayload(response);
  },

  async login(email, password) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    if (!response.success) {
      throw getErrorFromResponse(response, "Login failed.");
    }

    return getUserPayload(response);
  },

  async logout() {
    const response = await api.post("/api/auth/logout");

    if (!response.success) {
      throw getErrorFromResponse(response, "Logout failed.");
    }
  },

  async getCurrentUser() {
    const response = await api.get("/api/auth/me");

    if (!response.success) {
      throw getErrorFromResponse(response, "Failed to get current user.");
    }

    return getUserPayload(response);
  },
};
