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

    // Agreements
    APPROVAL: (Id: string) => `supervisor/agreements/${Id}/approve-reject`,
    SIGN: (Id: string) => `supervisor/agreements/${Id}/sign`,
  },
  OFFICER: {
    GET_ASSIGNED_CASES: "officer/cases",
    CHANGE_STATUS: (Id: string) => `officer/cases/${Id}/status`,
    ADD_COMMENT: (Id: string) => `officer/cases/${Id}/comments`,

    //Agreements
    REVIEW_AGREEMENT: (Id: string) => `officer/agreements/${Id}/pending-approval`,
    RESPONSE_REVISION: (Id: string) => `agreements/${Id}/respond-revision`,
  },
  AGREEMENT: {
    CREATE: "agreements",
    GET_ALL: "agreements/all",
    GET_OWN: "agreements/my",
    REQUEST_REVIEW: (Id: string) => `agreements/${Id}/request-review`,
    ADD_REVERSIONS: (Id: string) => `agreements/${Id}/revisions`
  }
};

export default axiosInstance;
