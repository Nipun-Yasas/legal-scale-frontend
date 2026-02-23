import React from "react";
import {
    LayoutDashboard,
    FilePlus2,
    HandshakeIcon,
    Users,
    Settings,
    ShieldCheck,
    FileSearch,
    GitBranch
} from "lucide-react";

export const getNavigation = (role?: string) => {
    switch (role) {
        case "SYSTEM_ADMIN":
            return [
                {
                    label: "Dashboard",
                    href: "/admin",
                    icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Users",
                    href: "/admin/users",
                    icon: <Users className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Roles",
                    href: "/admin/roles",
                    icon: <ShieldCheck className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Settings",
                    href: "/admin/system",
                    icon: <Settings className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
            ];
        case "LEGAL_SUPERVISOR":
            return [
                {
                    label: "Dashboard",
                    href: "/supervisor",
                    icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Cases",
                    href: "/supervisor/create",
                    icon: <FilePlus2 className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Legal Officers",
                    href: "/supervisor/officers",
                    icon: <Users className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Documents",
                    href: "/supervisor/documents",
                    icon: <FileSearch className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Case Shifts",
                    href: "/supervisor/case-shifts",
                    icon: <GitBranch className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
            ];

        case "LEGAL_OFFICER":
        case "AGREEMENT_REVIEWER":
        case "AGREEMENT_APPROVER":
        case "MANAGEMENT":
            return [
                {
                    label: "Dashboard",
                    href: `/${role.toLowerCase().replace('_', '-')}/dashboard`,
                    icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Cases",
                    href: `/${role.toLowerCase().replace('_', '-')}/cases`,
                    icon: <FilePlus2 className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Agreements",
                    href: `/${role.toLowerCase().replace('_', '-')}/agreements`,
                    icon: <HandshakeIcon className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
            ];
        case "USER":
            return [
                {
                    label: "Dashboard",
                    href: "/user",
                    icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
                {
                    label: "Agreements",
                    href: "/user/agreements",
                    icon: <HandshakeIcon className="h-5 w-5 shrink-0 text-textSecondary" />,
                },
            ];
        default:
            return [];
    }
};
