import { api } from "./api";

export const masterIssueService = {
  async listMasterIssues({ departmentId = null, page = 1, limit = 100 } = {}) {
    const params = new URLSearchParams();

    if (departmentId) {
      params.set("department_id", String(departmentId));
    }

    params.set("page", String(page));
    params.set("limit", String(limit));

    const response = await api.get(`/api/master-issues?${params.toString()}`);

    if (!response.success) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "Unable to load master issues.",
      );
    }

    return (
      response.data || {
        masterIssues: [],
        pagination: {},
      }
    );
  },

  async getMasterIssueById(id) {
    const response = await api.get(`/api/master-issues/${id}`);

    if (!response.success) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "Unable to load master issue details.",
      );
    }

    return response.data || {};
  },

  async updateMasterIssueStatus(id, status) {
    const response = await api.patch(`/api/master-issues/${id}/status`, {
      status,
    });

    if (!response.success) {
      throw new Error(
        response.error?.message ||
          response.message ||
          "Unable to update master issue status.",
      );
    }

    return response.data || {};
  },
};
