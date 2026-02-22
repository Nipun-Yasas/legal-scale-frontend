"use client";

import React from "react";
import { agreements } from "../_data/agreements";
import { Agreement, AgreementStatus } from "../_data/types";
import { cn } from "@/lib/utils";
import {
  Eye,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  AlertTriangle,
  XCircle,
} from "lucide-react";

/* ── badge map ── */
const statusBadge: Record<AgreementStatus, string> = {
  "Pending Review": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Under Review": "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  Reviewed: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
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

/* ── KPI data ── */
const kpis = [
  {
    label: "Pending Review",
    value: agreements.filter((a) => a.status === "Pending Review").length,
    icon: <Clock className="h-6 w-6 text-blue-400" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  {
    label: "Under Review",
    value: agreements.filter((a) => a.status === "Under Review").length,
    icon: <Eye className="h-6 w-6 text-orange-400" />,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    label: "Reviewed",
    value: agreements.filter((a) => a.status === "Reviewed").length,
    icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  {
    label: "Approved",
    value: agreements.filter((a) => a.status === "Approved").length,
    icon: <CheckCircle2 className="h-6 w-6 text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
];

/* ── Due-soon ── */
const today = new Date("2026-02-21");
const dueSoon = (agreements as Agreement[]).filter(
  (a) =>
    (a.status === "Pending Review" || a.status === "Under Review") &&
    (new Date(a.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7
);

/* ── Recent activity (last 5 comments across all agreements) ── */
const recentComments = agreements
  .flatMap((a) =>
    a.comments.map((c) => ({
      ...c,
      agrId: a.id,
      agrTitle: a.title,
    }))
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

export default function AgreementReviewerDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Reviewer Dashboard</h1>
        <p className="text-textSecondary text-sm mt-1">
          Review agreements, leave comments, and track approval progress.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={cn("rounded-xl border p-5 flex flex-col gap-3", k.bg, k.border)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-textSecondary">{k.label}</span>
              {k.icon}
            </div>
            <div className={cn("text-4xl font-bold", k.color)}>{k.value}</div>
            <div className="text-xs text-textSecondary">
              {k.value === 1 ? "1 agreement" : `${k.value} agreements`}
            </div>
          </div>
        ))}
      </div>

      {/* Due-soon alert */}
      {dueSoon.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400 font-medium">
            {dueSoon.length} agreement{dueSoon.length > 1 ? "s are" : " is"} due within 7 days:{" "}
            <span className="font-bold">{dueSoon.map((a) => a.id).join(", ")}</span>.{" "}
            <a href="/agreement_reviewer_dashboard/agreements" className="underline">
              Review now →
            </a>
          </p>
        </div>
      )}

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs action */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary flex items-center justify-between">
            <h2 className="text-base font-semibold text-textPrimary">Needs Action</h2>
            <a
              href="/agreement_reviewer_dashboard/agreements"
              className="text-xs text-primary hover:underline"
            >
              View all →
            </a>
          </div>
          <ul className="divide-y divide-borderPrimary">
            {(agreements as Agreement[])
              .filter(
                (a) => a.status === "Pending Review" || a.status === "Under Review"
              )
              .map((a) => (
                <li
                  key={a.id}
                  className="px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-primary font-bold">{a.id}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium border",
                            statusBadge[a.status]
                          )}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="text-sm text-textPrimary font-medium truncate">{a.title}</p>
                      <p className="text-xs text-textSecondary mt-0.5">
                        {a.counterparty} · Due {fmt(a.dueDate)}
                      </p>
                    </div>
                    <div className="text-xs text-textSecondary flex items-center gap-1 shrink-0">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {a.comments.length}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Recent comments */}
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary">
            <h2 className="text-base font-semibold text-textPrimary">Recent Comments</h2>
          </div>
          {recentComments.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-10">
              No comments yet.
            </p>
          ) : (
            <ul className="divide-y divide-borderPrimary">
              {recentComments.map((c) => (
                <li key={c.id} className="flex items-start gap-4 px-4 sm:px-6 py-4">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs text-primary font-bold">
                        {c.agrId}
                      </span>
                      {c.clause && (
                        <span className="text-xs bg-borderPrimary text-textSecondary px-1.5 py-0.5 rounded">
                          {c.clause}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-textPrimary line-clamp-2">{c.text}</p>
                    <p className="text-xs text-textSecondary mt-0.5">{fmt(c.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Reviewed & Approved summary */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-base font-semibold text-textPrimary">
            Reviewed &amp; Approved
          </h2>
        </div>
        <ul className="divide-y divide-borderPrimary">
          {(agreements as Agreement[])
            .filter((a) => a.status === "Approved" || a.status === "Reviewed")
            .map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-hoverPrimary transition-colors"
              >
                <div
                  className={cn(
                    "mt-1 h-2 w-2 rounded-full shrink-0",
                    a.status === "Approved" ? "bg-green-400" : "bg-purple-400"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-mono text-xs text-primary font-bold">{a.id}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        statusBadge[a.status]
                      )}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-textPrimary font-medium truncate">{a.title}</p>
                  <p className="text-xs text-textSecondary mt-0.5">
                    {a.counterparty}
                    {a.reviewedDate && ` · Completed ${fmt(a.reviewedDate)}`}
                  </p>
                </div>
                <div className="text-xs text-textSecondary flex items-center gap-1 shrink-0">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {a.comments.length}
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* Rejected */}
      {(agreements as Agreement[]).some((a) => a.status === "Rejected") && (
        <div className="rounded-xl border border-red-500/20 bg-backgroundSecondary overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-red-500/20 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <h2 className="text-base font-semibold text-textPrimary">Rejected</h2>
          </div>
          <ul className="divide-y divide-borderPrimary">
            {(agreements as Agreement[])
              .filter((a) => a.status === "Rejected")
              .map((a) => (
                <li key={a.id} className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-primary font-bold">{a.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", statusBadge[a.status])}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-textPrimary font-medium">{a.title}</p>
                  {a.comments.at(-1) && (
                    <p className="text-xs text-textSecondary mt-1 italic">
                      &ldquo;{a.comments.at(-1)!.text}&rdquo;
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
