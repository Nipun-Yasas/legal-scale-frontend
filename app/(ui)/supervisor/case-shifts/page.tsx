"use client";

import React, { useState, useMemo } from "react";
import { caseShiftRequests } from "../_data/data";
import { ShiftStatus, CaseShiftRequest } from "../_data/types";
import { cn } from "@/lib/utils";
import { Search, X, CheckCircle2, ChevronDown, GitBranch, ArrowRight, CalendarDays, User } from "lucide-react";

/* ── Badge map ── */
const shiftStatusBadge: Record<ShiftStatus, string> = {
  Pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Action Modal ── */
function ShiftActionModal({
  req,
  action,
  onClose,
}: {
  req: CaseShiftRequest;
  action: "approve" | "reject";
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

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
            <h2 className="text-lg font-bold text-textPrimary">
              {action === "approve" ? "Approve Type Shift" : "Reject Type Shift"}
            </h2>
            <p className="text-sm text-textSecondary mt-0.5">
              <span className="font-mono text-primary">{req.id}</span> · {req.caseTitle}
            </p>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center text-white",
                action === "approve" ? "bg-green-500" : "bg-red-500"
              )}
            >
              {action === "approve" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </div>
            <p className="text-textPrimary font-semibold">
              Shift Request {action === "approve" ? "Approved" : "Rejected"}
            </p>
            <p className="text-sm text-textSecondary">
              Case <span className="font-mono text-primary">{req.caseId}</span>{" "}
              {action === "approve"
                ? `has been reclassified from ${req.currentType} to ${req.requestedType}.`
                : "type shift request has been rejected."}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Shift summary */}
            <div className="rounded-lg border border-borderPrimary bg-hoverPrimary px-4 py-3 space-y-2">
              <p className="text-sm font-medium text-textPrimary">{req.caseTitle}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded bg-borderPrimary text-textSecondary text-xs">
                  {req.currentType}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-textSecondary" />
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-medium">
                  {req.requestedType}
                </span>
              </div>
              <p className="text-xs text-textSecondary italic">{req.reason}</p>
              <p className="text-xs text-textSecondary">
                Requested by {req.requestedBy} · {fmt(req.requestDate)}
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-textPrimary">
                Comment {action === "reject" ? "(required)" : "(optional)"}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder={
                  action === "approve"
                    ? "Any notes for the officer..."
                    : "Reason for rejection..."
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-borderPrimary text-sm text-textSecondary hover:bg-hoverPrimary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setDone(true)}
                disabled={action === "reject" && !comment.trim()}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed",
                  action === "approve" ? "bg-green-500" : "bg-red-500"
                )}
              >
                {action === "approve" ? "Approve Shift" : "Reject Shift"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function CaseShiftsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ShiftStatus>("All");
  const [modal, setModal] = useState<{ req: CaseShiftRequest; action: "approve" | "reject" } | null>(null);

  const counts: Record<ShiftStatus, number> = {
    Pending: caseShiftRequests.filter((s) => s.status === "Pending").length,
    Approved: caseShiftRequests.filter((s) => s.status === "Approved").length,
    Rejected: caseShiftRequests.filter((s) => s.status === "Rejected").length,
  };

  const filtered = useMemo(() => {
    return (caseShiftRequests as CaseShiftRequest[]).filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.id.toLowerCase().includes(q) ||
        s.caseId.toLowerCase().includes(q) ||
        s.caseTitle.toLowerCase().includes(q) ||
        s.currentType.toLowerCase().includes(q) ||
        s.requestedType.toLowerCase().includes(q) ||
        s.requestedBy.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Case Type Shifts</h1>
        <p className="text-textSecondary text-sm mt-1">
          Review and approve requests to reclassify case types submitted by legal officers.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["Pending", "Approved", "Rejected"] as ShiftStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
            className={cn(
              "rounded-xl border p-5 text-left transition-all hover:scale-[1.02]",
              statusFilter === s
                ? shiftStatusBadge[s]
                : "border-borderPrimary bg-backgroundSecondary hover:bg-hoverPrimary"
            )}
          >
            <div className={cn("text-3xl font-bold", statusFilter === s ? "" : "text-textPrimary")}>
              {counts[s]}
            </div>
            <div className={cn("text-xs mt-1", statusFilter === s ? "opacity-80" : "text-textSecondary")}>
              {s} request{counts[s] !== 1 ? "s" : ""}
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case, type, officer..."
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

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | ShiftStatus)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {(["All", "Pending", "Approved", "Rejected"] as const).map((o) => (
              <option key={o} value={o}>
                {o === "All" ? "All Statuses" : o}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
        </div>

        {statusFilter !== "All" && (
          <button
            onClick={() => setStatusFilter("All")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Shift request cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary py-16 text-center text-textSecondary">
          No shift requests match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-borderPrimary bg-backgroundSecondary p-5 hover:bg-hoverPrimary transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Top row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold">{s.id}</span>
                    <span className="font-mono text-xs text-textSecondary">{s.caseId}</span>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", shiftStatusBadge[s.status])}>
                      {s.status}
                    </span>
                  </div>

                  {/* Case title */}
                  <p className="text-base font-semibold text-textPrimary">{s.caseTitle}</p>

                  {/* Type shift arrow */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2.5 py-1 rounded-md bg-borderPrimary text-textSecondary text-xs">
                      {s.currentType}
                    </span>
                    <ArrowRight className="h-4 w-4 text-textSecondary" />
                    <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary text-xs font-medium border border-primary/30">
                      {s.requestedType}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-textSecondary">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {s.requestedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {fmt(s.requestDate)}
                    </span>
                    {s.reviewedDate && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Reviewed {fmt(s.reviewedDate)}
                      </span>
                    )}
                  </div>

                  {/* Reason */}
                  <p className="text-sm text-textSecondary leading-relaxed italic">
                    <GitBranch className="inline h-3.5 w-3.5 mr-1" />
                    {s.reason}
                  </p>
                </div>

                {/* Action buttons (only for Pending) */}
                {s.status === "Pending" && (
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setModal({ req: s, action: "approve" })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-medium hover:bg-green-500/20 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => setModal({ req: s, action: "reject" })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-medium hover:bg-red-500/20 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {caseShiftRequests.length} requests
      </p>

      {/* Modal */}
      {modal && (
        <ShiftActionModal
          req={modal.req}
          action={modal.action}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
