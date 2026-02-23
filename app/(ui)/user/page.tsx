"use client";

import React from "react";
import {
  FilePlus2,
  HandshakeIcon,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";


const myAgreements = [
  { id: "AGR-011", title: "Freelance NDA — External Consultant", status: "Awaiting Signatories", date: "2026-01-25" },
  { id: "AGR-014", title: "Software Usage License", status: "Approved", date: "2026-02-03" },
];

const statusColor: Record<string, string> = {
  "Open": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "In Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Pending Approval": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Closed": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Awaiting Signatories": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Approved": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Rejected": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const QuickCard = ({
  href,
  icon,
  label,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}) => (
  <Link
    href={href}
    className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
  >
    <div className={cn("p-3 rounded-xl shrink-0", color)}>{icon}</div>
    <div className="flex-1">
      <p className="font-semibold text-textPrimary text-sm">{label}</p>
      <p className="text-xs text-textSecondary mt-0.5">{description}</p>
    </div>
    <ChevronRight className="h-4 w-4 text-textSecondary group-hover:translate-x-0.5 transition-transform shrink-0" />
  </Link>
);

export default function UserDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm text-textSecondary mt-1">
          Track your agreement approvals
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Agreements", value: myAgreements.length, icon: <HandshakeIcon className="h-4 w-4 text-white" />, bg: "bg-purple-500" },
          { label: "Approved", value: myAgreements.filter(a => a.status === "Approved").length, icon: <CheckCircle2 className="h-4 w-4 text-white" />, bg: "bg-green-500" },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-textSecondary font-medium">{label}</span>
              <div className={cn("p-2 rounded-xl", bg)}>{icon}</div>
            </div>
            <span className="text-3xl font-bold text-textPrimary">{value}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickCard
          href="/user/view-agreements"
          icon={<HandshakeIcon className="h-5 w-5 text-white" />}
          label="View Agreements"
          description="Track your agreement approval status"
          color="bg-purple-500"
        />
      </div>
    </div>
  );
}
