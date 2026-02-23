"use client";

import { useEffect, useState } from "react";
import { reviewableDocuments, caseShiftRequests } from "./_data/data";
import { cn } from "@/lib/utils";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { DocStatus, ReviewableDocument, CaseShiftRequest, ShiftStatus } from "./_data/types";
import {
  Clock,
  FileText,
  Activity as ActivityIcon,
  PauseCircle,
  XCircle,
  MessageSquare,
  CheckSquare,
} from "lucide-react";

interface Activity {
  type: string; // "COMMENT" | "CLOSING_REMARK"
  caseId: number;
  referenceNumber: string;
  caseTitle: string;
  authorName: string;
  authorEmail: string;
  content: string;
  timestamp: string;
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
  status: "NEW" | "ACTIVE" | "ON_HOLD" | "CLOSED";
  createdSupervisorName: string;
  createdSupervisorEmail: string;
  createdAt: string;
  assignedOfficerName: string | null;
  assignedOfficerEmail: string | null;
  assignedAt: string | null;
  approvedByName: string | null;
  approvedByEmail: string | null;
  approvedAt: string | null;
  closedByName: string | null;
  closedByEmail: string | null;
  closedAt: string | null;
  closingRemarks: string | null;
  comments: any[];
  supportingAttachments: any[];
}

