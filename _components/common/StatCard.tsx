import { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number | ReactNode;
    icon: ReactNode;
    color: string;
    trend?: string;
}

export const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => (
    <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
            <span className="text-sm text-textSecondary font-medium">{title}</span>
            <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
        </div>
        <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-textPrimary">{value}</div>
            {trend && (
                <span className="text-xs text-green-500 mb-1 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> {trend}
                </span>
            )}
        </div>
    </div>
);