"use client";

import React from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Activity,
  TrendingUp,
} from "lucide-react";

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

const roleData = [
  { role: "Legal Officer", count: 12, color: "bg-blue-500" },
  { role: "Legal Supervisor", count: 5, color: "bg-purple-500" },
  { role: "Agreement Reviewer", count: 8, color: "bg-yellow-500" },
  { role: "Agreement Approver", count: 4, color: "bg-green-500" },
  { role: "Management", count: 3, color: "bg-orange-500" },
  { role: "System Admin", count: 2, color: "bg-red-500" },
  { role: "User", count: 34, color: "bg-slate-500" },
];

const totalUsers = roleData.reduce((sum, r) => sum + r.count, 0);

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
        <p className="text-sm text-textSecondary mt-1">
          System overview and user statistics
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Users"
          value={totalUsers}
          icon={<Users className="h-4 w-4 text-white" />}
          color="bg-blue-500"
          trend="+4 this week"
        />
        <StatCard
          title="Admins"
          value={2}
          icon={<ShieldCheck className="h-4 w-4 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="Legal Officers"
          value={12}
          icon={<UserCheck className="h-4 w-4 text-white" />}
          color="bg-purple-500"
          trend="+2 this month"
        />
        <StatCard
          title="Active Sessions"
          value={28}
          icon={<Activity className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />
      </div>

      {/* Users by Role */}
      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
        <h2 className="text-base font-semibold text-textPrimary mb-5">
          Users by Role
        </h2>
        <div className="flex flex-col gap-3">
          {roleData.map((item) => {
            const percent = Math.round((item.count / totalUsers) * 100);
            return (
              <div key={item.role} className="flex items-center gap-3">
                <span className="w-40 text-sm text-textSecondary shrink-0">
                  {item.role}
                </span>
                <div className="flex-1 bg-borderPrimary rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${item.color}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium text-textPrimary shrink-0">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
