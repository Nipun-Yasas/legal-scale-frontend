import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role, User, ROLES, formatRoleName } from "../users/types";

export function ChangeRoleModal({
    user,
    onClose,
    onConfirm,
    loading,
}: {
    user: User;
    onClose: () => void;
    onConfirm: (role: Role, approverLevel: number | null) => void;
    loading?: boolean;
}) {
    const [selected, setSelected] = useState<Role>(user.role);
    const [approverLevel, setApproverLevel] = useState<number | null>(user.approverLevel || null);

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
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-xs text-textSecondary font-medium">Role</label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
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
                                {formatRoleName(r)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 mb-5">
                    <label className="text-xs text-textSecondary font-medium">Approver Level</label>
                    <select
                        value={approverLevel || ""}
                        onChange={(e) => setApproverLevel(e.target.value ? Number(e.target.value) : null)}
                        className="bg-backgroundSecondary border border-borderPrimary rounded-xl px-3 py-2 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="">None</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                    </select>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm text-textSecondary border border-borderPrimary hover:bg-hoverPrimary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(selected, approverLevel)}
                        disabled={loading}
                        className="px-4 py-2 flex items-center gap-2 rounded-xl text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
