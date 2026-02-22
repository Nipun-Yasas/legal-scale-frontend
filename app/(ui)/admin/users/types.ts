export type Role =
    | "LEGAL_OFFICER"
    | "LEGAL_SUPERVISOR"
    | "AGREEMENT_REVIEWER"
    | "AGREEMENT_APPROVER"
    | "MANAGEMENT"
    | "USER";

export type Status = "Active" | "Banned";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: Status;
}

export const ROLES: Role[] = [
    "LEGAL_OFFICER",
    "LEGAL_SUPERVISOR",
    "AGREEMENT_REVIEWER",
    "AGREEMENT_APPROVER",
    "MANAGEMENT",
    "USER",
];

export const formatRoleName = (role: string) => {
    if (!role) return "Unknown";
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};
