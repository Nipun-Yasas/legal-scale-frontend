"use client";

import React from "react";
import { approvableAgreements } from "../_data/agreements";
import { ApprovableAgreement, ApprovalStatus, RiskLevel } from "../_data/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  FileBadge2,
  DollarSign,
  Zap,
} from "lucide-react";

/* ── Badge helpers ── */
const statusBadge: Record<ApprovalStatus, string> = {
  "Awaiting Final Approval": "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  "Finally Approved": "bg-green-500/15 text-green-400 border border-green-500/30",
  "Returned for Revision": "bg-red-500/15 text-red-400 border border-red-500/30",
  Escalated: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
};

const riskBadge: Record<RiskLevel, string> = {
  Low: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  High: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Critical: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const data = approvableAgreements as ApprovableAgreement[];

/* ── KPI counts ── */
const kpis = [
  {
    label: "Awaiting Approval",
    value: data.filter((a) => a.status === "Awaiting Final Approval").length,
    icon: <Clock className="h-6 w-6 text-orange-400" />,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    label: "Finally Approved",
    value: data.filter((a) => a.status === "Finally Approved").length,
    icon: <CheckCircle2 className="h-6 w-6 text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  {
    label: "Returned",
    value: data.filter((a) => a.status === "Returned for Revision").length,
    icon: <RotateCcw className="h-6 w-6 text-red-400" />,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  {
    label: "Total Value Approved",
    value:
      "LKR " +
      (
        data
          .filter((a) => a.status === "Finally Approved")
          .reduce((s, a) => s + a.valueNumeric, 0) / 1_000_000
      ).toFixed(1) +
      "M",
    icon: <DollarSign className="h-6 w-6 text-blue-400" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    isString: true,
  },
];

/* ── Due-soon (within 7 days) ── */
const today = new Date("2026-02-21");
const dueSoon = data.filter(
  (a) =>
    a.status === "Awaiting Final Approval" &&
    (new Date(a.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7
);

/* ── Critical / High risk awaiting ── */
const criticalPending = data.filter(
  (a) =>
    a.status === "Awaiting Final Approval" &&
    (a.riskLevel === "Critical" || a.riskLevel === "High")
);

export default function AgreementApproverDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">CLO Dashboard</h1>
        <p className="text-textSecondary text-sm mt-1">
          Final approval authority — review cleared agreements and issue binding approvals.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={cn("rounded-xl border p-5 flex flex-col gap-3", k.bg, k.border)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-textSecondary">{k.label}</span>
              {k.icon}
            </div>
            <div className={cn("font-bold", k.color, (k as { isString?: boolean }).isString ? "text-2xl" : "text-4xl")}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Urgent alerts */}
      {dueSoon.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400 font-medium">
            {dueSoon.length} agreement{dueSoon.length > 1 ? "s" : ""} awaiting final approval{" "}
            <span className="font-bold">within 7 days</span>:{" "}
            {dueSoon.map((a) => a.id).join(", ")}.{" "}
            <a href="/agreement_approver_dashboard/agreements" className="underline">
              Review now →
            </a>
          </p>
        </div>
      )}

      {criticalPending.length > 0 && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 flex items-center gap-3">
          <Zap className="h-5 w-5 text-orange-400 shrink-0" />
          <p className="text-sm text-orange-400 font-medium">
            {criticalPending.length} high-risk / critical agreement{criticalPending.length > 1 ? "s" : ""} awaiting your approval:{" "}
            {criticalPending.map((a) => a.id).join(", ")}.
          </p>
        </div>
      )}

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Awaiting final approval */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">Awaiting Final Approval</h2>
            <a
              href="/agreement_approver_dashboard/agreements"
              className="text-xs text-primary hover:underline"
            >
              View all →
            </a>
          </div>
          {data.filter((a) => a.status === "Awaiting Final Approval").length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-10">
              No agreements pending.
            </p>
          ) : (
            <ul className="divide-y divide-borderPrimary">
              {data
                .filter((a) => a.status === "Awaiting Final Approval")
                .map((a) => (
                  <li key={a.id} className="px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-primary font-bold">{a.id}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", riskBadge[a.riskLevel])}>
                            {a.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-sm text-textPrimary font-medium truncate">{a.title}</p>
                        <p className="text-xs text-textSecondary mt-0.5">
                          {a.counterparty} · Due {fmt(a.dueDate)}
                        </p>
                        <p className="text-xs text-textSecondary mt-0.5 font-mono">{a.value}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Value by risk level bar chart */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary">
            <h2 className="text-base font-semibold text-textPrimary">Pending Value by Risk Level</h2>
          </div>
          <div className="p-6 space-y-4">
            {(["Critical", "High", "Medium", "Low"] as RiskLevel[]).map((r) => {
              const items = data.filter(
                (a) => a.status === "Awaiting Final Approval" && a.riskLevel === r
              );
              const total = items.reduce((s, a) => s + a.valueNumeric, 0);
              const allTotal = data
                .filter((a) => a.status === "Awaiting Final Approval")
                .reduce((s, a) => s + a.valueNumeric, 0);
              const pct = allTotal > 0 ? (total / allTotal) * 100 : 0;
              const barColor =
                r === "Critical"
                  ? "bg-red-500"
                  : r === "High"
                    ? "bg-orange-500"
                    : r === "Medium"
                      ? "bg-yellow-500"
                      : "bg-slate-500";
              return (
                <div key={r} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-textSecondary">{r} Risk</span>
                    <span className="text-textPrimary font-medium">
                      {items.length} agr · {total > 0 ? "LKR " + (total / 1_000_000).toFixed(1) + "M" : "N/A"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-borderPrimary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", barColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-textSecondary pt-1">
              Total pending value:{" "}
              <span className="text-textPrimary font-semibold">
                LKR{" "}
                {(
                  data
                    .filter((a) => a.status === "Awaiting Final Approval")
                    .reduce((s, a) => s + a.valueNumeric, 0) / 1_000_000
                ).toFixed(1)}
                M
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Approved history */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <h2 className="text-base font-semibold text-textPrimary">Finally Approved</h2>
        </div>
        <ul className="divide-y divide-borderPrimary">
          {data
            .filter((a) => a.status === "Finally Approved")
            .map((a) => (
              <li key={a.id} className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-mono text-xs text-primary font-bold">{a.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", statusBadge[a.status])}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-textPrimary font-medium">{a.title}</p>
                  <p className="text-xs text-textSecondary mt-0.5">
                    {a.counterparty} ·{" "}
                    {a.value !== "N/A" ? a.value + " · " : ""}
                    Approved {a.approvedDate ? fmt(a.approvedDate) : "—"}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* Returned */}
      {data.some((a) => a.status === "Returned for Revision") && (
        <div className="rounded-xl border border-red-500/20 bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-red-500/20 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-red-400" />
            <h2 className="text-base font-semibold text-textPrimary">Returned for Revision</h2>
          </div>
          <ul className="divide-y divide-borderPrimary">
            {data
              .filter((a) => a.status === "Returned for Revision")
              .map((a) => (
                <li key={a.id} className="px-4 sm:px-6 py-4">
                  Line 298:
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold">{a.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", statusBadge[a.status])}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-textPrimary font-medium">{a.title}</p>
                  <p className="text-xs text-textSecondary mt-1 italic">
                    &ldquo;{a.history.at(-1)?.note}&rdquo;
                  </p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
