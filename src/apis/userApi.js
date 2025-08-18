// frontend/src/apis/api.js
import axios from "axios";

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

// Company API endpoints
export const companyAPI = {
  getAll: () => api.get("/companies"),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

// Employee API endpoints
export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),

  // --- New employee-skill endpoints (added, matching your existing return style) ---
  // Fetch assigned skills for an employee
  getSkills: (employeeId) => api.get(`/employees/${employeeId}/skills`),

  // Assign a skill to an employee
  // payload: { skillId, proficiencyScore }
  addSkill: (employeeId, { skillId, proficiencyScore }) =>
    api.post(`/employees/${employeeId}/skills`, { skillId, proficiencyScore }),

  // Update an assigned skill (proficiencyScore)
  // payload: { proficiencyScore }
  updateSkill: (employeeId, skillId, { proficiencyScore }) =>
    api.put(`/employees/${employeeId}/skills/${skillId}`, { proficiencyScore }),

  // Delete an assigned skill
  deleteSkill: (employeeId, skillId) =>
    api.delete(`/employees/${employeeId}/skills/${skillId}`),
};

// Skills API endpoints
export const skillsAPI = {
  getAll: () => api.get("/skills").then((res) => res.data),
  create: (data) => api.post("/skills", data).then((res) => res.data),
  update: (id, data) => api.put(`/skills/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/skills/${id}`).then((res) => res.data),

  // --- New: users who have a particular skill ---
  getUsersBySkill: (skillId) =>
    api.get(`/skills/${skillId}/users`).then((res) => res.data),
};

// User API endpoints (profile)
export const userAPI = {
  getMe: () => api.get("/employees/me").then((res) => res.data),
};

export const dashboardAPI = {
  getSkillDistribution: () => api.get("/dashboard/skill-distribution").then(res => res.data),
  getSkillsByDepartment: () => api.get("/dashboard/skills-by-department").then(res => res.data),
  getRecentActivities: () => api.get("/dashboard/recent-activities").then(res => res.data),
  getTopSkills: () => api.get("/dashboard/top-skills").then(res => res.data),
};


export default api;
