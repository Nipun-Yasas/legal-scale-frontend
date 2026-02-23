"use client";

import React, { useState, useEffect } from "react";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Briefcase, CheckCircle2, PauseCircle, Flame } from "lucide-react";

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

export default function LegalOfficerDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.OFFICER.GET_ASSIGNED_CASES);
        setCases(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch assigned cases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const progressCounts = [
    { status: "NEW", label: "New", count: cases.filter((c) => c.status === "NEW").length },
    { status: "ACTIVE", label: "Active", count: cases.filter((c) => c.status === "ACTIVE").length },
    { status: "ON_HOLD", label: "On Hold", count: cases.filter((c) => c.status === "ON_HOLD").length },
    { status: "CLOSED", label: "Closed", count: cases.filter((c) => c.status === "CLOSED").length },
  ];

  const progressMeta: Record<
    string,
    { color: string; bg: string; border: string; icon: React.ReactNode }
  > = {
    NEW: {
      color: "text-blue-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
      icon: <Briefcase className="h-6 w-6 text-blue-400" />,
    },
    ACTIVE: {
      color: "text-green-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
      icon: <Flame className="h-6 w-6 text-green-400" />,
    },
    ON_HOLD: {
      color: "text-yellow-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
      icon: <PauseCircle className="h-6 w-6 text-yellow-400" />,
    },
    CLOSED: {
      color: "text-slate-400",
      bg: "bg-backgroundSecondary",
      border: "border-borderPrimary",
      icon: <CheckCircle2 className="h-6 w-6 text-slate-400" />,
    },
  };

  const statusBadge: Record<string, string> = {
    NEW: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/30",
    ON_HOLD: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    CLOSED: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
  };

  const sortedCases = [...cases].sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());

  if (loading && cases.length === 0) {
    // Relying on embedded skeleton layout
  }

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
          progressCounts.map(({ status, label, count }) => {
            const meta = progressMeta[status] || {
              color: "text-slate-400",
              bg: "bg-backgroundSecondary",
              border: "border-borderPrimary",
              icon: <Briefcase className="h-6 w-6 text-slate-400" />,
            };
            return (
              <div
                key={status}
                className={cn(
                  "rounded-xl border p-5 flex flex-col gap-3",
                  meta.bg,
                  meta.border
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-textSecondary">{label}</span>
                  {meta.icon}
                </div>
                <div className={cn("text-4xl font-bold", meta.color)}>{count}</div>
                <div className="text-xs text-textSecondary">
                  {count === 1 ? "1 case" : `${count} cases`}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Priority / Recent Cases Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
          <h2 className="text-base font-semibold text-textPrimary">Assigned Cases</h2>
          <a
            href="/officer/cases"
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
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Ref Number</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Title</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Type</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Assigned Date</th>
                <th className="text-left px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Exposure</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-borderPrimary animate-pulse">
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-12 bg-hoverPrimary rounded"></div></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-20 bg-hoverPrimary rounded"></div></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-32 bg-hoverPrimary rounded"></div></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-24 bg-hoverPrimary rounded"></div></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-6 w-20 bg-hoverPrimary rounded-full"></div></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-24 bg-hoverPrimary rounded"></div></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-16 bg-hoverPrimary rounded"></div></td>
                  </tr>
                ))
              ) : sortedCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-textSecondary">
                    No cases assigned.
                  </td>
                </tr>
              ) : (
                sortedCases.slice(0, 6).map((c, i) => (
                  <tr
                    key={c.id}
                    className={cn(
                      "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                      i === Math.min(sortedCases.length, 6) - 1 && "border-none"
                    )}
                  >
                    <td className="px-4 sm:px-6 py-4 font-mono text-xs text-primary font-semibold whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-textSecondary font-mono text-xs whitespace-nowrap">
                      {c.referenceNumber || "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-textPrimary font-medium min-w-[150px] truncate">
                      {c.caseTitle}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-textSecondary whitespace-nowrap">{c.caseType}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                          statusBadge[c.status] || "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                        )}
                      >
                        {c.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs whitespace-nowrap">
                      {c.assignedAt ? new Date(c.assignedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) : "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-textSecondary text-xs font-mono whitespace-nowrap">
                      {c.financialExposure ? `$${c.financialExposure.toLocaleString()}` : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Strip */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
          <h2 className="text-base font-semibold text-textPrimary">Recent Activity</h2>
          <a
            href="/officer/activity"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </a>
        </div>
        <ul className="divide-y divide-borderPrimary">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-start gap-4 px-4 sm:px-6 py-4 animate-pulse">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-hoverPrimary shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-3/4 bg-hoverPrimary rounded"></div>
                  <div className="h-3 w-1/4 bg-hoverPrimary rounded"></div>
                </div>
              </li>
            ))
          ) : cases
            .flatMap((c) =>
              (c.comments || []).map((cm) => ({
                caseId: c.id,
                caseTitle: c.caseTitle,
                action: `Comment by ${cm.commentedByName}`,
                note: cm.comment,
                date: cm.commentedAt,
              }))
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6)
            .map((a, i) => (
              <li key={i} className="flex items-start gap-4 px-4 sm:px-6 py-4">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-textPrimary">
                    <span className="font-mono text-xs text-primary font-semibold mr-2">
                      #{a.caseId}
                    </span>
                    {a.action}
                    {a.note && (
                      <span className="text-textSecondary ml-1">— {a.note}</span>
                    )}
                  </p>
                  <p className="text-xs text-textSecondary mt-0.5">
                    {a.date ? new Date(a.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : ""}
                  </p>
                </div>
              </li>
            ))}
          {!loading && cases.flatMap(c => c.comments || []).length === 0 && (
            <li className="px-4 sm:px-6 py-4 text-sm text-textSecondary text-center">
              No recent activities found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
