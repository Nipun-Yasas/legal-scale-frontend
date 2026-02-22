"use client";

import React from "react";
import { assignedCases, CaseProgress, CasePriority } from "./_data/cases";
import { cn } from "@/lib/utils";
import { Briefcase, Clock, CheckCircle2, PauseCircle, Flame } from "lucide-react";

/* ── helpers ── */
const progressCounts = (
  ["New", "Active", "On Hold", "Closed"] as CaseProgress[]
).map((p) => ({ progress: p, count: assignedCases.filter((c) => c.progress === p).length }));

const progressMeta: Record<
  CaseProgress,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  New: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: <Briefcase className="h-6 w-6 text-blue-400" />,
  },
  Active: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: <Flame className="h-6 w-6 text-green-400" />,
  },
  "On Hold": {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: <PauseCircle className="h-6 w-6 text-yellow-400" />,
  },
  Closed: {
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    icon: <CheckCircle2 className="h-6 w-6 text-slate-400" />,
  },
};

const priorityBadge: Record<CasePriority, string> = {
  Critical: "bg-red-500/15 text-red-400 border border-red-500/30",
  High: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Low: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

const progressBadge: Record<CaseProgress, string> = {
  New: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Active: "bg-green-500/15 text-green-400 border border-green-500/30",
  "On Hold": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Closed: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

/* Sort: Critical + New first, then by lastActivity desc */
const recentCases = [...assignedCases]
  .sort((a, b) => {
    const priorityOrder: Record<CasePriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    if (a.progress === "Closed" && b.progress !== "Closed") return 1;
    if (b.progress === "Closed" && a.progress !== "Closed") return -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  })
  .slice(0, 6);

export default function LegalOfficerDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">My Dashboard</h1>
        <p className="text-textSecondary text-sm mt-1">
          Overview of your assigned cases and recent activity.
        </p>
      </div>

      {/* Progress KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressCounts.map(({ progress, count }) => {
          const meta = progressMeta[progress];
          return (
            <div
              key={progress}
              className={cn(
                "rounded-xl border p-5 flex flex-col gap-3",
                meta.bg,
                meta.border
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-textSecondary">{progress}</span>
                {meta.icon}
              </div>
              <div className={cn("text-4xl font-bold", meta.color)}>{count}</div>
              <div className="text-xs text-textSecondary">
                {count === 1 ? "1 case" : `${count} cases`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Due-soon banner */}
      {(() => {
        const today = new Date("2026-02-21");
        const soon = assignedCases.filter(
          (c) =>
            c.progress !== "Closed" &&
            (new Date(c.dueDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24) <=
            14
        );
        if (soon.length === 0) return null;
        return (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 flex items-center gap-3">
            <Clock className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400 font-medium">
              {soon.length} case{soon.length > 1 ? "s are" : " is"} due within 14 days:&nbsp;
              <span className="font-bold">{soon.map((c) => c.id).join(", ")}</span>
            </p>
          </div>
        );
      })()}

      {/* Priority / Recent Cases Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
          <h2 className="text-base font-semibold text-textPrimary">Priority Cases</h2>
          <a
            href="/legal_officer_dashboard/cases"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary">
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Case ID</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Title</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Type</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Progress</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Priority</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Due Date</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Exposure</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c, i) => (
                <tr
                  key={c.id}
                  className={cn(
                    "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                    i === recentCases.length - 1 && "border-none"
                  )}
                >
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs text-primary font-semibold whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-textPrimary font-medium min-w-[150px] truncate">
                    {c.title}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-textSecondary whitespace-nowrap">{c.type}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        progressBadge[c.progress]
                      )}
                    >
                      {c.progress}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        priorityBadge[c.priority]
                      )}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs whitespace-nowrap">
                    {new Date(c.dueDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs font-mono whitespace-nowrap">
                    {c.exposure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Strip */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
          <h2 className="text-base font-semibold text-textPrimary">Recent Activity</h2>
          <a
            href="/legal_officer_dashboard/activity"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </a>
        </div>
        <ul className="divide-y divide-borderPrimary">
          {assignedCases
            .flatMap((c) =>
              c.activity.map((a) => ({ ...a, caseId: c.id, caseTitle: c.title }))
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6)
            .map((a, i) => (
              <li key={i} className="flex items-start gap-4 px-4 sm:px-6 py-4">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-textPrimary">
                    <span className="font-mono text-xs text-primary font-semibold mr-2">
                      {a.caseId}
                    </span>
                    {a.action}
                    {a.note && (
                      <span className="text-textSecondary ml-1">— {a.note}</span>
                    )}
                  </p>
                  <p className="text-xs text-textSecondary mt-0.5">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
