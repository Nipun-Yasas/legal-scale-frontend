"use client";

import React, { useState, useMemo } from "react";
import { assignedCases } from "../_data/cases";
import { cn } from "@/lib/utils";
import { Search, X, ChevronDown, CalendarDays } from "lucide-react";

/* ── Flatten all activity entries across all cases ── */
interface FlatActivity {
  date: string;
  caseId: string;
  caseTitle: string;
  action: string;
  note?: string;
}

const allActivity: FlatActivity[] = assignedCases
  .flatMap((c) =>
    c.activity.map((a) => ({
      date: a.date,
      caseId: c.id,
      caseTitle: c.title,
      action: a.action,
      note: a.note,
    }))
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/* Group by date */
function groupByDate(entries: FlatActivity[]) {
  const map = new Map<string, FlatActivity[]>();
  entries.forEach((e) => {
    const key = e.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  });
  return map;
}

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* ── Case ID color (cycle) ── */
const caseColors = [
  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "bg-green-500/15 text-green-400 border-green-500/30",
  "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "bg-rose-500/15 text-rose-400 border-rose-500/30",
  "bg-teal-500/15 text-teal-400 border-teal-500/30",
  "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
];

const caseColorMap = Object.fromEntries(
  assignedCases.map((c, i) => [c.id, caseColors[i % caseColors.length]])
);

const CASE_OPTIONS = [
  { value: "All", label: "All Cases" },
  ...assignedCases.map((c) => ({ value: c.id, label: `${c.id} — ${c.title}` })),
];

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [caseFilter, setCaseFilter] = useState("All");

  const filtered = useMemo(() => {
    return allActivity.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.action.toLowerCase().includes(q) ||
        a.caseId.toLowerCase().includes(q) ||
        a.caseTitle.toLowerCase().includes(q) ||
        (a.note?.toLowerCase().includes(q) ?? false);
      const matchCase = caseFilter === "All" || a.caseId === caseFilter;
      return matchSearch && matchCase;
    });
  }, [search, caseFilter]);

  const grouped = groupByDate(filtered);
  const dateKeys = Array.from(grouped.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Activity Log</h1>
        <p className="text-textSecondary text-sm mt-1">
          Chronological record of all case activity — {allActivity.length} entries across{" "}
          {assignedCases.length} cases.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {assignedCases.map((c) => {
          const count = allActivity.filter((a) => a.caseId === c.id).length;
          const color = caseColorMap[c.id];
          return (
            <button
              key={c.id}
              onClick={() => setCaseFilter(caseFilter === c.id ? "All" : c.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                caseFilter === c.id
                  ? color
                  : "border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
              )}
            >
              {c.id} · {count}
            </button>
          );
        })}
        {caseFilter !== "All" && (
          <button
            onClick={() => setCaseFilter("All")}
            className="px-3 py-1.5 rounded-full text-xs border border-borderPrimary text-textSecondary hover:bg-hoverPrimary flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actions or notes..."
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

        {/* Case dropdown */}
        <div className="relative">
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 max-w-[260px]"
          >
            {CASE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {allActivity.length} entries
      </p>

      {/* Timeline */}
      {dateKeys.length === 0 ? (
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary py-16 text-center text-textSecondary">
          No activity matches your filters.
        </div>
      ) : (
        <div className="space-y-8">
          {dateKeys.map((date) => {
            const entries = grouped.get(date)!;
            return (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="h-4 w-4 text-textSecondary shrink-0" />
                  <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                    {fmtDate(date)}
                  </span>
                  <div className="flex-1 h-px bg-borderPrimary" />
                  <span className="text-xs text-textSecondary">{entries.length}</span>
                </div>

                {/* Entry cards */}
                <div className="relative ml-2 border-l border-borderPrimary space-y-0">
                  {entries.map((a, i) => (
                    <div key={i} className="relative ml-5 pb-5 last:pb-0">
                      {/* dot */}
                      <span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-backgroundSecondary bg-primary" />

                      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary p-4 hover:bg-hoverPrimary transition-colors">
                        <div className="flex items-start gap-3">
                          {/* Case badge */}
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-md text-xs font-mono font-bold border shrink-0 mt-0.5",
                              caseColorMap[a.caseId]
                            )}
                          >
                            {a.caseId}
                          </span>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-textPrimary font-medium">{a.action}</p>
                            {a.note && (
                              <p className="text-xs text-textSecondary mt-1">{a.note}</p>
                            )}
                            <p className="text-xs text-textSecondary mt-1 truncate">
                              {a.caseTitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
