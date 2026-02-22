"use client";

import React, { useState } from "react";
import {
  HandshakeIcon,
  Search,
  ChevronDown,
  X,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AgreementStatus =
  | "Pending Review"
  | "Approved"
  | "Rejected"
  | "Awaiting Signatories";

interface ApprovalStep {
  role: string;
  name: string;
  status: "Approved" | "Rejected" | "Pending" | "Waiting";
  date?: string;
  comment?: string;
}

interface Agreement {
  id: string;
  title: string;
  type: string;
  status: AgreementStatus;
  submitted: string;
  lastUpdated: string;
  description: string;
  steps: ApprovalStep[];
}

const agreements: Agreement[] = [
  {
    id: "AGR-011",
    title: "Freelance NDA — External Consultant",
    type: "NDA",
    status: "Awaiting Signatories",
    submitted: "2026-01-25",
    lastUpdated: "2026-02-10",
    description: "Non-disclosure agreement for an external IT consultant engaged on the 5G project.",
    steps: [
      { role: "Legal Officer", name: "Alice Fernando", status: "Approved", date: "2026-01-28", comment: "Reviewed and approved NDA clauses." },
      { role: "Legal Supervisor", name: "Bob Perera", status: "Approved", date: "2026-02-01", comment: "Confirmed compliance with company policy." },
      { role: "Agreement Reviewer", name: "Carol Silva", status: "Approved", date: "2026-02-05", comment: "No issues found." },
      { role: "Agreement Approver", name: "Eve Wickramasinghe", status: "Approved", date: "2026-02-10" },
      { role: "Signatories", name: "Both Parties", status: "Pending" },
    ],
  },
  {
    id: "AGR-014",
    title: "Software Usage License",
    type: "License",
    status: "Approved",
    submitted: "2026-02-03",
    lastUpdated: "2026-02-18",
    description: "End-user software license agreement for internal analytics tool deployment.",
    steps: [
      { role: "Legal Officer", name: "Alice Fernando", status: "Approved", date: "2026-02-05" },
      { role: "Legal Supervisor", name: "Bob Perera", status: "Approved", date: "2026-02-08" },
      { role: "Agreement Reviewer", name: "Carol Silva", status: "Approved", date: "2026-02-12" },
      { role: "Agreement Approver", name: "Eve Wickramasinghe", status: "Approved", date: "2026-02-18", comment: "All clear. Fully approved." },
      { role: "Signatories", name: "Both Parties", status: "Approved", date: "2026-02-18" },
    ],
  },
  {
    id: "AGR-017",
    title: "Vendor Service Contract — Cloud Storage",
    type: "Vendor",
    status: "Pending Review",
    submitted: "2026-02-15",
    lastUpdated: "2026-02-16",
    description: "Cloud storage service agreement with external vendor for 3-year term.",
    steps: [
      { role: "Legal Officer", name: "Alice Fernando", status: "Pending" },
      { role: "Legal Supervisor", name: "Bob Perera", status: "Waiting" },
      { role: "Agreement Reviewer", name: "Carol Silva", status: "Waiting" },
      { role: "Agreement Approver", name: "Eve Wickramasinghe", status: "Waiting" },
      { role: "Signatories", name: "Both Parties", status: "Waiting" },
    ],
  },
  {
    id: "AGR-009",
    title: "Office Lease Renewal — Kandy",
    type: "Lease",
    status: "Rejected",
    submitted: "2025-12-10",
    lastUpdated: "2026-01-05",
    description: "Renewal of office lease for the Kandy regional branch.",
    steps: [
      { role: "Legal Officer", name: "Alice Fernando", status: "Approved", date: "2025-12-14" },
      { role: "Legal Supervisor", name: "Bob Perera", status: "Rejected", date: "2026-01-05", comment: "Lease terms are not favorable. Requires renegotiation." },
      { role: "Agreement Reviewer", name: "Carol Silva", status: "Waiting" },
      { role: "Agreement Approver", name: "Eve Wickramasinghe", status: "Waiting" },
      { role: "Signatories", name: "Both Parties", status: "Waiting" },
    ],
  },
];

const statusConfig: Record<AgreementStatus, { color: string; icon: React.ReactNode; bg: string }> = {
  "Pending Review": { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: <Clock className="h-3.5 w-3.5" /> },
  Approved: { color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Rejected: { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: <XCircle className="h-3.5 w-3.5" /> },
  "Awaiting Signatories": { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: <Users className="h-3.5 w-3.5" /> },
};

const stepStatusIcon = (s: ApprovalStep["status"]) => {
  switch (s) {
    case "Approved": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Rejected": return <XCircle className="h-4 w-4 text-red-500" />;
    case "Pending": return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Waiting": return <div className="h-4 w-4 rounded-full border-2 border-borderPrimary" />;
  }
};

const STATUSES: (AgreementStatus | "All")[] = ["All", "Pending Review", "Approved", "Rejected", "Awaiting Signatories"];

/* ── Agreement Detail Modal ── */
function DetailModal({ agreement, onClose }: { agreement: Agreement; onClose: () => void }) {
  const cfg = statusConfig[agreement.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-borderPrimary">
          <div className="flex-1 pr-4">
            <p className="font-mono text-xs text-textSecondary mb-1">{agreement.id}</p>
            <h2 className="text-base font-bold text-textPrimary">{agreement.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", cfg.bg, cfg.color)}>
                {cfg.icon} {agreement.status}
              </span>
              <span className="text-xs text-textSecondary">{agreement.type}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-hoverPrimary transition-colors">
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 py-4 border-b border-borderPrimary">
          <p className="text-xs text-textSecondary mb-1">Description</p>
          <p className="text-sm text-textPrimary">{agreement.description}</p>
          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-xs text-textSecondary">Submitted</p>
              <p className="text-sm font-medium text-textPrimary">{agreement.submitted}</p>
            </div>
            <div>
              <p className="text-xs text-textSecondary">Last Updated</p>
              <p className="text-sm font-medium text-textPrimary">{agreement.lastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Approval timeline */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-4">
            Approval Pipeline
          </p>
          <div className="flex flex-col gap-0">
            {agreement.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div className="mt-0.5 shrink-0">{stepStatusIcon(step.status)}</div>
                  {idx < agreement.steps.length - 1 && (
                    <div className={cn("w-0.5 flex-1 my-1 min-h-[24px]",
                      step.status === "Approved" ? "bg-green-300 dark:bg-green-700"
                        : step.status === "Rejected" ? "bg-red-300 dark:bg-red-700"
                          : "bg-borderPrimary"
                    )} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-textPrimary">{step.role}</p>
                      <p className="text-xs text-textSecondary">{step.name}</p>
                    </div>
                    {step.date && (
                      <span className="text-xs text-textSecondary">{step.date}</span>
                    )}
                  </div>
                  {step.comment && (
                    <div className="mt-1.5 bg-hoverPrimary rounded-lg px-3 py-2">
                      <p className="text-xs text-textSecondary italic">"{step.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function UserAgreementsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AgreementStatus | "All">("All");
  const [selected, setSelected] = useState<Agreement | null>(null);

  const filtered = agreements.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary mb-1">User Portal</p>
        <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <HandshakeIcon className="h-6 w-6 text-purple-500" /> My Agreements
        </h1>
        <p className="text-sm text-textSecondary mt-1">
          Track the approval status of your submitted agreements
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {STATUSES.filter(s => s !== "All").map((s) => {
          const count = agreements.filter(a => a.status === s).length;
          const cfg = statusConfig[s as AgreementStatus];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "All" : s as AgreementStatus)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                filterStatus === s ? cn(cfg.bg, cfg.color, "border-current") : "border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
              )}
            >
              {cfg.icon} {s} <span className="font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agreements..."
            className="w-full bg-backgroundSecondary border border-borderPrimary rounded-xl pl-9 pr-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as AgreementStatus | "All")}
            className="appearance-none bg-backgroundSecondary border border-borderPrimary rounded-xl px-3 py-2 pr-8 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textSecondary pointer-events-none" />
        </div>
      </div>

      {/* Agreement cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-textSecondary text-sm">No agreements found</div>
        ) : filtered.map((a) => {
          const cfg = statusConfig[a.status];
          const approvedCount = a.steps.filter(s => s.status === "Approved").length;
          const totalSteps = a.steps.length;
          const pct = Math.round((approvedCount / totalSteps) * 100);

          return (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="w-full text-left rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-hoverPrimary mt-0.5 shrink-0">
                    <FileText className="h-4 w-4 text-textSecondary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-textSecondary">{a.id}</p>
                    <p className="font-semibold text-textPrimary text-sm mt-0.5">{a.title}</p>
                    <p className="text-xs text-textSecondary mt-0.5">{a.type} · Submitted {a.submitted}</p>
                  </div>
                </div>
                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0", cfg.bg, cfg.color)}>
                  {cfg.icon} {a.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-borderPrimary rounded-full h-1.5 overflow-hidden">
                  <div
                    className={cn("h-1.5 rounded-full transition-all",
                      a.status === "Rejected" ? "bg-red-500" : "bg-green-500"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-textSecondary shrink-0">
                  {approvedCount}/{totalSteps} steps
                </span>
                <span className="text-xs text-blue-500 group-hover:underline shrink-0">View details →</span>
              </div>

              {/* Mini step dots */}
              <div className="flex gap-1.5 mt-3">
                {a.steps.map((step, i) => (
                  <div
                    key={i}
                    title={`${step.role}: ${step.status}`}
                    className={cn("h-1.5 flex-1 rounded-full",
                      step.status === "Approved" ? "bg-green-500"
                        : step.status === "Rejected" ? "bg-red-500"
                          : step.status === "Pending" ? "bg-yellow-500"
                            : "bg-borderPrimary"
                    )}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected && <DetailModal agreement={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
