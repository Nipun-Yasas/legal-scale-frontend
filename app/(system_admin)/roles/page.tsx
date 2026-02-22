"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Permission {
  key: string;
  label: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

const ALL_PERMISSIONS: Permission[] = [
  { key: "view_documents", label: "View Documents" },
  { key: "create_documents", label: "Create Documents" },
  { key: "edit_documents", label: "Edit Documents" },
  { key: "delete_documents", label: "Delete Documents" },
  { key: "approve_agreements", label: "Approve Agreements" },
  { key: "review_agreements", label: "Review Agreements" },
  { key: "manage_users", label: "Manage Users" },
  { key: "manage_roles", label: "Manage Roles" },
  { key: "view_reports", label: "View Reports" },
  { key: "system_config", label: "System Configuration" },
];

const ROLE_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-teal-500",
];

const initialRoles: Role[] = [
  {
    id: 1,
    name: "System Admin",
    description: "Full system access and configuration",
    userCount: 2,
    permissions: ALL_PERMISSIONS.map((p) => p.key),
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "Legal Officer",
    description: "Creates and manages legal documents",
    userCount: 12,
    permissions: ["view_documents", "create_documents", "edit_documents", "view_reports"],
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Legal Supervisor",
    description: "Oversees legal officers and reviews documents",
    userCount: 5,
    permissions: ["view_documents", "create_documents", "edit_documents", "delete_documents", "review_agreements", "view_reports"],
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Agreement Reviewer",
    description: "Reviews and comments on agreements",
    userCount: 8,
    permissions: ["view_documents", "review_agreements", "view_reports"],
    color: "bg-yellow-500",
  },
  {
    id: 5,
    name: "Agreement Approver",
    description: "Final approval authority for agreements",
    userCount: 4,
    permissions: ["view_documents", "approve_agreements", "review_agreements", "view_reports"],
    color: "bg-green-500",
  },
  {
    id: 6,
    name: "Management",
    description: "High-level visibility across the system",
    userCount: 3,
    permissions: ["view_documents", "approve_agreements", "view_reports"],
    color: "bg-orange-500",
  },
  {
    id: 7,
    name: "User",
    description: "Basic read-only access",
    userCount: 34,
    permissions: ["view_documents"],
    color: "bg-slate-500",
  },
];

/* ── Role Form Modal ── */
function RoleModal({
  role,
  onClose,
  onSave,
}: {
  role?: Role;
  onClose: () => void;
  onSave: (data: Omit<Role, "id" | "userCount">) => void;
}) {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [color, setColor] = useState(role?.color ?? ROLE_COLORS[0]);
  const [permissions, setPermissions] = useState<string[]>(role?.permissions ?? []);

  const togglePerm = (key: string) =>
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), color, permissions });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-textPrimary">
            {role ? "Edit Role" : "New Role"}
          </h3>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-textSecondary font-medium mb-1 block">
              Role Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Legal Officer"
              className="w-full bg-background border border-borderPrimary rounded-xl px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-textSecondary font-medium mb-1 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this role..."
              rows={2}
              className="w-full bg-background border border-borderPrimary rounded-xl px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-textSecondary font-medium mb-2 block">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {ROLE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-6 w-6 rounded-full transition-transform",
                    c,
                    color === c ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : ""
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-textSecondary font-medium mb-2 block">
              Permissions
            </label>
            <div className="grid grid-cols-1 gap-2">
              {ALL_PERMISSIONS.map((p) => (
                <label
                  key={p.key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(p.key)}
                    onChange={() => togglePerm(p.key)}
                    className="accent-blue-500 h-4 w-4 rounded"
                  />
                  <span className="text-sm text-textPrimary group-hover:text-textPrimary/80">
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-textSecondary border border-borderPrimary hover:bg-hoverPrimary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {role ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({
  role,
  onClose,
  onConfirm,
}: {
  role: Role;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-textPrimary">Delete Role</h3>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>
        <p className="text-sm text-textSecondary mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-textPrimary">{role.name}</span>? This action cannot be undone.
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
            className="px-4 py-2 rounded-xl text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  let nextId = Math.max(...roles.map((r) => r.id)) + 1;

  const handleCreate = (data: Omit<Role, "id" | "userCount">) => {
    setRoles((prev) => [...prev, { ...data, id: nextId++, userCount: 0 }]);
    setShowCreate(false);
  };

  const handleEdit = (data: Omit<Role, "id" | "userCount">) => {
    if (!editTarget) return;
    setRoles((prev) =>
      prev.map((r) => (r.id === editTarget.id ? { ...r, ...data } : r))
    );
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Roles</h1>
          <p className="text-sm text-textSecondary mt-1">
            Define roles and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Role
        </button>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                    role.color
                  )}
                >
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-textPrimary text-sm">{role.name}</p>
                  <p className="text-xs text-textSecondary">{role.userCount} users</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditTarget(role)}
                  className="p-1.5 rounded-lg hover:bg-hoverPrimary text-textSecondary transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(role)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-textSecondary hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-textSecondary leading-relaxed">
              {role.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {role.permissions.slice(0, 5).map((pk) => {
                const label = ALL_PERMISSIONS.find((p) => p.key === pk)?.label ?? pk;
                return (
                  <span
                    key={pk}
                    className="px-2 py-0.5 bg-hoverPrimary rounded-full text-xs text-textSecondary"
                  >
                    {label}
                  </span>
                );
              })}
              {role.permissions.length > 5 && (
                <span className="px-2 py-0.5 bg-hoverPrimary rounded-full text-xs text-textSecondary">
                  +{role.permissions.length - 5} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreate && (
        <RoleModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
      {editTarget && (
        <RoleModal
          role={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          role={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
