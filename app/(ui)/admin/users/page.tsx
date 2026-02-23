"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Ban, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

import axiosInstance, { API_PATHS } from "@/lib/axios";
import { toast } from "sonner";

import { Role, Status, User, ROLES, formatRoleName } from "./types";
import { ChangeRoleModal } from "../_components/ChangeRoleModal";
import { BanModal } from "../_components/BanModal";

const roleBadgeColor: Record<string, string> = {
    "SYSTEM_ADMIN": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "LEGAL_OFFICER": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "LEGAL_SUPERVISOR": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "AGREEMENT_REVIEWER": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "AGREEMENT_APPROVER": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "MANAGEMENT": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "USER": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

/* ── Main Page ── */
export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<Role | "All">("All");
    const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
    const [changeRoleTarget, setChangeRoleTarget] = useState<User | null>(null);
    const [banTarget, setBanTarget] = useState<User | null>(null);
    const [isRoleChanging, setIsRoleChanging] = useState(false);
    const [isBanning, setIsBanning] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axiosInstance.get(API_PATHS.ADMIN.GET_USERS);
                const mapped: User[] = data.map((u: any) => ({
                    id: u.id,
                    name: u.fullName || u.email,
                    email: u.email,
                    role: u.roleName || "USER",
                    status: u.banned ? "Banned" : "Active",
                    approverLevel: u.approverLevel || null,
                }));
                setUsers(mapped);
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "All" || u.role === filterRole;
        const matchStatus = filterStatus === "All" || u.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const handleRoleChange = async (role: Role, approverLevel: number | null) => {
        if (!changeRoleTarget) return;

        setIsRoleChanging(true);
        try {
            await axiosInstance.patch(API_PATHS.ADMIN.CHANGE_ROLE, {
                email: changeRoleTarget.email,
                newRole: role,
                approverLevel: approverLevel,
            });
            setUsers((prev) =>
                prev.map((u) => (u.id === changeRoleTarget.id ? { ...u, role, approverLevel } : u))
            );
            toast.success(`Role changed to ${formatRoleName(role)} successfully.`);
        } catch (error) {
            console.error("Failed to change role", error);
            toast.error("Failed to change role. Please try again.");
        } finally {
            setIsRoleChanging(false);
            setChangeRoleTarget(null);
        }
    };

    const handleBanToggle = async () => {
        if (!banTarget) return;
        setIsBanning(true);
        const isBanned = banTarget.status === "Banned";
        const url = isBanned ? API_PATHS.ADMIN.UNBAN_USER : API_PATHS.ADMIN.BAN_USER;

        try {
            await axiosInstance.patch(`${url}?email=${encodeURIComponent(banTarget.email)}`);
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === banTarget.id
                        ? { ...u, status: isBanned ? "Active" : "Banned" }
                        : u
                )
            );
            toast.success(isBanned ? "User unbanned successfully." : "User banned successfully.");
        } catch (error) {
            console.error(isBanned ? "Failed to unban user" : "Failed to ban user", error);
            toast.error(isBanned ? "Failed to unban user." : "Failed to ban user.");
        } finally {
            setIsBanning(false);
            setBanTarget(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-textPrimary">Users</h1>
                <p className="text-sm text-textSecondary mt-1">
                    Manage all registered users, change roles, or ban accounts
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-backgroundSecondary border border-borderPrimary rounded-xl pl-9 pr-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Role filter */}
                <div className="relative">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as Role | "All")}
                        className="appearance-none bg-backgroundSecondary border border-borderPrimary rounded-xl px-3 py-2 pr-8 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>
                                {formatRoleName(r)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textSecondary pointer-events-none" />
                </div>

                {/* Status filter */}
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as Status | "All")}
                        className="appearance-none bg-backgroundSecondary border border-borderPrimary rounded-xl px-3 py-2 pr-8 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Banned">Banned</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textSecondary pointer-events-none" />
                </div>

                <span className="text-xs text-textSecondary w-full sm:w-auto sm:ml-auto">
                    {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-borderPrimary">
                            <th className="text-left px-5 py-3.5 text-textSecondary font-medium">#</th>
                            <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Name</th>
                            <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Email</th>
                            <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Role</th>
                            <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Status</th>
                            <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b border-borderPrimary animate-pulse">
                                    <td className="px-5 py-4"><div className="h-4 w-4 bg-hoverPrimary rounded"></div></td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-hoverPrimary"></div>
                                            <div className="h-4 w-32 bg-hoverPrimary rounded"></div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4"><div className="h-4 w-48 bg-hoverPrimary rounded"></div></td>
                                    <td className="px-5 py-4"><div className="h-5 w-24 bg-hoverPrimary rounded-full"></div></td>
                                    <td className="px-5 py-4"><div className="h-5 w-16 bg-hoverPrimary rounded-full"></div></td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <div className="h-7 w-16 bg-hoverPrimary rounded-lg"></div>
                                            <div className="h-7 w-16 bg-hoverPrimary rounded-lg"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-textSecondary">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((user, idx) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary transition-colors"
                                >
                                    <td className="px-5 py-4 text-textSecondary">{idx + 1}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-semibold text-blue-500">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-textPrimary">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-textSecondary">{user.email}</td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                roleBadgeColor[user.role]
                                            )}
                                        >
                                            {formatRoleName(user.role)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                user.status === "Active"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    user.status === "Active" ? "bg-green-500" : "bg-red-500"
                                                )}
                                            />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setChangeRoleTarget(user)}
                                                title="Change Role"
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                                            >
                                                <UserCog className="h-3.5 w-3.5" />
                                                Role
                                            </button>
                                            <button
                                                onClick={() => setBanTarget(user)}
                                                title={user.status === "Banned" ? "Unban" : "Ban"}
                                                className={cn(
                                                    "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                                    user.status === "Banned"
                                                        ? "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                                        : "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                                )}
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                                {user.status === "Banned" ? "Unban" : "Ban"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {changeRoleTarget && (
                <ChangeRoleModal
                    user={changeRoleTarget}
                    onClose={() => setChangeRoleTarget(null)}
                    onConfirm={handleRoleChange}
                    loading={isRoleChanging}
                />
            )}
            {banTarget && (
                <BanModal
                    user={banTarget}
                    onClose={() => setBanTarget(null)}
                    onConfirm={handleBanToggle}
                    loading={isBanning}
                />
            )}
        </div>
    );
}
