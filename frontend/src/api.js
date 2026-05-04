import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const client = axios.create({ baseURL: API_BASE });

const request = async (path, options = {}) => {
  const { body, token, headers = {}, ...init } = options;
  try {
    const response = await client.request({
      url: path,
      data: body,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...init,
    });
    return response.status === 204 ? null : response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        "Request failed";
      throw new Error(message);
    }
    throw new Error(error.message || "Network error");
  }
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password } });

export const register = (username, email, password) =>
  request("/auth/register", { method: "POST", body: { username, email, password } });

// ── Projects ──────────────────────────────────────────────────────────────────
export const getProjects = (token) => request("/projects", { token });
export const getProjectById = (token, projectId) => request(`/projects/${projectId}`, { token });
export const createProject = (token, payload) =>
  request("/projects", { method: "POST", token, body: payload });
export const updateProject = (token, projectId, payload) =>
  request(`/projects/${projectId}`, { method: "PUT", token, body: payload });
export const deleteProject = (token, projectId) =>
  request(`/projects/${projectId}`, { method: "DELETE", token });

// ── Project Members ───────────────────────────────────────────────────────────
export const addProjectMember = (token, projectId, userId) =>
  request(`/projects/${projectId}/members`, { method: "POST", token, body: { userId } });
export const removeProjectMember = (token, projectId, userId) =>
  request(`/projects/${projectId}/members/${userId}`, { method: "DELETE", token });

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const getProjectTasks = (token, projectId) =>
  request(`/projects/${projectId}/tasks`, { token });
export const createTask = (token, projectId, payload) =>
  request(`/projects/${projectId}/tasks`, { method: "POST", token, body: payload });
export const updateTaskStatus = (token, taskId, status) =>
  request(`/tasks/${taskId}/status`, { method: "PUT", token, body: { status } });
export const updateTask = (token, taskId, payload) =>
  request(`/tasks/${taskId}`, { method: "PUT", token, body: payload });
export const deleteTask = (token, taskId) =>
  request(`/tasks/${taskId}`, { method: "DELETE", token });

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboardStats = (token) => request("/dashboard/stats", { token });
export const getOverdueTasks = (token) => request("/dashboard/overdue", { token });

// ── Users ─────────────────────────────────────────────────────────────────────
export const searchUsers = (token, email) =>
  request(`/user/search?email=${encodeURIComponent(email)}`, { token });
