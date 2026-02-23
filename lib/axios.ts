import axios from "axios";
import { Download } from "lucide-react";

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
  },
  DOC: {
    DOWNLOAD_DOC: (Id: string) => `/${Id}/download`,
  },
  CASE: {
    ATTACHMENT_DOCUMENT: (Id: string) => `cases/${Id}/attachments`,
  },
  SUPERVISOR: {
    CREATE_CASE: "supervisor/cases",
    GET_ALL_NEW_CASES: "supervisor/cases/new",
    GET_OWN_CASES: "supervisor/cases/my",
    GET_LEGAL_OFFICERS: "supervisor/cases/officers",
    ASSIGN_CASE: (Id: string) => `supervisor/cases/${Id}/assign`,
    ADD_COMMENT: (Id: string) => `supervisor/cases/${Id}/comments`,
    GET_COMMENT_AND_REMARKS: "supervisor/cases/activities",
    ATTACH_DOCUMENTS: (Id: string) => `supervisor/cases/${Id}/attachments`,
  },
  OFFICER: {
    GET_ASSIGNED_CASES: "officer/cases",
    CHANGE_STATUS: (Id: string) => `officer/cases/${Id}/status`,
    ADD_COMMENT: (Id: string) => `officer/cases/${Id}/comments`,
  }
};

export default axiosInstance;
