"use client";

import React from "react";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Monthly summary table data ── */
const monthlySummary = [
  { month: "Aug 2025", newCases: 8, closedCases: 6, agreements: 5, exposure: "LKR 4.2M", resolved: "LKR 2.1M" },
  { month: "Sep 2025", newCases: 11, closedCases: 9, agreements: 7, exposure: "LKR 5.8M", resolved: "LKR 3.2M" },
  { month: "Oct 2025", newCases: 7, closedCases: 8, agreements: 4, exposure: "LKR 3.9M", resolved: "LKR 2.8M" },
  { month: "Nov 2025", newCases: 14, closedCases: 10, agreements: 9, exposure: "LKR 7.1M", resolved: "LKR 4.0M" },
  { month: "Dec 2025", newCases: 12, closedCases: 14, agreements: 6, exposure: "LKR 6.4M", resolved: "LKR 5.1M" },
  { month: "Jan 2026", newCases: 16, closedCases: 11, agreements: 8, exposure: "LKR 8.3M", resolved: "LKR 3.9M" },
  { month: "Feb 2026", newCases: 9, closedCases: 21, agreements: 5, exposure: "LKR 9.1M", resolved: "LKR 5.6M" },
];

/* ── KPI summary cards ── */
const kpis = [
  { label: "Avg Case Resolution Time", value: "34 days", trend: "-5 days vs last quarter", up: true },
  { label: "Case Closure Rate", value: "68%", trend: "+8% vs last quarter", up: true },
  { label: "Agreement Approval Rate", value: "79%", trend: "-3% vs last quarter", up: false },
  { label: "Total Legal Spend YTD", value: "LKR 44.8M", trend: "+12% vs last year", up: false },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Reports</h1>
          <p className="text-sm text-textSecondary mt-1">
            Monthly legal performance summary and KPIs
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-borderPrimary text-sm text-textPrimary hover:bg-hoverPrimary transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, trend, up }) => (
          <div
            key={label}
            className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-3 shadow-sm"
          >
            <span className="text-xs text-textSecondary font-medium">{label}</span>
            <div>
              <span className="text-2xl font-bold text-textPrimary">{value}</span>
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs mt-1",
                  up ? "text-green-500" : "text-red-400"
                )}
              >
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly summary table */}
      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
        <div className="px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-base font-semibold text-textPrimary">Monthly Summary</h2>
          <p className="text-xs text-textSecondary mt-0.5">Last 7 months of legal activity</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borderPrimary">
              {["Month", "New Cases", "Closed Cases", "Agreements", "Total Exposure", "Resolved Value"].map((h) => (
                <th key={h} className="text-left px-4 sm:px-6 py-3.5 text-textSecondary font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlySummary.map((row, i) => (
              <tr
                key={row.month}
                className={cn(
                  "border-b border-borderPrimary last:border-0 transition-colors hover:bg-hoverPrimary",
                  i === monthlySummary.length - 1 ? "font-semibold" : ""
                )}
              >
                <td className="px-4 sm:px-6 py-4 text-textPrimary whitespace-nowrap">{row.month}</td>
                <td className="px-4 sm:px-6 py-4 text-textPrimary">{row.newCases}</td>
                <td className="px-4 sm:px-6 py-4 text-textPrimary">{row.closedCases}</td>
                <td className="px-4 sm:px-6 py-4 text-textPrimary">{row.agreements}</td>
                <td className="px-4 sm:px-6 py-4 text-textPrimary whitespace-nowrap">{row.exposure}</td>
                <td className="px-4 sm:px-6 py-4 text-green-600 dark:text-green-400 whitespace-nowrap">{row.resolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
