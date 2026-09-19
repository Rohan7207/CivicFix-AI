const API_BASE_URL = "http://localhost:5000";

async function apiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },

    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
  throw new Error(
    data.message ||
      data.error?.message ||
      data.error ||
      "Something went wrong"
  );
}

  return data;
}

export const api = {
  get: (endpoint) =>
    apiRequest(endpoint, {
      method: "GET",
    }),

post: (endpoint, body) =>
  apiRequest(endpoint, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),

  put: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    apiRequest(endpoint, {
      method: "DELETE",
    }),
};
