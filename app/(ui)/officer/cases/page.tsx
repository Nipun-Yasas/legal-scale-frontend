"use client";

import React, { useState, useEffect, useMemo } from "react";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Search, X, ChevronDown, User, CalendarDays, DollarSign, Clock, Building2, RefreshCw, MessageSquarePlus, Paperclip } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: number;
  caseId: number;
  commentedByName: string;
  commentedByEmail: string;
  comment: string;
  commentedAt: string;
}

interface Case {
  id: number;
  caseTitle: string;
  caseType: string;
  referenceNumber: string;
  partiesInvolved: string;
  natureOfCase: string;
  dateOfOccurrenceOrFiling: string;
  courtOrAuthority: string;
  financialExposure: number;
  summaryOfFacts: string;
  status: string;
  createdSupervisorName: string;
  createdSupervisorEmail: string;
  createdAt: string;
  assignedOfficerName: string;
  assignedOfficerEmail: string;
  assignedAt: string;
  comments: Comment[];
  supportingAttachments: any[];
}

const statusBadge: Record<string, string> = {
  NEW: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
  ON_HOLD: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  CLOSED: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
};

const STATUS_OPTIONS = ["ACTIVE", "ON_HOLD"];

function fmt(date: string | null | undefined) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusChangeModal({
  c,
  onClose,
  onSuccess
}: {
  c: Case;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [newStatus, setNewStatus] = useState(c.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(API_PATHS.OFFICER.CHANGE_STATUS(c.id.toString()), { status: newStatus });
      toast.success("Status updated successfully.");
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to change status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-textPrimary mb-4">Change Status</h2>
        <p className="text-sm text-textSecondary mb-4">Update status for Case #{c.id}</p>

        <div className="space-y-3 mb-6">
          {STATUS_OPTIONS.map(s => (
            <label key={s} className="flex items-center gap-2 text-textPrimary cursor-pointer">
              <input
                type="radio"
                name="status"
                value={s}
                checked={newStatus === s}
                onChange={(e) => setNewStatus(e.target.value)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              {s.replace("_", " ")}
            </label>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-textSecondary hover:bg-hoverPrimary rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCommentModal({
  c,
  onClose,
  onSuccess
}: {
  c: Case;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      await axiosInstance.post(API_PATHS.OFFICER.ADD_COMMENT(c.id.toString()), { comment: comment.trim() });
      toast.success("Comment added successfully.");
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-textPrimary mb-4">Add Comment</h2>
        <p className="text-sm text-textSecondary mb-4">Adding a comment to Case #{c.id}</p>

        <div className="space-y-3 mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-textSecondary hover:bg-hoverPrimary rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !comment.trim()} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AttachDocumentsModal({
  c,
  onClose,
  onSuccess
}: {
  c: Case;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSave = async () => {
    if (files.length === 0) return;
    setSaving(true);
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    try {
      await axiosInstance.post(API_PATHS.CASE.ATTACHMENT_DOCUMENT(c.id.toString()), formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Documents uploaded successfully.");
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload documents. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-textPrimary mb-4">Attach Documents</h2>
        <p className="text-sm text-textSecondary mb-4">Upload documents for Case #{c.id}</p>

        <div className="space-y-4 mb-6">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
          />
          {files.length > 0 && (
            <div className="text-xs text-textSecondary">
              {files.length} file(s) selected
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-textSecondary hover:bg-hoverPrimary rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || files.length === 0} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | string>("ALL");
  const [selectedCaseForStatus, setSelectedCaseForStatus] = useState<Case | null>(null);
  const [selectedCaseForComment, setSelectedCaseForComment] = useState<Case | null>(null);
  const [selectedCaseForDocs, setSelectedCaseForDocs] = useState<Case | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.OFFICER.GET_ASSIGNED_CASES);
      setCases(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch assigned cases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.id.toString().includes(q) ||
        (c.caseTitle || "").toLowerCase().includes(q) ||
        (c.partiesInvolved || "").toLowerCase().includes(q) ||
        (c.referenceNumber || "").toLowerCase().includes(q) ||
        (c.caseType || "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cases, search, statusFilter]);

  if (loading && cases.length === 0 && !search) {
    // We will render skeleton rows in the table instead mapping the whole page as loader
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">My Cases</h1>
        <p className="text-textSecondary text-sm mt-1">
          All cases assigned to you — {cases.length} total.
        </p>
      </div>

      {/* Progress summary pills */}
      <div className="flex flex-wrap gap-3">
        {STATUS_OPTIONS.map((status) => {
          const count = cases.filter((c) => c.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "ALL" : status)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium border transition-all uppercase",
                statusFilter === status
                  ? statusBadge[status] || "border-primary text-primary"
                  : "border-borderPrimary text-textSecondary hover:bg-hoverPrimary"
              )}
            >
              {status.replace("_", " ")} · {count}
            </button>
          );
        })}
        {statusFilter !== "ALL" && (
          <button
            onClick={() => setStatusFilter("ALL")}
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
            placeholder="Search by ID, title, parties, type..."
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
      </div>

      {/* Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary">
                <th className="text-left px-6 py-3 font-medium">Case ID</th>
                <th className="text-left px-6 py-3 font-medium">Ref Number</th>
                <th className="text-left px-6 py-3 font-medium">Title</th>
                <th className="text-left px-6 py-3 font-medium">Type</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Parties Involved</th>
                <th className="text-left px-6 py-3 font-medium">Assigned Date</th>
                <th className="text-left px-6 py-3 font-medium">Exposure</th>
                <th className="text-center px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-borderPrimary animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-hoverPrimary rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-hoverPrimary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-24 bg-hoverPrimary rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-textSecondary">
                    No cases match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={cn(
                      "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                      i === filtered.length - 1 && "border-none"
                    )}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-primary font-bold whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="px-6 py-4 text-textSecondary font-mono text-xs whitespace-nowrap">
                      {c.referenceNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-textPrimary font-medium max-w-[180px] truncate" title={c.caseTitle}>
                      {c.caseTitle}
                    </td>
                    <td className="px-6 py-4 text-textSecondary whitespace-nowrap">{c.caseType}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap uppercase tracking-wider", statusBadge[c.status] || "bg-slate-500/15 text-slate-400 border border-slate-500/30")}>
                        {c.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textSecondary whitespace-nowrap max-w-[150px] truncate" title={c.partiesInvolved}>
                      {c.partiesInvolved || "-"}
                    </td>
                    <td className="px-6 py-4 text-textSecondary text-xs whitespace-nowrap">{fmt(c.assignedAt)}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs font-mono whitespace-nowrap">
                      {c.financialExposure ? `$${c.financialExposure.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedCaseForStatus(c)}
                          title="Change Status"
                          className="flex items-center justify-center p-2 text-blue-500 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedCaseForComment(c)}
                          title="Add Comment"
                          className="flex items-center justify-center p-2 text-green-500 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors"
                        >
                          <MessageSquarePlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedCaseForDocs(c)}
                          title="Attach Documents"
                          className="flex items-center justify-center p-2 text-purple-500 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Paperclip className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-textSecondary">
        Showing {filtered.length} of {cases.length} cases
      </p>

      {/* Detail modal */}
      {selectedCaseForStatus && (
        <StatusChangeModal
          c={selectedCaseForStatus}
          onClose={() => setSelectedCaseForStatus(null)}
          onSuccess={fetchCases}
        />
      )}
      {selectedCaseForComment && (
        <AddCommentModal
          c={selectedCaseForComment}
          onClose={() => setSelectedCaseForComment(null)}
          onSuccess={fetchCases}
        />
      )}
      {selectedCaseForDocs && (
        <AttachDocumentsModal
          c={selectedCaseForDocs}
          onClose={() => setSelectedCaseForDocs(null)}
          onSuccess={fetchCases}
        />
      )}
    </div>
  );
}
