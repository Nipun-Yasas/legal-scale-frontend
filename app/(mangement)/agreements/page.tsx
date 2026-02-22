"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AgreementStatus = "Pending Review" | "Approved" | "Rejected" | "Awaiting Signatories" | "Expired";

interface Agreement {
  id: string;
  title: string;
  counterparty: string;
  type: string;
  status: AgreementStatus;
  reviewer: string;
  submitted: string;
  value: string;
}

const agreements: Agreement[] = [
  { id: "AGR-001", title: "Network Sharing Agreement — SLT", counterparty: "SLT-Mobitel", type: "Network", status: "Approved", reviewer: "Carol S.", submitted: "2025-09-10", value: "LKR 12M" },
  { id: "AGR-002", title: "Tower Lease Renewal — Colombo Port", counterparty: "SLPA", type: "Lease", status: "Pending Review", reviewer: "Bob P.", submitted: "2026-01-15", value: "LKR 3.5M" },
  { id: "AGR-003", title: "Roaming Agreement — Airtel India", counterparty: "Airtel India", type: "Roaming", status: "Awaiting Signatories", reviewer: "Alice F.", submitted: "2026-01-28", value: "LKR 8.0M" },
  { id: "AGR-004", title: "IT Support Vendor Contract", counterparty: "TechPark Ltd", type: "Vendor", status: "Approved", reviewer: "Eve W.", submitted: "2025-11-05", value: "LKR 1.2M" },
  { id: "AGR-005", title: "Office Lease — Kandy Branch", counterparty: "Kandyan Properties", type: "Lease", status: "Rejected", reviewer: "Frank R.", submitted: "2025-12-20", value: "LKR 0.6M" },
  { id: "AGR-006", title: "5G Spectrum Sharing MOU", counterparty: "TRCSL", type: "Regulatory", status: "Pending Review", reviewer: "Alice F.", submitted: "2026-02-01", value: "LKR 22M" },
  { id: "AGR-007", title: "Content Partnership — Dialog TV", counterparty: "Dialog Axiata", type: "Partnership", status: "Awaiting Signatories", reviewer: "Carol S.", submitted: "2026-02-14", value: "LKR 5.5M" },
  { id: "AGR-008", title: "Legacy WAN Maintenance Contract", counterparty: "Ericsson SL", type: "Vendor", status: "Expired", reviewer: "David J.", submitted: "2024-08-01", value: "LKR 4.0M" },
];

const statusColor: Record<AgreementStatus, string> = {
  "Pending Review": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Awaiting Signatories": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Expired: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const STATUSES: (AgreementStatus | "All")[] = ["All", "Pending Review", "Approved", "Rejected", "Awaiting Signatories", "Expired"];

export default function AgreementsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AgreementStatus | "All">("All");

  const filtered = agreements.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) || a.counterparty.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Agreements</h1>
        <p className="text-sm text-textSecondary mt-1">All legal agreements and their approval status</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agreements..."
            className="w-full bg-backgroundSecondary border border-borderPrimary rounded-xl pl-9 pr-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AgreementStatus | "All")}
            className="appearance-none bg-backgroundSecondary border border-borderPrimary rounded-xl px-3 py-2 pr-8 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textSecondary pointer-events-none" />
        </div>
        <span className="text-xs text-textSecondary w-full sm:w-auto sm:ml-auto">{filtered.length} agreement{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borderPrimary">
              {["ID", "Title", "Counterparty", "Type", "Status", "Reviewer", "Submitted", "Value"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-textSecondary font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-textSecondary">No agreements found</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id} className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-textSecondary">{a.id}</td>
                <td className="px-5 py-4 font-medium text-textPrimary max-w-[220px] truncate">{a.title}</td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{a.counterparty}</td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{a.type}</td>
                <td className="px-5 py-4">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", statusColor[a.status])}>{a.status}</span>
                </td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{a.reviewer}</td>
                <td className="px-5 py-4 text-textSecondary whitespace-nowrap">{a.submitted}</td>
                <td className="px-5 py-4 font-medium text-textPrimary whitespace-nowrap">{a.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
