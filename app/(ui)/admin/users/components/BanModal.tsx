import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "../types";

export function BanModal({
    user,
    onClose,
    onConfirm,
    loading,
}: {
    user: User;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
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
                        disabled={loading}
                        className={cn(
                            "px-4 py-2 flex items-center gap-2 rounded-xl text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                            isBanned ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        )}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isBanned ? "Unban" : "Ban"}
                    </button>
                </div>
            </div>
        </div>
    );
}
