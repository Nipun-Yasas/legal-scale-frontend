import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  ADMIN: {
    GET_USER_COUNT: "admin/role-counts",
    GET_USERS: "/admin",
    CHANGE_ROLE: "admin/change-role",
    BAN_USER: "admin/ban",
    UNBAN_USER: "admin/unban",
  }
};

export default axiosInstance;
