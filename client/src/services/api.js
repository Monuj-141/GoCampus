const BASE_URL ="https://gocampus-rv8r.onrender.com/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("connectcampus_token");

  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : { "Content-Type": "application/json", ...(options.headers || {}) };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth API
export const authAPI = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  getMe: () => request("/auth/me"),
  updateProfile: (profileData) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),
  changePassword: (passwords) =>
    request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    }),
  verifyEmail: (token) => request(`/auth/verify-email/${token}`),
  resendVerification: () =>
    request("/auth/resend-verification", { method: "POST" }),
  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, newPassword) =>
    request(`/auth/reset-password/${token}`, {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
    }),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.status) query.append("status", params.status);
    if (params.featured) query.append("featured", params.featured);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request(`/events${qs}`);
  },
  getById: (id) => request(`/events/${id}`),
  create: (eventData) =>
    request("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),
  update: (id, eventData) =>
    request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),
  delete: (id) =>
    request(`/events/${id}`, {
      method: "DELETE",
    }),
  getAttendees: (id) => request(`/events/${id}/attendees`),
};

// Notices API
export const noticesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.department && params.department !== "All") query.append("department", params.department);
    if (params.important !== undefined) query.append("important", params.important);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request(`/notices${qs}`);
  },
  getById: (id) => request(`/notices/${id}`),
  create: (noticeData) =>
    request("/notices", {
      method: "POST",
      body: JSON.stringify(noticeData),
    }),
  update: (id, noticeData) =>
    request(`/notices/${id}`, {
      method: "PUT",
      body: JSON.stringify(noticeData),
    }),
  delete: (id) =>
    request(`/notices/${id}`, {
      method: "DELETE",
    }),
};

// Registrations API
export const registrationsAPI = {
  register: (eventId) =>
    request(`/registrations/${eventId}`, {
      method: "POST",
    }),
  cancel: (eventId) =>
    request(`/registrations/${eventId}`, {
      method: "DELETE",
    }),
  getMy: () => request("/registrations/my"),
  getAll: () => request("/registrations/all"),
};

// Stats API
export const statsAPI = {
  getOverview: () => request("/stats/overview"),
};

export default {
  auth: authAPI,
  events: eventsAPI,
  notices: noticesAPI,
  registrations: registrationsAPI,
  stats: statsAPI,
};
