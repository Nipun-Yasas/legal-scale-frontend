"use client";

import React from "react";
import { legalOfficers, reviewableDocuments, caseShiftRequests } from "./_data/data";
import { cn } from "@/lib/utils";
import { DocStatus, LegalOfficer, ReviewableDocument, CaseShiftRequest, ShiftStatus } from "./_data/types";
import {
  CheckCircle2,
  Eye,
  GitBranch,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

/* ── helpers ── */
const docStatusBadge: Record<DocStatus, string> = {
  "Pending Review": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Pending Approval": "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Reviewed: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const shiftStatusBadge: Record<ShiftStatus, string> = {
  Pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── KPI cards data ── */
const kpis = [
  {
    label: "Legal Officers",
    value: legalOfficers.filter((o) => o.status === "Active").length,
    sub: `${legalOfficers.length} total`,
    icon: <Users className="h-6 w-6 text-blue-400" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  {
    label: "Pending Review",
    value: reviewableDocuments.filter((d) => d.status === "Pending Review").length,
    sub: "documents awaiting review",
    icon: <Eye className="h-6 w-6 text-orange-400" />,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    label: "Approved",
    value: reviewableDocuments.filter((d) => d.status === "Approved").length,
    sub: "documents approved",
    icon: <CheckCircle2 className="h-6 w-6 text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  {
    label: "Pending Shifts",
    value: caseShiftRequests.filter((s) => s.status === "Pending").length,
    sub: "case type shift requests",
    icon: <GitBranch className="h-6 w-6 text-purple-400" />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
];

/* ── Pending docs for quick action ── */
const pendingDocs = reviewableDocuments.filter(
  (d): d is ReviewableDocument =>
    d.status === "Pending Review" || d.status === "Pending Approval"
);

/* ── Pending shifts for quick action ── */
const pendingShifts = caseShiftRequests.filter(
  (s): s is CaseShiftRequest => s.status === "Pending"
);

export default function LegalSupervisorDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Supervisor Dashboard</h1>
        <p className="text-textSecondary text-sm mt-1">
          Review documents, approve case type shifts, and manage legal officers.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={cn(
              "rounded-xl border p-5 flex flex-col gap-3",
              k.bg,
              k.border
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-textSecondary">{k.label}</span>
              {k.icon}
            </div>
            <div className={cn("text-4xl font-bold", k.color)}>{k.value}</div>
            <div className="text-xs text-textSecondary">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Urgent alert */}
      {pendingDocs.length > 0 && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0" />
          <p className="text-sm text-orange-400 font-medium">
            {pendingDocs.length} document{pendingDocs.length > 1 ? "s" : ""} awaiting your review or approval.{" "}
            <a href="/legal_supervisor_dashboard/documents" className="underline">
              Review now →
            </a>
          </p>
        </div>
      )}

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Documents */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">Pending Documents</h2>
            <a href="/legal_supervisor_dashboard/documents" className="text-xs text-primary hover:underline">
              View all →
            </a>
          </div>
          {pendingDocs.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-10">No pending documents.</p>
          ) : (
            <ul className="divide-y divide-borderPrimary">
              {pendingDocs.map((d) => (
                <li key={d.id} className="px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-textPrimary font-medium truncate">{d.docType}</p>
                      <p className="text-xs text-textSecondary mt-0.5 truncate">
                        <span className="font-mono text-primary">{d.caseId}</span> · {d.caseTitle}
                      </p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        By {d.submittedBy} · {fmt(d.submittedDate)}
                      </p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium shrink-0", docStatusBadge[d.status])}>
                      {d.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending Case Shifts */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">Pending Case Type Shifts</h2>
            <a href="/legal_supervisor_dashboard/case-shifts" className="text-xs text-primary hover:underline">
              View all →
            </a>
          </div>
          {pendingShifts.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-10">No pending shift requests.</p>
          ) : (
            <ul className="divide-y divide-borderPrimary">
              {pendingShifts.map((s) => (
                <li key={s.id} className="px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-textPrimary font-medium truncate">{s.caseTitle}</p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        <span className="font-mono text-primary">{s.caseId}</span> ·{" "}
                        <span className="line-through opacity-60">{s.currentType}</span>
                        {" → "}
                        <span className="font-medium text-textPrimary">{s.requestedType}</span>
                      </p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        By {s.requestedBy} · {fmt(s.requestDate)}
                      </p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium shrink-0", shiftStatusBadge[s.status])}>
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Officers summary */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
          <h2 className="text-base font-semibold text-textPrimary">Legal Officers — Workload Overview</h2>
          <a href="/legal_supervisor_dashboard/officers" className="text-xs text-primary hover:underline">
            Manage →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary">
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Officer</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Specialization</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Active Cases</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {legalOfficers.map((o, i) => (
                <tr
                  key={o.id}
                  className={cn(
                    "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                    i === legalOfficers.length - 1 && "border-none"
                  )}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {o.avatar}
                      </div>
                      <div>
                        <p className="text-textPrimary font-medium">{o.name}</p>
                        <p className="text-xs text-textSecondary">{o.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-textSecondary whitespace-nowrap">{o.specialization}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-2 rounded-full bg-borderPrimary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min((o.activeCases / 5) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-textPrimary font-semibold tabular-nums">{o.activeCases}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        o.status === "Active"
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : o.status === "On Leave"
                            ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                            : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviewed / Approved doc history */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-base font-semibold text-textPrimary">Recently Reviewed &amp; Approved</h2>
        </div>
        <ul className="divide-y divide-borderPrimary">
          {(reviewableDocuments as ReviewableDocument[])
            .filter((d) => d.status === "Approved" || d.status === "Reviewed")
            .map((d) => (
              <li key={d.id} className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                <div className="mt-0.5 h-2 w-2 rounded-full shrink-0" style={{ background: d.status === "Approved" ? "#4ade80" : "#c084fc" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold">{d.caseId}</span>
                    <span className="text-sm text-textPrimary font-medium">{d.docType}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", docStatusBadge[d.status])}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-textSecondary mt-0.5 truncate">{d.caseTitle} · {d.submittedBy}</p>
                  {d.reviewedDate && (
                    <p className="text-xs text-textSecondary mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {fmt(d.reviewedDate)}
                    </p>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
