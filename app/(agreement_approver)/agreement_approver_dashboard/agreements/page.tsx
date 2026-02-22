"use client";

import React, { useState, useMemo } from "react";
import { approvableAgreements } from "../../_data/agreements";
import { ApprovableAgreement, ApprovalStatus, RiskLevel } from "../../_data/types";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  CalendarDays,
  User,
  FileText,
  DollarSign,
  MessageSquare,
  Shield,
  Stamp,
  History,
} from "lucide-react";

/* ── Badge maps ── */
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

const STATUS_OPTIONS: ("All" | ApprovalStatus)[] = [
  "All",
  "Awaiting Final Approval",
  "Finally Approved",
  "Returned for Revision",
  "Escalated",
];

const RISK_OPTIONS: ("All" | RiskLevel)[] = ["All", "Critical", "High", "Medium", "Low"];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Approval / Return Modal ── */
function ApprovalModal({
  agreement,
  action,
  onClose,
  onUpdate,
}: {
  agreement: ApprovableAgreement;
  action: "approve" | "return";
  onClose: () => void;
  onUpdate: (updated: ApprovableAgreement) => void;
}) {
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit() {
    if (action === "return" && !note.trim()) return;
    const today = new Date("2026-02-21").toISOString().split("T")[0];
    const updated: ApprovableAgreement = {
      ...agreement,
      status: action === "approve" ? "Finally Approved" : "Returned for Revision",
      approvedDate: action === "approve" ? today : undefined,
      history: [
        ...agreement.history,
        {
          date: today,
          action: action === "approve" ? "Finally Approved" : "Returned for Revision",
          by: "CLO",
          note: note.trim() || undefined,
        },
      ],
    };
    onUpdate(updated);
    setDone(true);
  }

  const isApprove = action === "approve";

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
              {isApprove ? "Final Approval" : "Return for Revision"}
            </h2>
            <p className="text-sm text-textSecondary mt-0.5">
              <span className="font-mono text-primary">{agreement.id}</span> ·{" "}
              {agreement.title}
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
                "h-14 w-14 rounded-full flex items-center justify-center",
                isApprove ? "bg-green-500/15" : "bg-red-500/15"
              )}
            >
              {isApprove ? (
                <Stamp className={cn("h-7 w-7", "text-green-400")} />
              ) : (
                <RotateCcw className="h-7 w-7 text-red-400" />
              )}
            </div>
            <p className="text-textPrimary font-semibold text-base">
              {isApprove ? "Agreement Finally Approved" : "Returned for Revision"}
            </p>
            <p className="text-sm text-textSecondary max-w-xs">
              {isApprove
                ? `${agreement.id} has been granted final CLO approval and is cleared for execution.`
                : `${agreement.id} has been returned. The reviewer will be notified to address the noted concerns.`}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Agreement summary */}
            <div className="rounded-lg border border-borderPrimary bg-hoverPrimary px-4 py-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", riskBadge[agreement.riskLevel])}>
                  {agreement.riskLevel} Risk
                </span>
                <span className="text-xs text-textSecondary font-mono">{agreement.value}</span>
              </div>
              <p className="text-xs text-textSecondary">
                Reviewed by {agreement.reviewedBy} on {fmt(agreement.reviewedDate)}
              </p>
              <p className="text-xs text-textSecondary italic">
                &ldquo;{agreement.reviewerComment}&rdquo;
              </p>
            </div>

            {/* Warning for Critical */}
            {agreement.riskLevel === "Critical" && isApprove && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                ⚠ This is a <strong>Critical Risk</strong> agreement. Ensure Board notification procedures are followed upon approval.
              </div>
            )}

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-textPrimary">
                {isApprove ? "Approval Note (optional)" : "Reason for Return (required)"}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={
                  isApprove
                    ? "Add any conditions, directives, or notes for the record..."
                    : "Specify what needs to be revised before resubmission..."
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
                onClick={handleSubmit}
                disabled={!isApprove && !note.trim()}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                  isApprove ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
                )}
              >
                {isApprove ? (
                  <><Stamp className="h-4 w-4" /> Grant Final Approval</>
                ) : (
                  <><RotateCcw className="h-4 w-4" /> Return for Revision</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Detail Drawer ── */
function DetailModal({
  agreement,
  onClose,
  onAction,
}: {
  agreement: ApprovableAgreement;
  onClose: () => void;
  onAction: (action: "approve" | "return") => void;
}) {
  const [tab, setTab] = useState<"details" | "history">("details");
  const isPending = agreement.status === "Awaiting Final Approval";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
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
              <span className="font-mono text-xs text-primary font-bold">{agreement.id}</span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusBadge[agreement.status])}>
                {agreement.status}
              </span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", riskBadge[agreement.riskLevel])}>
                {agreement.riskLevel} Risk
              </span>
            </div>
            <h2 className="text-lg font-bold text-textPrimary leading-tight">{agreement.title}</h2>
            <p className="text-sm text-textSecondary mt-0.5">{agreement.type}</p>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary shrink-0 mt-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-borderPrimary shrink-0">
          {(["details", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-3 text-sm font-medium capitalize transition-colors flex items-center justify-center gap-1.5",
                tab === t
                  ? "text-primary border-b-2 border-primary"
                  : "text-textSecondary hover:text-textPrimary"
              )}
            >
              {t === "history" ? <History className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
              {t === "history" ? `Audit Trail (${agreement.history.length})` : "Details"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "details" ? (
            <div className="space-y-5">
              <p className="text-sm text-textSecondary leading-relaxed">{agreement.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <User className="h-4 w-4" />, label: "Submitted By", value: agreement.submittedBy },
                  { icon: <FileText className="h-4 w-4" />, label: "Counterparty", value: agreement.counterparty },
                  { icon: <Shield className="h-4 w-4" />, label: "Reviewed By", value: agreement.reviewedBy },
                  { icon: <CalendarDays className="h-4 w-4" />, label: "Reviewed Date", value: fmt(agreement.reviewedDate) },
                  { icon: <CalendarDays className="h-4 w-4" />, label: "Due Date", value: fmt(agreement.dueDate) },
                  { icon: <DollarSign className="h-4 w-4" />, label: "Value", value: agreement.value },
                  ...(agreement.approvedDate
                    ? [{ icon: <CheckCircle2 className="h-4 w-4" />, label: "Approved Date", value: fmt(agreement.approvedDate) }]
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

              {/* Reviewer summary */}
              <div className="rounded-xl border border-borderPrimary bg-hoverPrimary p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-textSecondary mb-1">
                  <MessageSquare className="h-3.5 w-3.5" /> Reviewer Summary
                </div>
                <p className="text-sm text-textPrimary leading-relaxed">
                  &ldquo;{agreement.reviewerComment}&rdquo;
                </p>
              </div>

              {/* Action buttons */}
              {isPending && (
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={() => onAction("approve")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors"
                  >
                    <Stamp className="h-4 w-4" /> Grant Final Approval
                  </button>
                  <button
                    onClick={() => onAction("return")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/20 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" /> Return for Revision
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Audit trail */
            <ol className="relative border-l border-borderPrimary ml-2 space-y-5">
              {[...agreement.history].reverse().map((h, i) => (
                <li key={i} className="ml-5">
                  <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-backgroundSecondary bg-primary" />
                  <p className="text-xs text-textSecondary mb-0.5">{fmt(h.date)}</p>
                  <p className="text-sm text-textPrimary font-medium">{h.action}</p>
                  <p className="text-xs text-textSecondary">by {h.by}</p>
                  {h.note && (
                    <p className="text-xs text-textSecondary mt-0.5 italic">{h.note}</p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AgreementApproverAgreementsPage() {
  const [data, setData] = useState<ApprovableAgreement[]>(
    approvableAgreements as ApprovableAgreement[]
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApprovalStatus>("All");
  const [riskFilter, setRiskFilter] = useState<"All" | RiskLevel>("All");
  const [detail, setDetail] = useState<ApprovableAgreement | null>(null);
  const [approvalModal, setApprovalModal] = useState<{
    agreement: ApprovableAgreement;
    action: "approve" | "return";
  } | null>(null);

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
      const matchRisk = riskFilter === "All" || a.riskLevel === riskFilter;
      return matchSearch && matchStatus && matchRisk;
    });
  }, [data, search, statusFilter, riskFilter]);

  function handleUpdate(updated: ApprovableAgreement) {
    setData((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (detail?.id === updated.id) setDetail(updated);
    setApprovalModal(null);
  }

  const counts = {
    "Awaiting Final Approval": data.filter((a) => a.status === "Awaiting Final Approval").length,
    "Finally Approved": data.filter((a) => a.status === "Finally Approved").length,
    "Returned for Revision": data.filter((a) => a.status === "Returned for Revision").length,
    Escalated: data.filter((a) => a.status === "Escalated").length,
  } as Record<ApprovalStatus, number>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Agreements — Final Approval</h1>
        <p className="text-textSecondary text-sm mt-1">
          All agreements cleared by the reviewer and awaiting CLO final approval.
        </p>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(counts) as [ApprovalStatus, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
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

      {/* Search + filters */}
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

        {/* Status dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | ApprovalStatus)}
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

        {/* Risk dropdown */}
        <div className="relative">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as "All" | RiskLevel)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {RISK_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === "All" ? "All Risk Levels" : o + " Risk"}
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
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Risk</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Value</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Due Date</th>
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
                  const isPending = a.status === "Awaiting Final Approval";
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
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", riskBadge[a.riskLevel])}>
                          {a.riskLevel}
                        </span>
                      </td>
                      Line 541:
                      <td className="px-4 sm:px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", statusBadge[a.status])}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs font-mono whitespace-nowrap">
                        {a.value}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs whitespace-nowrap">
                        {fmt(a.dueDate)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* View details */}
                          <button
                            onClick={() => setDetail(a)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                          >
                            <FileText className="h-3.5 w-3.5" /> View
                          </button>
                          {/* Approve */}
                          {isPending && (
                            <button
                              onClick={() => setApprovalModal({ agreement: a, action: "approve" })}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-medium hover:bg-green-500/20 transition-colors whitespace-nowrap"
                            >
                              <Stamp className="h-3.5 w-3.5" /> Approve
                            </button>
                          )}
                          {/* Return */}
                          {isPending && (
                            <button
                              onClick={() => setApprovalModal({ agreement: a, action: "return" })}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-medium hover:bg-red-500/20 transition-colors whitespace-nowrap"
                            >
                              <RotateCcw className="h-3.5 w-3.5" /> Return
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
      {detail && !approvalModal && (
        <DetailModal
          agreement={detail}
          onClose={() => setDetail(null)}
          onAction={(action) => {
            setApprovalModal({ agreement: detail, action });
          }}
        />
      )}

      {/* Approval / Return modal */}
      {approvalModal && (
        <ApprovalModal
          agreement={approvalModal.agreement}
          action={approvalModal.action}
          onClose={() => setApprovalModal(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
