import axios from "axios";

const USER_SESSION_KEY = "user";
const ADMIN_SESSION_KEY = "admin";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const ADMIN_CREDENTIALS = {
  email: "admin@yojanasathi.gov",
  password: "admin123",
};

export const getUsers = async () => {
  const { data } = await apiClient.get("/api/users");
  return Array.isArray(data) ? data : [];
};

export const deleteUserById = async (userId) => {
  const { data } = await apiClient.delete(`/api/users/${userId}`);
  return data;
};

export const toggleUserBan = async (userId, banned) => {
  const { data } = await apiClient.patch(`/api/users/ban/${userId}`, { banned });
  return data?.user;
};

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem(USER_SESSION_KEY) || "null");

export const getAdminSession = () => {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  if (raw === "true") {
    return { email: ADMIN_CREDENTIALS.email, role: "admin" };
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
};

export const isAdminLoggedIn = () => getAdminSession() !== null;

export const isUserLoggedIn = () => getCurrentUser() !== null;

export const isAuthenticated = () => isAdminLoggedIn() || isUserLoggedIn();

export const registerUser = async (payload) => {
  try {
    const { data } = await apiClient.post("/api/auth/register", payload);

    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.user));
    return { ok: true, user: data.user };
  } catch (error) {
    return { ok: false, message: error?.response?.data?.message || "Unable to connect to server." };
  }
};

export const login = async ({ email, password }) => {
  try {
    const { data } = await apiClient.post("/api/auth/login", { email, password });

    if (data?.role === "admin") {
      localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({
          email: data?.admin?.email || ADMIN_CREDENTIALS.email,
          role: "admin",
          loginAt: new Date().toISOString(),
        })
      );
      localStorage.removeItem(USER_SESSION_KEY);
      return { ok: true, role: "admin", redirectTo: "/admin/dashboard" };
    }

    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.user));
    return { ok: true, role: "user", redirectTo: "/dashboard", user: data.user };
  } catch (error) {
    return { ok: false, message: error?.response?.data?.message || "Unable to connect to server." };
  }
};

export const logout = () => {
  localStorage.removeItem(USER_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
};
