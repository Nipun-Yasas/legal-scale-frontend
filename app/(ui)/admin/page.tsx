"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    UserCheck,
    ShieldCheck,
    Activity,
    TrendingUp,
} from "lucide-react";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { Loading } from "@/_components/common/Loading";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => (
    <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
            <span className="text-sm text-textSecondary font-medium">{title}</span>
            <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-textPrimary">{value}</span>
            {trend && (
                <span className="text-xs text-green-500 mb-1 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> {trend}
                </span>
            )}
        </div>
    </div>
);



const roleColorMap: Record<string, string> = {
    SYSTEM_ADMIN: "bg-red-500",
    LEGAL_OFFICER: "bg-blue-500",
    LEGAL_SUPERVISOR: "bg-purple-500",
    AGREEMENT_REVIEWER: "bg-yellow-500",
    AGREEMENT_APPROVER: "bg-green-500",
    MANAGEMENT: "bg-orange-500",
    USER: "bg-slate-500",
};

const formatRoleName = (role: string) => {
    if (!role) return "Unknown";
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export default function AdminPage() {
    const [roleCounts, setRoleCounts] = useState<Record<string, number>>({
        SYSTEM_ADMIN: 0,
        LEGAL_OFFICER: 0,
        LEGAL_SUPERVISOR: 0,
        AGREEMENT_REVIEWER: 0,
        AGREEMENT_APPROVER: 0,
        MANAGEMENT: 0,
        USER: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCounts = async () => {
            try {
                const { data } = await axiosInstance.get(API_PATHS.ADMIN.GET_USER_COUNT);
                setRoleCounts(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error("Failed to fetch user counts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserCounts();
    }, []);

    const totalUsers = Object.values(roleCounts).reduce((sum, count) => sum + count, 0);

    const dynamicRoleData = Object.entries(roleCounts).map(([role, count]) => ({
        role: formatRoleName(role),
        count,
        color: roleColorMap[role] || "bg-blue-500"
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
                <p className="text-sm text-textSecondary mt-1">
                    System overview and user statistics
                </p>
            </div>

            {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Loading /></div>
            ) : (
                <>
                    {/* Top stat cards - Top 6 Roles excluding System Admin */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
                        <StatCard
                            title="Legal Officers"
                            value={roleCounts.LEGAL_OFFICER}
                            icon={<Users className="h-4 w-4 text-white" />}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Legal Supervisors"
                            value={roleCounts.LEGAL_SUPERVISOR}
                            icon={<ShieldCheck className="h-4 w-4 text-white" />}
                            color="bg-purple-600"
                        />
                        <StatCard
                            title="Reviewers"
                            value={roleCounts.AGREEMENT_REVIEWER}
                            icon={<UserCheck className="h-4 w-4 text-white" />}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            title="Approvers"
                            value={roleCounts.AGREEMENT_APPROVER}
                            icon={<UserCheck className="h-4 w-4 text-white" />}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Management"
                            value={roleCounts.MANAGEMENT}
                            icon={<TrendingUp className="h-4 w-4 text-white" />}
                            color="bg-orange-500"
                        />
                        <StatCard
                            title="Users"
                            value={roleCounts.USER}
                            icon={<Activity className="h-4 w-4 text-white" />}
                            color="bg-slate-500"
                        />
                    </div>

                    {/* Users by Role */}
                    <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-textPrimary mb-5">
                            Users by Role
                        </h2>
                        {dynamicRoleData.length === 0 ? (
                            <div className="text-sm text-textSecondary text-center py-4">No users found</div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {dynamicRoleData.map((item) => {
                                    const percent = Math.round((item.count / totalUsers) * 100) || 0;
                                    return (
                                        <div key={item.role} className="flex items-center gap-3">
                                            <span className="w-40 text-sm text-textSecondary shrink-0">
                                                {item.role}
                                            </span>
                                            <div className="flex-1 bg-borderPrimary rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`h-2.5 rounded-full ${item.color}`}
                                                    style={{ width: `${percent > 0 ? percent : 2}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-right text-sm font-medium text-textPrimary shrink-0">
                                                {item.count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
