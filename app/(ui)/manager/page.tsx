"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileCheck2,
  FileClock,
  FileX2,
  Users,
} from "lucide-react";
import axiosInstance, { API_PATHS } from "@/lib/axios";

/** Simple classnames helper to replace missing '@/lib/utils' */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const casesByType = [
  { type: "Contract Dispute", count: 18, color: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
  { type: "Employment", count: 12, color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" },
  { type: "IP & Patents", count: 9, color: "bg-yellow-500", light: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400" },
  { type: "Regulatory", count: 14, color: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400" },
  { type: "Litigation", count: 7, color: "bg-red-500", light: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
];

/* Case aging buckets */
const agingData = [
  { label: "0–7 days", count: 12, color: "bg-green-500" },
  { label: "8–30 days", count: 21, color: "bg-yellow-500" },
  { label: "31–90 days", count: 15, color: "bg-orange-500" },
  { label: "90+ days", count: 8, color: "bg-red-500" },
];

const totalAging = agingData.reduce((s, a) => s + a.count, 0);

// Workload per officer is now fetched dynamically

/* Financial exposure — monthly data for bar + line chart */
const financialMonths = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const exposureData = [4.2, 5.8, 3.9, 7.1, 6.4, 8.3, 9.1]; // LKR millions
const resolvedData = [2.1, 3.2, 2.8, 4.0, 5.1, 3.9, 5.6];

const maxExposure = Math.max(...exposureData);

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */

const StatCard = ({
  title,
  value,
  sub,
  icon,
  iconBg,
  trend,
  trendUp,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
}) => (
  <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-3 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-sm text-textSecondary font-medium">{title}</span>
      <div className={cn("p-2 rounded-xl", iconBg)}>{icon}</div>
    </div>
    <div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-textPrimary">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs mb-1 flex items-center gap-0.5 font-medium",
              trendUp ? "text-green-500" : "text-red-400"
            )}
          >
            {trendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-textSecondary mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ── SVG Bar+Line combo chart ── */
const FinancialChart = ({
  activeTab,
}: {
  activeTab: "bar" | "line";
}) => {
  const W = 560;
  const H = 200;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barCount = financialMonths.length;
  const groupW = chartW / barCount;
  const barW = groupW * 0.35;

  const yScale = (v: number) => chartH - (v / (maxExposure * 1.15)) * chartH;

  /* Y grid lines */
  const yTicks = [0, 2, 4, 6, 8, 10].filter((t) => t <= maxExposure * 1.15 + 1);

  /* Line path helper */
  const linePath = (data: number[], offset = 0) =>
    data
      .map((v, i) => {
        const x = padL + i * groupW + groupW / 2 + offset;
        const y = padT + yScale(v);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
    >
      {/* Y grid */}
      {yTicks.map((t) => {
        const y = padT + yScale(t);
        return (
          <g key={t}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={y + 4}
              textAnchor="end"
              fontSize={9}
              fill="currentColor"
              fillOpacity={0.45}
            >
              {t}M
            </text>
          </g>
        );
      })}

      {activeTab === "bar" ? (
        /* ── BAR CHART ── */
        financialMonths.map((m, i) => {
          const x = padL + i * groupW;
          const exposureH = (exposureData[i] / (maxExposure * 1.15)) * chartH;
          const resolvedH = (resolvedData[i] / (maxExposure * 1.15)) * chartH;
          return (
            <g key={m}>
              {/* Exposure bar */}
              <rect
                x={x + groupW / 2 - barW - 2}
                y={padT + chartH - exposureH}
                width={barW}
                height={exposureH}
                rx={3}
                className="fill-blue-500"
                fillOpacity={0.85}
              />
              {/* Resolved bar */}
              <rect
                x={x + groupW / 2 + 2}
                y={padT + chartH - resolvedH}
                width={barW}
                height={resolvedH}
                rx={3}
                className="fill-green-500"
                fillOpacity={0.75}
              />
              {/* X label */}
              <text
                x={x + groupW / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                fillOpacity={0.5}
              >
                {m}
              </text>
            </g>
          );
        })
      ) : (
        /* ── LINE CHART ── */
        <>
          {/* Area fills */}
          <path
            d={`${linePath(exposureData)} L ${padL + (barCount - 1) * groupW + groupW / 2} ${padT + chartH} L ${padL + groupW / 2} ${padT + chartH} Z`}
            className="fill-blue-500"
            fillOpacity={0.1}
          />
          <path
            d={`${linePath(resolvedData)} L ${padL + (barCount - 1) * groupW + groupW / 2} ${padT + chartH} L ${padL + groupW / 2} ${padT + chartH} Z`}
            className="fill-green-500"
            fillOpacity={0.1}
          />
          {/* Lines */}
          <path
            d={linePath(exposureData)}
            fill="none"
            className="stroke-blue-500"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={linePath(resolvedData)}
            fill="none"
            className="stroke-green-500"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Dots */}
          {exposureData.map((v, i) => (
            <circle
              key={`e${i}`}
              cx={padL + i * groupW + groupW / 2}
              cy={padT + yScale(v)}
              r={3.5}
              className="fill-blue-500"
            />
          ))}
          {resolvedData.map((v, i) => (
            <circle
              key={`r${i}`}
              cx={padL + i * groupW + groupW / 2}
              cy={padT + yScale(v)}
              r={3.5}
              className="fill-green-500"
            />
          ))}
          {/* X labels */}
          {financialMonths.map((m, i) => (
            <text
              key={m}
              x={padL + i * groupW + groupW / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              fillOpacity={0.5}
            >
              {m}
            </text>
          ))}
        </>
      )}
    </svg>
  );
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function ManagementDashboard() {
  const [chartTab, setChartTab] = useState<"bar" | "line">("bar");

  const [caseCounts, setCaseCounts] = useState({ NEW: 0, ACTIVE: 0, ON_HOLD: 0, CLOSED: 0 });
  const [agreementCounts, setAgreementCounts] = useState({
    DRAFT: 0,
    REVIEW_REQUESTED: 0,
    PENDING_APPROVAL: 0,
    APPROVED: 0,
    REJECTED: 0,
    EXECUTED: 0,
    EXPIRED: 0,
    ARCHIVED: 0
  });
  const [workloadData, setWorkloadData] = useState<{ name: string; cases: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxWorkload = workloadData.length > 0 ? Math.max(...workloadData.map((w) => w.cases)) : 1;

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const [caseRes, agreementRes, assigneesRes] = await Promise.all([
          axiosInstance.get(API_PATHS.MANAGEMENT.GET_CASE_COUNT),
          axiosInstance.get(API_PATHS.MANAGEMENT.GET_AGREEMENT_COUNT),
          axiosInstance.get(API_PATHS.MANAGEMENT.GET_ASSINED_CASES_COUNT)
        ]);

        if (caseRes.data) {
          setCaseCounts({
            NEW: caseRes.data.NEW || 0,
            ACTIVE: caseRes.data.ACTIVE || 0,
            ON_HOLD: caseRes.data.ON_HOLD || 0,
            CLOSED: caseRes.data.CLOSED || 0
          });
        }

        if (agreementRes.data) {
          setAgreementCounts({
            DRAFT: agreementRes.data.DRAFT || 0,
            REVIEW_REQUESTED: agreementRes.data.REVIEW_REQUESTED || 0,
            PENDING_APPROVAL: agreementRes.data.PENDING_APPROVAL || 0,
            APPROVED: agreementRes.data.APPROVED || 0,
            REJECTED: agreementRes.data.REJECTED || 0,
            EXECUTED: agreementRes.data.EXECUTED || 0,
            EXPIRED: agreementRes.data.EXPIRED || 0,
            ARCHIVED: agreementRes.data.ARCHIVED || 0
          });
        }

        if (assigneesRes.data) {
          const workloadArray = Object.entries(assigneesRes.data).map(([name, cases]) => ({
            name,
            cases: Number(cases)
          }));
          setWorkloadData(workloadArray);
        }
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const casesByStatus = [
    { status: "New", count: caseCounts.NEW, color: "bg-blue-500" },
    { status: "Active", count: caseCounts.ACTIVE, color: "bg-yellow-500" },
    { status: "On Hold", count: caseCounts.ON_HOLD, color: "bg-orange-500" },
    { status: "Closed", count: caseCounts.CLOSED, color: "bg-green-500" },
  ];

  const totalCaseStatus = casesByStatus.reduce((s, c) => s + c.count, 0) || 1;

  const agreementSummary = [
    { label: "Draft", count: agreementCounts.DRAFT, icon: FileClock, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-900/20" },
    { label: "Review Requested", count: agreementCounts.REVIEW_REQUESTED, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Pending Approval", count: agreementCounts.PENDING_APPROVAL, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Approved", count: agreementCounts.APPROVED, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Rejected", count: agreementCounts.REJECTED, icon: FileX2, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Executed", count: agreementCounts.EXECUTED, icon: FileCheck2, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Expired", count: agreementCounts.EXPIRED, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Archived", count: agreementCounts.ARCHIVED, icon: Briefcase, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/20" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary mb-1">
          Management / Executive
        </p>
        <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
        <p className="text-sm text-textSecondary mt-1">
          Executive overview — cases, agreements & financial exposure
        </p>
      </div>

      {/* ── Top KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Cases"
          value={caseCounts.ACTIVE + caseCounts.NEW}
          sub="Across all departments"
          icon={<Briefcase className="h-4 w-4 text-white" />}
          iconBg="bg-blue-500"
          trend="+5 vs last month"
          trendUp
        />
        <StatCard
          title="Pending Agreements"
          value={agreementCounts.PENDING_APPROVAL}
          sub="Awaiting review or approval"
          icon={<FileClock className="h-4 w-4 text-white" />}
          iconBg="bg-yellow-500"
          trend="-3 vs last week"
          trendUp={false}
        />
        <StatCard
          title="Escalated Cases"
          value={5}
          sub="Requires executive attention"
          icon={<AlertCircle className="h-4 w-4 text-white" />}
          iconBg="bg-red-500"
        />
        <StatCard
          title="Closed This Month"
          value={caseCounts.CLOSED}
          sub="Successfully resolved"
          icon={<CheckCircle2 className="h-4 w-4 text-white" />}
          iconBg="bg-green-500"
          trend="+8 vs last month"
          trendUp
        />
      </div>

      {/* ── Row 1: Cases by Type + Cases by Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cases by Type */}
        <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
          <h2 className="text-base font-semibold text-textPrimary mb-5">
            Active Cases by Type
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {casesByType.map((item) => {
              const total = casesByType.reduce((s, c) => s + c.count, 0);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.type} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 w-36",
                      item.light,
                      item.text
                    )}
                  >
                    {item.type}
                  </span>
                  <div className="flex-1 bg-borderPrimary rounded-full h-2 overflow-hidden">
                    <div
                      className={cn("h-2 rounded-full", item.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-textPrimary w-7 text-right shrink-0">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cases by Status */}
        <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
          <h2 className="text-base font-semibold text-textPrimary mb-5">
            Cases by Status
          </h2>
          {/* Segmented bar */}
          <div className="flex rounded-full overflow-hidden h-3 mb-5">
            {casesByStatus.map((s) => (
              <div
                key={s.status}
                className={cn(s.color)}
                style={{ width: `${(s.count / totalCaseStatus) * 100}%` }}
                title={`${s.status}: ${s.count}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {casesByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", s.color)} />
                  <span className="text-sm text-textSecondary">{s.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-borderPrimary rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn("h-1.5 rounded-full", s.color)}
                      style={{ width: `${(s.count / totalCaseStatus) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-textPrimary w-7 text-right">
                    {s.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Case Aging + Workload ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Case Aging */}
        <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-textSecondary" />
            <h2 className="text-base font-semibold text-textPrimary">Case Aging</h2>
          </div>
          <p className="text-xs text-textSecondary mb-5">
            Open cases by time in queue
          </p>
          <div className="flex flex-col gap-4">
            {agingData.map((a) => {
              const pct = Math.round((a.count / totalAging) * 100);
              return (
                <div key={a.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-textSecondary">{a.label}</span>
                    <span className="text-xs font-semibold text-textPrimary">
                      {a.count} cases ({pct}%)
                    </span>
                  </div>
                  <div className="bg-borderPrimary rounded-full h-3 overflow-hidden">
                    <div
                      className={cn("h-3 rounded-full transition-all", a.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workload Report */}
        <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-textSecondary" />
            <h2 className="text-base font-semibold text-textPrimary">
              Officer Workload
            </h2>
          </div>
          <p className="text-xs text-textSecondary mb-5">
            Open cases assigned per legal officer
          </p>
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex flex-col gap-4 py-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="h-7 w-7 rounded-full bg-borderPrimary shrink-0" />
                    <div className="h-4 w-16 bg-borderPrimary rounded shrink-0" />
                    <div className="flex-1 bg-borderPrimary rounded-full h-2" />
                    <div className="h-4 w-6 bg-borderPrimary rounded shrink-0" />
                  </div>
                ))}
              </div>
            ) : workloadData.length > 0 ? (
              workloadData
                .sort((a, b) => b.cases - a.cases)
                .map((w) => {
                  const pct = (w.cases / maxWorkload) * 100;
                  const heat =
                    w.cases >= 14
                      ? "bg-red-500"
                      : w.cases >= 10
                        ? "bg-orange-500"
                        : w.cases >= 7
                          ? "bg-yellow-500"
                          : "bg-green-500";
                  return (
                    <div key={w.name} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-blue-500">
                          {w.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-textSecondary w-16 shrink-0 truncate">
                        {w.name}
                      </span>
                      <div className="flex-1 bg-borderPrimary rounded-full h-2 overflow-hidden">
                        <div
                          className={cn("h-2 rounded-full", heat)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-textPrimary w-6 text-right shrink-0">
                        {w.cases}
                      </span>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-textSecondary text-center py-4">No officers assigned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Agreement Approval Status Summary ── */}
      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
        <h2 className="text-base font-semibold text-textPrimary mb-5">
          Agreement Approval Status Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {agreementSummary.map(({ label, count, icon: Icon, color, bg }) => (
            <div
              key={label}
              className={cn(
                "rounded-xl p-4 flex flex-col gap-2 border border-borderPrimary",
                bg
              )}
            >
              <div className={cn("flex items-center gap-2", color)}>
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{label}</span>
              </div>
              <span className="text-3xl font-bold text-textPrimary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Financial Exposure Chart ── */}
      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-textPrimary">
              Financial Exposure Overview
            </h2>
            <p className="text-xs text-textSecondary mt-0.5">
              Total legal financial exposure vs. resolved value (LKR millions)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart type toggle */}
            <div className="flex rounded-xl border border-borderPrimary overflow-hidden text-xs">
              <button
                onClick={() => setChartTab("bar")}
                className={cn(
                  "px-3 py-1.5 font-medium transition-colors",
                  chartTab === "bar"
                    ? "bg-blue-500 text-white"
                    : "text-textSecondary hover:bg-hoverPrimary"
                )}
              >
                Bar
              </button>
              <button
                onClick={() => setChartTab("line")}
                className={cn(
                  "px-3 py-1.5 font-medium transition-colors",
                  chartTab === "line"
                    ? "bg-blue-500 text-white"
                    : "text-textSecondary hover:bg-hoverPrimary"
                )}
              >
                Line
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-textSecondary">Total Exposure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-xs text-textSecondary">Resolved Value</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <FinancialChart activeTab={chartTab} />
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-borderPrimary">
          <div>
            <p className="text-xs text-textSecondary">Total Exposure (Feb)</p>
            <p className="text-xl font-bold text-textPrimary mt-0.5">
              LKR 9.1M
            </p>
            <span className="text-xs text-red-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3 w-3" /> +9.6% MoM
            </span>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Resolved Value (Feb)</p>
            <p className="text-xl font-bold text-textPrimary mt-0.5">
              LKR 5.6M
            </p>
            <span className="text-xs text-green-500 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3 w-3" /> +43.6% MoM
            </span>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Net Open Exposure</p>
            <p className="text-xl font-bold text-textPrimary mt-0.5">
              LKR 3.5M
            </p>
            <span className="text-xs text-textSecondary mt-0.5 block">
              Unresolved as of Feb 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
