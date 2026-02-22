"use client";

import React, { useState, useMemo } from "react";
import { reviewableDocuments } from "../_data/data";
import { DocStatus, ReviewableDocument } from "../_data/types";
import { cn } from "@/lib/utils";
import { Search, X, CheckCircle2, Eye, ChevronDown, CalendarDays, User, FileText } from "lucide-react";

/* ── Badge map ── */
const docStatusBadge: Record<DocStatus, string> = {
  "Pending Review":   "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Pending Approval": "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Reviewed:           "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  Approved:           "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected:           "bg-red-500/15 text-red-400 border border-red-500/30",
};

const STATUS_OPTIONS: ("All" | DocStatus)[] = [
  "All",
  "Pending Review",
  "Pending Approval",
  "Reviewed",
  "Approved",
  "Rejected",
];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Action Modal ── */
function ActionModal({
  doc,
  action,
  onClose,
}: {
  doc: ReviewableDocument;
  action: "review" | "approve" | "reject";
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const meta = {
    review:  { label: "Mark as Reviewed", color: "bg-purple-500", icon: <Eye className="h-5 w-5" /> },
    approve: { label: "Approve Document", color: "bg-green-500", icon: <CheckCircle2 className="h-5 w-5" /> },
    reject:  { label: "Reject Document",  color: "bg-red-500",   icon: <X className="h-5 w-5" /> },
  }[action];

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
            <h2 className="text-lg font-bold text-textPrimary">{meta.label}</h2>
            <p className="text-sm text-textSecondary mt-0.5">
              <span className="font-mono text-primary">{doc.id}</span> · {doc.docType}
            </p>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white", meta.color)}>
              {meta.icon}
            </div>
            <p className="text-textPrimary font-semibold">Action Completed</p>
            <p className="text-sm text-textSecondary">
              Document <span className="font-medium text-textPrimary">{doc.id}</span> has been{" "}
              {action === "review" ? "marked as reviewed" : action === "approve" ? "approved" : "rejected"}.
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
            {/* Doc summary */}
            <div className="rounded-lg border border-borderPrimary bg-hoverPrimary px-4 py-3 space-y-1">
              <p className="text-sm font-medium text-textPrimary">{doc.caseTitle}</p>
              <p className="text-xs text-textSecondary">
                {doc.docType} · Submitted by {doc.submittedBy} on {fmt(doc.submittedDate)}
              </p>
              <p className="text-xs text-textSecondary italic">{doc.notes}</p>
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
                    ? "Add approval notes..."
                    : action === "review"
                    ? "Add review comments or revision requests..."
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
                  meta.color
                )}
              >
                {meta.label}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | DocStatus>("All");
  const [modal, setModal] = useState<{ doc: ReviewableDocument; action: "review" | "approve" | "reject" } | null>(null);

  const filtered = useMemo(() => {
    return (reviewableDocuments as ReviewableDocument[]).filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.id.toLowerCase().includes(q) ||
        d.caseId.toLowerCase().includes(q) ||
        d.caseTitle.toLowerCase().includes(q) ||
        d.docType.toLowerCase().includes(q) ||
        d.submittedBy.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  /* ── Summary counts ── */
  const counts: Record<DocStatus, number> = {
    "Pending Review":   reviewableDocuments.filter((d) => d.status === "Pending Review").length,
    "Pending Approval": reviewableDocuments.filter((d) => d.status === "Pending Approval").length,
    Reviewed:           reviewableDocuments.filter((d) => d.status === "Reviewed").length,
    Approved:           reviewableDocuments.filter((d) => d.status === "Approved").length,
    Rejected:           reviewableDocuments.filter((d) => d.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Documents</h1>
        <p className="text-textSecondary text-sm mt-1">
          Review and approve documents submitted by legal officers.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.entries(counts) as [DocStatus, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all hover:scale-[1.02]",
              statusFilter === status
                ? docStatusBadge[status]
                : "border-borderPrimary bg-backgroundSecondary hover:bg-hoverPrimary"
            )}
          >
            <div className={cn("text-2xl font-bold", statusFilter === status ? "" : "text-textPrimary")}>
              {count}
            </div>
            <div className={cn("text-xs mt-1", statusFilter === status ? "opacity-80" : "text-textSecondary")}>
              {status}
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
            placeholder="Search by doc ID, case, officer..."
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
            onChange={(e) => setStatusFilter(e.target.value as "All" | DocStatus)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {STATUS_OPTIONS.map((o) => (
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
            <X className="h-3.5 w-3.5" /> Clear filter
          </button>
        )}
      </div>

      {/* Document cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary py-16 text-center text-textSecondary">
          No documents match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => {
            const isPending = d.status === "Pending Review" || d.status === "Pending Approval";
            return (
              <div
                key={d.id}
                className="rounded-xl border border-borderPrimary bg-backgroundSecondary p-5 hover:bg-hoverPrimary transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-primary font-bold">{d.id}</span>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", docStatusBadge[d.status])}>
                        {d.status}
                      </span>
                    </div>

                    <p className="text-base font-semibold text-textPrimary">{d.docType}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-textSecondary">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="font-mono text-primary">{d.caseId}</span>&nbsp;·&nbsp;{d.caseTitle}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {d.submittedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" /> Submitted {fmt(d.submittedDate)}
                      </span>
                      {d.reviewedDate && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Reviewed {fmt(d.reviewedDate)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-textSecondary leading-relaxed">{d.notes}</p>
                  </div>

                  {/* Action buttons */}
                  {isPending && (
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      {d.status === "Pending Review" && (
                        <button
                          onClick={() => setModal({ doc: d, action: "review" })}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-medium hover:bg-purple-500/20 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> Mark Reviewed
                        </button>
                      )}
                      <button
                        onClick={() => setModal({ doc: d, action: "approve" })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-medium hover:bg-green-500/20 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setModal({ doc: d, action: "reject" })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {reviewableDocuments.length} documents
      </p>

      {/* Modal */}
      {modal && (
        <ActionModal
          doc={modal.doc}
          action={modal.action}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
