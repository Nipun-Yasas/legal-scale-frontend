"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type CaseType = "Contract Dispute" | "Employment" | "IP & Patents" | "Regulatory" | "Litigation";
type CaseStatus = "Open" | "In Review" | "Pending Approval" | "Closed" | "Escalated";
type Priority = "High" | "Medium" | "Low";

interface Case {
  id: string;
  title: string;
  type: CaseType;
  status: CaseStatus;
  priority: Priority;
  officer: string;
  opened: string;
  exposure: string;
}

const cases: Case[] = [
  { id: "CAS-001", title: "SLT vs Mobitel Spectrum Dispute", type: "Regulatory", status: "Escalated", priority: "High", officer: "Alice F.", opened: "2025-10-12", exposure: "LKR 4.2M" },
  { id: "CAS-002", title: "Employee Termination Appeal", type: "Employment", status: "In Review", priority: "Medium", officer: "Bob P.", opened: "2025-11-03", exposure: "LKR 0.8M" },
  { id: "CAS-003", title: "Vendor Contract Breach", type: "Contract Dispute", status: "Open", priority: "High", officer: "Carol S.", opened: "2025-12-15", exposure: "LKR 2.1M" },
  { id: "CAS-004", title: "Logo Trademark Infringement", type: "IP & Patents", status: "Closed", priority: "Low", officer: "David J.", opened: "2025-09-01", exposure: "LKR 0.3M" },
  { id: "CAS-005", title: "Contractor Non-Compete Violation", type: "Employment", status: "Open", priority: "Medium", officer: "Eve W.", opened: "2026-01-08", exposure: "LKR 1.0M" },
  { id: "CAS-006", title: "Tower Lease Dispute", type: "Contract Dispute", status: "Pending Approval", priority: "High", officer: "Frank R.", opened: "2026-01-20", exposure: "LKR 3.5M" },
  { id: "CAS-007", title: "TRCSL Compliance Investigation", type: "Regulatory", status: "In Review", priority: "High", officer: "Alice F.", opened: "2026-02-05", exposure: "LKR 5.0M" },
  { id: "CAS-008", title: "Software License Dispute", type: "IP & Patents", status: "Open", priority: "Medium", officer: "Carol S.", opened: "2026-02-10", exposure: "LKR 0.6M" },
];

const statusColor: Record<CaseStatus, string> = {
  Open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "In Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Pending Approval": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Closed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Escalated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const priorityColor: Record<Priority, string> = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
};

const TYPES: (CaseType | "All")[] = ["All", "Contract Dispute", "Employment", "IP & Patents", "Regulatory", "Litigation"];
const STATUSES: (CaseStatus | "All")[] = ["All", "Open", "In Review", "Pending Approval", "Closed", "Escalated"];

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<CaseType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<CaseStatus | "All">("All");

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.officer.toLowerCase().includes(q);
    const matchType = filterType === "All" || c.type === filterType;
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Cases</h1>
        <p className="text-sm text-textSecondary mt-1">All active and historical legal cases</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases..."
            className="w-full bg-backgroundSecondary border border-borderPrimary rounded-xl pl-9 pr-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {[{ label: "Type", value: filterType, onChange: setFilterType, options: TYPES }, { label: "Status", value: filterStatus, onChange: setFilterStatus, options: STATUSES }].map(({ label, value, onChange, options }) => (
          <div key={label} className="relative">
            <select
              value={value}
              onChange={(e) => (onChange as (v: string) => void)(e.target.value)}
              className="appearance-none bg-backgroundSecondary border border-borderPrimary rounded-xl px-3 py-2 pr-8 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {options.map((o) => <option key={o} value={o}>{o === "All" ? `All ${label}s` : o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textSecondary pointer-events-none" />
          </div>
        ))}
        <span className="text-xs text-textSecondary w-full sm:w-auto sm:ml-auto">{filtered.length} case{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borderPrimary">
              {["Case ID", "Title", "Type", "Status", "Priority", "Officer", "Opened", "Exposure"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-textSecondary font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-textSecondary">No cases found</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-textSecondary">{c.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-textPrimary">{c.title}</span>
                    <ExternalLink className="h-3 w-3 text-textSecondary shrink-0" />
                  </div>
                </td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{c.type}</td>
                <td className="px-5 py-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", statusColor[c.status])}>{c.status}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn("text-xs font-semibold", priorityColor[c.priority])}>{c.priority}</span>
                </td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{c.officer}</td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{c.opened}</td>
                <td className="px-5 py-4 font-medium text-textPrimary whitespace-nowrap">{c.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
