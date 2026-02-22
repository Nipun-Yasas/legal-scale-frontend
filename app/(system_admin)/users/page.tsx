"use client";

import React, { useState } from "react";
import { Search, ChevronDown, X, ShieldCheck, Ban, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

type Role =
  | "System Admin"
  | "Legal Officer"
  | "Legal Supervisor"
  | "Agreement Reviewer"
  | "Agreement Approver"
  | "Management"
  | "User";

type Status = "Active" | "Banned";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;
}

const ROLES: Role[] = [
  "System Admin",
  "Legal Officer",
  "Legal Supervisor",
  "Agreement Reviewer",
  "Agreement Approver",
  "Management",
  "User",
];

const initialUsers: User[] = [
  { id: 1, name: "Alice Fernando", email: "alice@mobitel.lk", role: "Legal Officer", status: "Active", joined: "2024-01-10" },
  { id: 2, name: "Bob Perera", email: "bob@mobitel.lk", role: "Legal Supervisor", status: "Active", joined: "2024-02-15" },
  { id: 3, name: "Carol Silva", email: "carol@mobitel.lk", role: "Agreement Reviewer", status: "Active", joined: "2024-03-20" },
  { id: 4, name: "David Jayawardena", email: "david@mobitel.lk", role: "Agreement Approver", status: "Banned", joined: "2023-11-05" },
  { id: 5, name: "Eve Wickramasinghe", email: "eve@mobitel.lk", role: "Management", status: "Active", joined: "2023-09-01" },
  { id: 6, name: "Frank Rathnayake", email: "frank@mobitel.lk", role: "User", status: "Active", joined: "2024-06-12" },
  { id: 7, name: "Grace Mendis", email: "grace@mobitel.lk", role: "System Admin", status: "Active", joined: "2023-07-22" },
  { id: 8, name: "Henry Kumara", email: "henry@mobitel.lk", role: "Legal Officer", status: "Banned", joined: "2024-04-18" },
  { id: 9, name: "Iris Dissanayake", email: "iris@mobitel.lk", role: "User", status: "Active", joined: "2025-01-03" },
  { id: 10, name: "Jack Samarasinghe", email: "jack@mobitel.lk", role: "Agreement Reviewer", status: "Active", joined: "2025-02-07" },
];

const roleBadgeColor: Record<Role, string> = {
  "System Admin": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Legal Officer": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Legal Supervisor": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Agreement Reviewer": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Agreement Approver": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Management": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "User": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

/* ── Change Role Modal ── */
function ChangeRoleModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User;
  onClose: () => void;
  onConfirm: (role: Role) => void;
}) {
  const [selected, setSelected] = useState<Role>(user.role);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-textPrimary">Change Role</h3>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>
        <p className="text-sm text-textSecondary mb-4">
          Changing role for <span className="font-medium text-textPrimary">{user.name}</span>
        </p>
        <div className="flex flex-col gap-2 mb-5">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={cn(
                "text-left px-3 py-2 rounded-xl text-sm transition-colors",
                selected === r
                  ? "bg-blue-500 text-white"
                  : "hover:bg-hoverPrimary text-textPrimary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-textSecondary border border-borderPrimary hover:bg-hoverPrimary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="px-4 py-2 rounded-xl text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Ban Confirm Modal ── */
function BanModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isBanned = user.status === "Banned";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-textPrimary">
            {isBanned ? "Unban User" : "Ban User"}
          </h3>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>
        <p className="text-sm text-textSecondary mb-6">
          Are you sure you want to {isBanned ? "unban" : "ban"}{" "}
          <span className="font-medium text-textPrimary">{user.name}</span>?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-textSecondary border border-borderPrimary hover:bg-hoverPrimary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 rounded-xl text-sm text-white transition-colors",
              isBanned ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            )}
          >
            {isBanned ? "Unban" : "Ban"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "All">("All");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [changeRoleTarget, setChangeRoleTarget] = useState<User | null>(null);
  const [banTarget, setBanTarget] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    const matchStatus = filterStatus === "All" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleRoleChange = (role: Role) => {
    if (!changeRoleTarget) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === changeRoleTarget.id ? { ...u, role } : u))
    );
    setChangeRoleTarget(null);
  };

  const handleBanToggle = () => {
    if (!banTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === banTarget.id
          ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" }
          : u
      )
    );
    setBanTarget(null);
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
                {r}
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
              <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Joined</th>
              <th className="text-left px-5 py-3.5 text-textSecondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-textSecondary">
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
                      {user.role}
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
                  <td className="px-5 py-4 text-textSecondary">{user.joined}</td>
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
        />
      )}
      {banTarget && (
        <BanModal
          user={banTarget}
          onClose={() => setBanTarget(null)}
          onConfirm={handleBanToggle}
        />
      )}
    </div>
  );
}
