"use client";

import React, { useState, useMemo } from "react";
import { agreements as initialAgreements } from "../../_data/agreements";
import { Agreement, AgreementStatus, AgreementComment } from "../../_data/types";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  Eye,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Send,
  CalendarDays,
  User,
  FileText,
  DollarSign,
  XCircle,
} from "lucide-react";

/* ── Badge map ── */
const statusBadge: Record<AgreementStatus, string> = {
  "Pending Review": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Under Review": "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Reviewed: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const STATUS_OPTIONS: ("All" | AgreementStatus)[] = [
  "All",
  "Pending Review",
  "Under Review",
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

/* ── Detail + Comment + Review Modal ── */
function AgreementModal({
  agreement,
  onClose,
  onUpdate,
}: {
  agreement: Agreement;
  onClose: () => void;
  onUpdate: (updated: Agreement) => void;
}) {
  const [tab, setTab] = useState<"details" | "comments">("details");
  const [commentText, setCommentText] = useState("");
  const [clause, setClause] = useState("");
  const [localAgreement, setLocalAgreement] = useState<Agreement>({ ...agreement, comments: [...agreement.comments] });
  const [actionDone, setActionDone] = useState<"reviewed" | "approved" | "rejected" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const isPending =
    localAgreement.status === "Pending Review" ||
    localAgreement.status === "Under Review";

  function addComment() {
    if (!commentText.trim()) return;
    const newComment: AgreementComment = {
      id: `CMT-NEW-${Date.now()}`,
      author: "Reviewer",
      date: new Date().toISOString().split("T")[0],
      text: commentText.trim(),
      clause: clause.trim() || undefined,
    };
    const updated: Agreement = {
      ...localAgreement,
      comments: [...localAgreement.comments, newComment],
      status: localAgreement.status === "Pending Review" ? "Under Review" : localAgreement.status,
    };
    setLocalAgreement(updated);
    onUpdate(updated);
    setCommentText("");
    setClause("");
  }

  function markReviewed() {
    const updated: Agreement = {
      ...localAgreement,
      status: "Reviewed",
      reviewedDate: new Date().toISOString().split("T")[0],
    };
    setLocalAgreement(updated);
    onUpdate(updated);
    setActionDone("reviewed");
  }

  function markApproved() {
    const updated: Agreement = {
      ...localAgreement,
      status: "Approved",
      reviewedDate: new Date().toISOString().split("T")[0],
    };
    setLocalAgreement(updated);
    onUpdate(updated);
    setActionDone("approved");
  }

  function markRejected() {
    if (!rejectReason.trim()) return;
    const note: AgreementComment = {
      id: `CMT-REJ-${Date.now()}`,
      author: "Reviewer",
      date: new Date().toISOString().split("T")[0],
      text: rejectReason.trim(),
    };
    const updated: Agreement = {
      ...localAgreement,
      status: "Rejected",
      reviewedDate: new Date().toISOString().split("T")[0],
      comments: [...localAgreement.comments, note],
    };
    setLocalAgreement(updated);
    onUpdate(updated);
    setActionDone("rejected");
    setShowRejectInput(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-borderPrimary shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs text-primary font-bold">{localAgreement.id}</span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusBadge[localAgreement.status])}>
                {localAgreement.status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-textPrimary leading-tight">{localAgreement.title}</h2>
            <p className="text-sm text-textSecondary mt-0.5">{localAgreement.type}</p>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-borderPrimary shrink-0">
          {(["details", "comments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-3 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "text-primary border-b-2 border-primary"
                  : "text-textSecondary hover:text-textPrimary"
              )}
            >
              {t === "comments" ? `Comments (${localAgreement.comments.length})` : "Details"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "details" ? (
            <div className="space-y-5">
              <p className="text-sm text-textSecondary leading-relaxed">{localAgreement.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <User className="h-4 w-4" />, label: "Submitted By", value: localAgreement.submittedBy },
                  { icon: <FileText className="h-4 w-4" />, label: "Counterparty", value: localAgreement.counterparty },
                  { icon: <CalendarDays className="h-4 w-4" />, label: "Submitted", value: fmt(localAgreement.submittedDate) },
                  { icon: <CalendarDays className="h-4 w-4" />, label: "Due Date", value: fmt(localAgreement.dueDate) },
                  { icon: <DollarSign className="h-4 w-4" />, label: "Value", value: localAgreement.value },
                  ...(localAgreement.reviewedDate
                    ? [{ icon: <CheckCircle2 className="h-4 w-4" />, label: "Completed", value: fmt(localAgreement.reviewedDate) }]
                    : []),
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

              {/* Action buttons */}
              {isPending && !showRejectInput && !actionDone && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={markReviewed}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                  >
                    <Eye className="h-4 w-4" /> Mark Reviewed
                  </button>
                  <button
                    onClick={markApproved}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-sm font-medium hover:bg-green-500/20 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/20 transition-colors"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}

              {showRejectInput && (
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-textPrimary">Rejection Reason (required)</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Explain why this agreement is being rejected..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRejectInput(false)}
                      className="px-4 py-2 rounded-lg border border-borderPrimary text-sm text-textSecondary hover:bg-hoverPrimary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={markRejected}
                      disabled={!rejectReason.trim()}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}

              {actionDone && (
                <div
                  className={cn(
                    "rounded-xl border px-4 py-3 flex items-center gap-2 text-sm font-medium",
                    actionDone === "approved"
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : actionDone === "reviewed"
                        ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Agreement marked as{" "}
                  {actionDone === "reviewed" ? "Reviewed" : actionDone === "approved" ? "Approved" : "Rejected"}.
                </div>
              )}
            </div>
          ) : (
            /* Comments tab */
            <div className="space-y-5">
              {/* Existing comments */}
              {localAgreement.comments.length === 0 ? (
                <p className="text-sm text-textSecondary text-center py-6">
                  No comments yet. Add the first comment below.
                </p>
              ) : (
                <ol className="relative border-l border-borderPrimary ml-2 space-y-5">
                  {localAgreement.comments.map((c) => (
                    <li key={c.id} className="ml-5">
                      <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-backgroundSecondary bg-primary" />
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-textPrimary">{c.author}</span>
                        {c.clause && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-borderPrimary text-textSecondary">
                            {c.clause}
                          </span>
                        )}
                        <span className="text-xs text-textSecondary">{fmt(c.date)}</span>
                      </div>
                      <p className="text-sm text-textPrimary leading-relaxed">{c.text}</p>
                    </li>
                  ))}
                </ol>
              )}

              {/* Add comment (always visible) */}
              <div className="border-t border-borderPrimary pt-4 space-y-3">
                <p className="text-sm font-semibold text-textPrimary">Add Comment</p>
                <input
                  value={clause}
                  onChange={(e) => setClause(e.target.value)}
                  placeholder="Clause reference (e.g. Clause 4.2) — optional"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Leave a review comment or flag an issue..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <button
                  onClick={addComment}
                  disabled={!commentText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5" /> Post Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AgreementsPage() {
  const [data, setData] = useState<Agreement[]>(initialAgreements as Agreement[]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AgreementStatus>("All");
  const [selected, setSelected] = useState<Agreement | null>(null);

  const filtered = useMemo(() => {
    return data.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.counterparty.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.submittedBy.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  function handleUpdate(updated: Agreement) {
    setData((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(updated);
  }

  /* Summary counts */
  const counts = {
    "Pending Review": data.filter((a) => a.status === "Pending Review").length,
    "Under Review": data.filter((a) => a.status === "Under Review").length,
    Reviewed: data.filter((a) => a.status === "Reviewed").length,
    Approved: data.filter((a) => a.status === "Approved").length,
    Rejected: data.filter((a) => a.status === "Rejected").length,
  } as Record<AgreementStatus, number>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Agreements</h1>
        <p className="text-textSecondary text-sm mt-1">
          Review agreements, leave comments, and mark them as reviewed or approved.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(counts) as [AgreementStatus, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "All" : status)
            }
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
              statusFilter === status
                ? statusBadge[status]
                : "border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
            )}
          >
            {status} · {count}
          </button>
        ))}
        {statusFilter !== "All" && (
          <button
            onClick={() => setStatusFilter("All")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, counterparty..."
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
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | AgreementStatus)
            }
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
      </div>

      {/* Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary">
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">ID</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Title</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Type</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Counterparty</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Due Date</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Value</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Comments</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-textSecondary">
                    No agreements match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a, i) => {
                  const isPending =
                    a.status === "Pending Review" || a.status === "Under Review";
                  return (
                    <tr
                      key={a.id}
                      className={cn(
                        "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                        i === filtered.length - 1 && "border-none"
                      )}
                    >
                      <td className="px-4 sm:px-6 py-4 font-mono text-xs text-primary font-bold whitespace-nowrap">
                        {a.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textPrimary font-medium min-w-[150px] truncate">
                        {a.title}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textSecondary whitespace-nowrap text-xs">
                        {a.type}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textSecondary whitespace-nowrap">
                        {a.counterparty}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                            statusBadge[a.status]
                          )}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs whitespace-nowrap">
                        {fmt(a.dueDate)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs font-mono whitespace-nowrap">
                        {a.value}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="flex items-center gap-1 text-textSecondary text-xs">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {a.comments.length}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* View / Comment */}
                          <button
                            onClick={() => setSelected(a)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Comment
                          </button>
                          {/* Quick review */}
                          {isPending && (
                            <button
                              onClick={() => setSelected(a)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-medium hover:bg-purple-500/20 transition-colors whitespace-nowrap"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {data.length} agreements
      </p>

      {/* Detail modal */}
      {selected && (
        <AgreementModal
          agreement={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
