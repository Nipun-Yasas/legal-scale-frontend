"use client";

import React, { useState, useMemo } from "react";
import { assignedCases, CaseProgress, CasePriority, AssignedCase } from "../_data/cases";
import { cn } from "@/lib/utils";
import { Search, X, ChevronDown, Clock, CalendarDays, DollarSign, User, Building2 } from "lucide-react";

/* ── badge maps ── */
const progressBadge: Record<CaseProgress, string> = {
  New: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Active: "bg-green-500/15 text-green-400 border border-green-500/30",
  "On Hold": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Closed: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

const priorityBadge: Record<CasePriority, string> = {
  Critical: "bg-red-500/15 text-red-400 border border-red-500/30",
  High: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Low: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

const PROGRESS_OPTIONS: ("All" | CaseProgress)[] = ["All", "New", "Active", "On Hold", "Closed"];
const PRIORITY_OPTIONS: ("All" | CasePriority)[] = ["All", "Critical", "High", "Medium", "Low"];

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Detail Modal ── */
function CaseDetailModal({
  c,
  onClose,
}: {
  c: AssignedCase;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-start justify-between p-6 border-b border-borderPrimary">
          <div>
            <p className="font-mono text-xs text-primary font-bold mb-1">{c.id}</p>
            <h2 className="text-lg font-bold text-textPrimary">{c.title}</h2>
            <p className="text-sm text-textSecondary mt-1">{c.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary transition-colors ml-4 mt-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="p-6 space-y-5">
          {/* badges */}
          <div className="flex flex-wrap gap-2">
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", progressBadge[c.progress])}>
              {c.progress}
            </span>
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", priorityBadge[c.priority])}>
              {c.priority} Priority
            </span>
          </div>

          {/* description */}
          <p className="text-sm text-textSecondary leading-relaxed">{c.description}</p>

          {/* meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <User className="h-4 w-4" />, label: "Client", value: c.client },
              { icon: <Building2 className="h-4 w-4" />, label: "Department", value: c.department },
              { icon: <CalendarDays className="h-4 w-4" />, label: "Opened", value: fmt(c.openedDate) },
              { icon: <Clock className="h-4 w-4" />, label: "Due Date", value: fmt(c.dueDate) },
              { icon: <DollarSign className="h-4 w-4" />, label: "Exposure", value: c.exposure },
              {
                icon: <Clock className="h-4 w-4" />,
                label: "Last Activity",
                value: fmt(c.lastActivity),
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-textSecondary mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs text-textSecondary">{label}</p>
                  <p className="text-sm text-textPrimary font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* activity timeline */}
          <div>
            <h3 className="text-sm font-semibold text-textPrimary mb-3">Activity Timeline</h3>
            <ol className="relative border-l border-borderPrimary ml-2 space-y-4">
              {[...c.activity].reverse().map((a, i) => (
                <li key={i} className="ml-4">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-backgroundSecondary bg-primary" />
                  <p className="text-xs text-textSecondary mb-0.5">{fmt(a.date)}</p>
                  <p className="text-sm text-textPrimary font-medium">{a.action}</p>
                  {a.note && <p className="text-xs text-textSecondary mt-0.5">{a.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function MyCasesPage() {
  const [search, setSearch] = useState("");
  const [progressFilter, setProgressFilter] = useState<"All" | CaseProgress>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | CasePriority>("All");
  const [selected, setSelected] = useState<AssignedCase | null>(null);

  const filtered = useMemo(() => {
    return assignedCases.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q);
      const matchProgress = progressFilter === "All" || c.progress === progressFilter;
      const matchPriority = priorityFilter === "All" || c.priority === priorityFilter;
      return matchSearch && matchProgress && matchPriority;
    });
  }, [search, progressFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">My Cases</h1>
        <p className="text-textSecondary text-sm mt-1">
          All cases assigned to you — {assignedCases.length} total.
        </p>
      </div>

      {/* Progress summary pills */}
      <div className="flex flex-wrap gap-3">
        {(["New", "Active", "On Hold", "Closed"] as CaseProgress[]).map((p) => {
          const count = assignedCases.filter((c) => c.progress === p).length;
          return (
            <button
              key={p}
              onClick={() => setProgressFilter(progressFilter === p ? "All" : p)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                progressFilter === p ? progressBadge[p] : "border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
              )}
            >
              {p} · {count}
            </button>
          );
        })}
        {progressFilter !== "All" && (
          <button
            onClick={() => setProgressFilter("All")}
            className="px-3 py-1.5 rounded-full text-xs border border-borderPrimary text-textSecondary hover:bg-hoverPrimary flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, client, type..."
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Priority filter */}
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as "All" | CasePriority)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === "All" ? "All Priorities" : o}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary">
                <th className="text-left px-6 py-3 font-medium">Case ID</th>
                <th className="text-left px-6 py-3 font-medium">Title</th>
                <th className="text-left px-6 py-3 font-medium">Type</th>
                <th className="text-left px-6 py-3 font-medium">Progress</th>
                <th className="text-left px-6 py-3 font-medium">Priority</th>
                <th className="text-left px-6 py-3 font-medium">Client</th>
                <th className="text-left px-6 py-3 font-medium">Department</th>
                <th className="text-left px-6 py-3 font-medium">Due Date</th>
                <th className="text-left px-6 py-3 font-medium">Exposure</th>
                <th className="text-left px-6 py-3 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-textSecondary">
                    No cases match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={cn(
                      "border-b border-borderPrimary hover:bg-hoverPrimary cursor-pointer transition-colors",
                      i === filtered.length - 1 && "border-none"
                    )}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-primary font-bold whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="px-6 py-4 text-textPrimary font-medium max-w-[180px] truncate">
                      {c.title}
                    </td>
                    <td className="px-6 py-4 text-textSecondary whitespace-nowrap">{c.type}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", progressBadge[c.progress])}>
                        {c.progress}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", priorityBadge[c.priority])}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textSecondary whitespace-nowrap">{c.client}</td>
                    <td className="px-6 py-4 text-textSecondary whitespace-nowrap">{c.department}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs whitespace-nowrap">{fmt(c.dueDate)}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs font-mono whitespace-nowrap">{c.exposure}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs whitespace-nowrap">{fmt(c.lastActivity)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {assignedCases.length} cases
      </p>

      {/* Detail modal */}
      {selected && <CaseDetailModal c={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
