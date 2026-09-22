import { api } from "./api";

export const complaintService = {
  async listComplaints({ status = null, page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();

    if (status) {
      params.set("status", status);
    }

    params.set("page", String(page));
    params.set("limit", String(limit));

    const query = params.toString();
    const response = await api.get(
      `/api/complaints${query ? `?${query}` : ""}`,
    );

    if (!response.success) {
      throw new Error(response.message || "Unable to load complaints.");
    }

    return response.data || { complaints: [], pagination: {} };
  },

  async getComplaintById(id) {
    const response = await api.get(`/api/complaints/${id}`);

    if (!response.success) {
      throw new Error(response.message || "Unable to load complaint details.");
    }

    return response.data || {};
  },

  async verifyComplaint(id, resolved) {
    const response = await api.post(`/api/complaints/${id}/verify`, {
      resolved,
    });

    if (!response.success) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "Unable to verify complaint.",
      );
    }

    return response.data || {};
  },

  async updateComplaintStatus(id, status) {
    const response = await api.patch(`/api/complaints/${id}/status`, {
      status,
    });

    if (!response.success) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "Unable to update complaint status.",
      );
    }

    return response.data || {};
  },
};
