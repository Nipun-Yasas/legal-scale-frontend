"use client";

import React, { useState, useMemo } from "react";
import { legalOfficers } from "../_data/data";
import { LegalOfficer, OfficerStatus } from "../_data/types";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  UserPlus,
  ChevronDown,
  Briefcase,
  Mail,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

/* ── Badge helpers ── */
const statusBadge: Record<OfficerStatus, string> = {
  Active:   "bg-green-500/15 text-green-400 border border-green-500/30",
  "On Leave": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Inactive: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Mock unassigned cases for the assign dropdown ── */
const unassignedCases = [
  { id: "CAS-015", title: "Network Outage Liability Claim", type: "Litigation" },
  { id: "CAS-016", title: "Supplier Overpayment Recovery", type: "Contract Dispute" },
  { id: "CAS-017", title: "Customer Data Breach — Class Action", type: "Regulatory" },
  { id: "CAS-018", title: "Roaming Agreement Dispute", type: "Contract Dispute" },
];

/* ── Assign Modal ── */
function AssignModal({
  officer,
  onClose,
}: {
  officer: LegalOfficer;
  onClose: () => void;
}) {
  const [selectedCase, setSelectedCase] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  function handleAssign() {
    if (!selectedCase) return;
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-borderPrimary">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">Assign Case</h2>
            <p className="text-sm text-textSecondary mt-0.5">
              Assign a case to{" "}
              <span className="text-textPrimary font-medium">{officer.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-green-500/15 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-textPrimary font-semibold">Case Assigned Successfully</p>
            <p className="text-sm text-textSecondary">
              {unassignedCases.find((c) => c.id === selectedCase)?.title} has been assigned to{" "}
              {officer.name}.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Officer info */}
            <div className="flex items-center gap-3 rounded-lg border border-borderPrimary bg-hoverPrimary px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                {officer.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-textPrimary">{officer.name}</p>
                <p className="text-xs text-textSecondary">
                  {officer.specialization} · {officer.activeCases} active case{officer.activeCases !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Warning if busy */}
            {officer.activeCases >= 4 && (
              <div className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2">
                <AlertCircle className="h-4 w-4 text-orange-400 shrink-0" />
                <p className="text-xs text-orange-400">
                  This officer already has {officer.activeCases} active cases. Consider reassigning.
                </p>
              </div>
            )}

            {/* Case select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-textPrimary">Select Case</label>
              <div className="relative">
                <select
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">— Choose unassigned case —</option>
                  {unassignedCases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-textPrimary">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Add any instructions or context..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-borderPrimary text-sm text-textSecondary hover:bg-hoverPrimary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedCase}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Assign Case
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function OfficersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OfficerStatus>("All");
  const [assignTarget, setAssignTarget] = useState<LegalOfficer | null>(null);

  const filtered = useMemo(() => {
    return (legalOfficers as LegalOfficer[]).filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.specialization.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Legal Officers</h1>
        <p className="text-textSecondary text-sm mt-1">
          Manage and assign cases to your legal team — {legalOfficers.length} officers total.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {(["All", "Active", "On Leave", "Inactive"] as ("All" | OfficerStatus)[]).map((s) => {
          const count = s === "All" ? legalOfficers.length : legalOfficers.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s as "All" | OfficerStatus)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                statusFilter === s && s !== "All"
                  ? statusBadge[s as OfficerStatus]
                  : statusFilter === s
                  ? "border-primary text-primary bg-primary/10"
                  : "border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
              )}
            >
              {s} · {count}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, specialization..."
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

      {/* Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary">
                <th className="text-left px-6 py-3 font-medium">Officer</th>
                <th className="text-left px-6 py-3 font-medium">Specialization</th>
                <th className="text-left px-6 py-3 font-medium">Active Cases</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-left px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-textSecondary">
                    No officers match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => (
                  <tr
                    key={o.id}
                    className={cn(
                      "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                      i === filtered.length - 1 && "border-none"
                    )}
                  >
                    {/* Officer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {o.avatar}
                        </div>
                        <div>
                          <p className="text-textPrimary font-medium">{o.name}</p>
                          <p className="text-xs text-textSecondary flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {o.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Specialization */}
                    <td className="px-6 py-4">
                      <p className="text-textSecondary flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 shrink-0" />
                        {o.specialization}
                      </p>
                    </td>
                    {/* Active Cases */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 rounded-full bg-borderPrimary overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              o.activeCases >= 4 ? "bg-orange-400" : "bg-primary"
                            )}
                            style={{ width: `${Math.min((o.activeCases / 5) * 100, 100)}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "font-semibold tabular-nums text-sm",
                            o.activeCases >= 4 ? "text-orange-400" : "text-textPrimary"
                          )}
                        >
                          {o.activeCases}
                        </span>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusBadge[o.status])}>
                        {o.status}
                      </span>
                    </td>
                    {/* Joined */}
                    <td className="px-6 py-4 text-textSecondary text-xs">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {fmt(o.joinedDate)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setAssignTarget(o)}
                        disabled={o.status !== "Active"}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/30 hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Assign Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {legalOfficers.length} officers
      </p>

      {/* Assign modal */}
      {assignTarget && (
        <AssignModal officer={assignTarget} onClose={() => setAssignTarget(null)} />
      )}
    </div>
  );
}
