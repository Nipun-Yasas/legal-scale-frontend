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

const myCase = [
  { id: "CAS-031", title: "Vendor Payment Dispute", type: "Contract Dispute", status: "In Review", date: "2026-01-18" },
  { id: "CAS-038", title: "Office Equipment Damage Claim", type: "Employment", status: "Open", date: "2026-02-10" },
];

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
        <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary mb-1">
          User Portal
        </p>
        <h1 className="text-2xl font-bold text-textPrimary">Welcome back 👋</h1>
        <p className="text-sm text-textSecondary mt-1">
          Manage your cases and track agreement approvals
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Cases", value: myCase.length, icon: <Clock className="h-4 w-4 text-white" />, bg: "bg-blue-500" },
          { label: "Open Cases", value: myCase.filter(c => c.status === "Open").length, icon: <FilePlus2 className="h-4 w-4 text-white" />, bg: "bg-orange-500" },
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
          href="/user_dashboard/create-case"
          icon={<FilePlus2 className="h-5 w-5 text-white" />}
          label="Submit a New Case"
          description="File a legal case with relevant details"
          color="bg-blue-500"
        />
        <QuickCard
          href="/user_dashboard/agreements"
          icon={<HandshakeIcon className="h-5 w-5 text-white" />}
          label="View Agreements"
          description="Track your agreement approval status"
          color="bg-purple-500"
        />
      </div>

      {/* My Cases */}
      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-sm font-semibold text-textPrimary">My Cases</h2>
          <Link href="/user_dashboard/create-case" className="text-xs text-blue-500 hover:underline">
            + New Case
          </Link>
        </div>
        {myCase.length === 0 ? (
          <p className="text-center py-10 text-sm text-textSecondary">No cases yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary">
                {["ID", "Title", "Type", "Status", "Submitted"].map(h => (
                  <th key={h} className="text-left px-4 sm:px-6 py-3 text-textSecondary font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myCase.map(c => (
                <tr key={c.id} className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 font-mono text-xs text-textSecondary">{c.id}</td>
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-textPrimary min-w-[150px]">{c.title}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{c.type}</td>
                  <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColor[c.status])}>{c.status}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* My Agreements */}
      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-sm font-semibold text-textPrimary">My Agreements</h2>
          <Link href="/user_dashboard/agreements" className="text-xs text-blue-500 hover:underline">
            View all
          </Link>
        </div>
        {myAgreements.length === 0 ? (
          <p className="text-center py-10 text-sm text-textSecondary">No agreements yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary">
                {["ID", "Title", "Status", "Submitted"].map(h => (
                  <th key={h} className="text-left px-4 sm:px-6 py-3 text-textSecondary font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myAgreements.map(a => (
                <tr key={a.id} className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 font-mono text-xs text-textSecondary">{a.id}</td>
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-textPrimary min-w-[150px]">{a.title}</td>
                  <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColor[a.status])}>{a.status}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{a.date}</td>
                  Line 173:
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