/* ── helpers ── */
const docStatusBadge: Record<DocStatus, string> = {
  "Pending Review": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Pending Approval": "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Reviewed: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const shiftStatusBadge: Record<ShiftStatus, string> = {
  Pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Pending docs for quick action ── */
const pendingDocs = reviewableDocuments.filter(
  (d): d is ReviewableDocument =>
    d.status === "Pending Review" || d.status === "Pending Approval"
);

/* ── Pending shifts for quick action ── */
const pendingShifts = caseShiftRequests.filter(
  (s): s is CaseShiftRequest => s.status === "Pending"
);

export default function SupervisorPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SUPERVISOR.GET_OWN_CASES);
        let fetchedCases = [];
        if (Array.isArray(response.data)) {
          fetchedCases = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          fetchedCases = response.data.data;
        }
        setCases(fetchedCases);
      } catch (error) {
        console.error("Failed to fetch cases", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SUPERVISOR.GET_COMMENT_AND_REMARKS);
        let fetchedActivities = [];
        if (Array.isArray(response.data)) {
          fetchedActivities = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          fetchedActivities = response.data.data;
        }
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };

    fetchCases();
    fetchActivities();
  }, []);

  /* ── KPI cards data ── */
  const kpis = [
    {
      label: "New Cases",
      value: cases.filter((c) => c.status === "NEW").length,
      sub: "new cases",
      icon: <FileText className="h-6 w-6 text-blue-400" />,
      color: "text-blue-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
    },
    {
      label: "Active Cases",
      value: cases.filter((c) => c.status === "ACTIVE").length,
      sub: "currently active",
      icon: <ActivityIcon className="h-6 w-6 text-green-400" />,
      color: "text-green-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
    },
    {
      label: "On Hold",
      value: cases.filter((c) => c.status === "ON_HOLD").length,
      sub: "cases on hold",
      icon: <PauseCircle className="h-6 w-6 text-orange-400" />,
      color: "text-orange-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
    },
    {
      label: "Closed Cases",
      value: cases.filter((c) => c.status === "CLOSED").length,
      sub: "resolved or closed",
      icon: <XCircle className="h-6 w-6 text-red-400" />,
      color: "text-red-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
    },
  ];
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
        <p className="text-textSecondary text-sm mt-1">
          Review documents, approve case type shifts, and manage legal officer assignments.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-borderPrimary bg-backgroundSecondary p-5 flex flex-col gap-3 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-hoverPrimary rounded"></div>
                <div className="h-6 w-6 bg-hoverPrimary rounded-full"></div>
              </div>
              <div className="h-10 w-12 bg-hoverPrimary rounded mt-1"></div>
              <div className="h-3 w-24 bg-hoverPrimary rounded"></div>
            </div>
          ))
        ) : (
          kpis.map((k) => (
            <div
              key={k.label}
              className={cn(
                "rounded-xl border p-5 flex flex-col gap-3",
                k.bg,
                k.border
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-textSecondary">{k.label}</span>
                {k.icon}
              </div>
              <div className={cn("text-4xl font-bold", k.color)}>{k.value}</div>
              <div className="text-xs text-textSecondary">{k.sub}</div>
            </div>
          ))
        )}
      </div>

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Documents */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">Pending Documents</h2>
            <a href="/legal_supervisor_dashboard/documents" className="text-xs text-primary hover:underline">
              View all →
            </a>
          </div>
          {loading ? (
            <div className="divide-y divide-borderPrimary">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-4 sm:px-6 py-4 flex items-start justify-between gap-3 animate-pulse">
                  <div className="w-full space-y-2">
                    <div className="h-4 w-1/3 bg-hoverPrimary rounded"></div>
                    <div className="h-3 w-2/3 bg-hoverPrimary rounded mt-1"></div>
                    <div className="h-3 w-1/2 bg-hoverPrimary rounded"></div>
                  </div>
                  <div className="h-6 w-24 bg-hoverPrimary rounded-full shrink-0"></div>
                </div>
              ))}
            </div>
          ) : pendingDocs.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-10">No pending documents.</p>
          ) : (
            <ul className="divide-y divide-borderPrimary">
              {pendingDocs.map((d) => (
                <li key={d.id} className="px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-textPrimary font-medium truncate">{d.docType}</p>
                      <p className="text-xs text-textSecondary mt-0.5 truncate">
                        <span className="font-mono text-primary">{d.caseId}</span> · {d.caseTitle}
                      </p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        By {d.submittedBy} · {fmt(d.submittedDate)}
                      </p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium shrink-0", docStatusBadge[d.status])}>
                      {d.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending Case Shifts */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">Pending Case Type Shifts</h2>
            <a href="/legal_supervisor_dashboard/case-shifts" className="text-xs text-primary hover:underline">
              View all →
            </a>
          </div>
          {loading ? (
            <div className="divide-y divide-borderPrimary">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-4 sm:px-6 py-4 flex items-start justify-between gap-3 animate-pulse">
                  <div className="w-full space-y-2">
                    <div className="h-4 w-1/3 bg-hoverPrimary rounded"></div>
                    <div className="h-3 w-1/2 bg-hoverPrimary rounded mt-1"></div>
                    <div className="h-3 w-1/3 bg-hoverPrimary rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-hoverPrimary rounded-full shrink-0"></div>
                </div>
              ))}
            </div>
          ) : pendingShifts.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-10">No pending shift requests.</p>
          ) : (
            <ul className="divide-y divide-borderPrimary">
              {pendingShifts.map((s) => (
                <li key={s.id} className="px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-textPrimary font-medium truncate">{s.caseTitle}</p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        <span className="font-mono text-primary">{s.caseId}</span> ·{" "}
                        <span className="line-through opacity-60">{s.currentType}</span>
                        {" → "}
                        <span className="font-medium text-textPrimary">{s.requestedType}</span>
                      </p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        By {s.requestedBy} · {fmt(s.requestDate)}
                      </p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium shrink-0", shiftStatusBadge[s.status])}>
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Case Activities (Comments & Remarks) */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-base font-semibold text-textPrimary">Recent Comments &amp; Remarks</h2>
        </div>
        {loading ? (
          <div className="divide-y divide-borderPrimary">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 sm:px-6 py-4 flex items-start gap-4 animate-pulse">
                <div className="mt-0.5 h-8 w-8 bg-hoverPrimary rounded-full shrink-0"></div>
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-20 bg-hoverPrimary rounded"></div>
                    <div className="h-4 w-1/3 bg-hoverPrimary rounded"></div>
                    <div className="h-4 w-16 bg-hoverPrimary rounded-full"></div>
                  </div>
                  <div className="h-4 w-3/4 bg-hoverPrimary rounded mt-2"></div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="h-3 w-24 bg-hoverPrimary rounded"></div>
                    <div className="h-3 w-32 bg-hoverPrimary rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-textSecondary text-center py-10">No recent activities.</p>
        ) : (
          <ul className="divide-y divide-borderPrimary">
            {activities.map((a, idx) => (
              <li key={idx} className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors">
                <div
                  className={cn(
                    "mt-0.5 p-2 rounded-full shrink-0",
                    a.type === "CLOSING_REMARK" ? "bg-red-500/15 text-red-400" : "bg-blue-500/15 text-blue-400"
                  )}
                >
                  {a.type === "CLOSING_REMARK" ? <CheckSquare className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold">{a.referenceNumber}</span>
                    <span className="text-sm text-textPrimary font-medium">{a.caseTitle}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        a.type === "CLOSING_REMARK" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      )}
                    >
                      {a.type === "CLOSING_REMARK" ? "Closing Remark" : "Comment"}
                    </span>
                  </div>
                  <p className="text-sm text-textSecondary mt-2">"{a.content}"</p>
                  <div className="text-xs text-textSecondary mt-2 flex items-center justify-between">
                    <span>By {a.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(a.timestamp).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
