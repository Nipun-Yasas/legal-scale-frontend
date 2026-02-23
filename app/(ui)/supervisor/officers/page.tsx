"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import {
  Search,
  X,
  UserPlus,
  ChevronDown,
  Mail,
  AlertCircle,
} from "lucide-react";

export interface ApiOfficer {
  officerDetails: {
    id: number;
    fullName: string;
    email: string;
    roleId: number;
    roleName: string;
    legalDepartmentMember: boolean;
    banned: boolean;
  };
  totalAssignedCases: number;
  caseCountsByStatus: Record<string, number>;
}

export interface NewCase {
  id: number;
  caseTitle: string;
  referenceNumber: string;
}

/* ── Assign Modal ── */
function AssignModal({
  officer,
  onClose,
  onSuccess,
}: {
  officer: ApiOfficer;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedCase, setSelectedCase] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [newCases, setNewCases] = useState<NewCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchNewCases = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SUPERVISOR.GET_ALL_NEW_CASES);
        let fetchedCases = [];
        if (Array.isArray(response.data)) {
          fetchedCases = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          fetchedCases = response.data.data;
        }
        setNewCases(fetchedCases);
      } catch (error) {
        console.error("Failed to fetch new cases", error);
      } finally {
        setLoadingCases(false);
      }
    };
    fetchNewCases();
  }, []);

  async function handleAssign() {
    if (!selectedCase) return;
    setAssigning(true);
    try {
      await axiosInstance.post(API_PATHS.SUPERVISOR.ASSIGN_CASE(selectedCase), {
        officerId: officer.officerDetails.id,
      });

      if (note.trim()) {
        await axiosInstance.post(API_PATHS.SUPERVISOR.ADD_COMMENT(selectedCase), {
          comment: note.trim(),
        });
      }

      setDone(true);
      onSuccess();
    } catch (error) {
      console.error("Failed to assign case or add comment", error);
    } finally {
      setAssigning(false);
    }
  }

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
            <h2 className="text-lg font-bold text-textPrimary">Assign Case</h2>
            <p className="text-sm text-textSecondary mt-0.5">
              Assign a case to{" "}
              <span className="text-textPrimary font-medium">{officer.officerDetails.fullName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-green-500/15 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-textPrimary font-semibold">Case Assigned Successfully</p>
            <p className="text-sm text-textSecondary">
              {newCases.find((c) => c.id.toString() === selectedCase)?.caseTitle} has been assigned to{" "}
              {officer.officerDetails.fullName}.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Officer info */}
            <div className="flex items-center gap-3 rounded-lg border border-borderPrimary bg-hoverPrimary px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0 uppercase">
                {officer.officerDetails.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-textPrimary">{officer.officerDetails.fullName}</p>
                <p className="text-xs text-textSecondary">
                  {officer.totalAssignedCases} active case{officer.totalAssignedCases !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Warning if busy */}
            {officer.totalAssignedCases >= 4 && (
              <div className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2">
                <AlertCircle className="h-4 w-4 text-orange-400 shrink-0" />
                <p className="text-xs text-orange-400">
                  This officer already has {officer.totalAssignedCases} assigned cases.
                </p>
              </div>
            )}

            {/* Case select */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-textPrimary">Select Case</label>
              <div className="relative">
                <select
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  disabled={loadingCases}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                >
                  <option value="">
                    {loadingCases ? "Loading cases..." : "— Choose unassigned case —"}
                  </option>
                  {newCases.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.referenceNumber} — {c.caseTitle}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-textPrimary">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Add any instructions or context..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-borderPrimary text-sm text-textSecondary hover:bg-hoverPrimary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedCase || assigning}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {assigning ? "Assigning..." : "Assign Case"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function OfficersPage() {
  const [search, setSearch] = useState("");
  const [officers, setOfficers] = useState<ApiOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignTarget, setAssignTarget] = useState<ApiOfficer | null>(null);

  const fetchOfficers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SUPERVISOR.GET_LEGAL_OFFICERS);
      let fetchedOfficers = [];
      if (Array.isArray(response.data)) {
        fetchedOfficers = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        fetchedOfficers = response.data.data;
      }
      setOfficers(fetchedOfficers);
    } catch (error) {
      console.error("Failed to fetch officers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const filtered = useMemo(() => {
    return officers.filter((o) => {
      const q = search.toLowerCase();
      return (
        !q ||
        o.officerDetails.fullName.toLowerCase().includes(q) ||
        o.officerDetails.email.toLowerCase().includes(q)
      );
    });
  }, [search, officers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Legal Officers</h1>
        <p className="text-textSecondary text-sm mt-1">
          Manage and assign cases
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email..."
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

      {/* Table */}
      <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary text-textSecondary bg-hoverPrimary/50">
                <th className="text-left px-6 py-3 font-medium">Officer</th>
                <th className="text-left px-6 py-3 font-medium">Total Assigned Cases</th>
                <th className="text-left px-6 py-3 font-medium text-blue-500">New Cases</th>
                <th className="text-left px-6 py-3 font-medium text-green-500">Active Cases</th>
                <th className="text-left px-6 py-3 font-medium text-orange-500">On Hold</th>
                <th className="text-left px-6 py-3 font-medium text-red-500">Closed Cases</th>
                <th className="text-left px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-textSecondary">
                    Loading officers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-textSecondary">
                    No officers match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => (
                  <tr
                    key={o.officerDetails.id}
                    className={cn(
                      "border-b border-borderPrimary hover:bg-hoverPrimary transition-colors",
                      i === filtered.length - 1 && "border-none"
                    )}
                  >
                    {/* Officer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                          {o.officerDetails.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-textPrimary font-medium">{o.officerDetails.fullName}</p>
                          <p className="text-xs text-textSecondary flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {o.officerDetails.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Total Assigned Cases */}
                    <td className="px-6 py-4">
                      <span className="font-semibold tabular-nums text-sm text-textPrimary">
                        {o.totalAssignedCases}
                      </span>
                    </td>
                    {/* New Cases */}
                    <td className="px-6 py-4">
                      <span className="font-medium tabular-nums text-sm text-textSecondary">
                        {o.caseCountsByStatus?.NEW || 0}
                      </span>
                    </td>
                    {/* Active Cases */}
                    <td className="px-6 py-4">
                      <span className="font-medium tabular-nums text-sm text-textSecondary">
                        {o.caseCountsByStatus?.ACTIVE || 0}
                      </span>
                    </td>
                    {/* On Hold */}
                    <td className="px-6 py-4">
                      <span className="font-medium tabular-nums text-sm text-textSecondary">
                        {o.caseCountsByStatus?.ON_HOLD || 0}
                      </span>
                    </td>
                    {/* Closed Cases */}
                    <td className="px-6 py-4">
                      <span className="font-medium tabular-nums text-sm text-textSecondary">
                        {o.caseCountsByStatus?.CLOSED || 0}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setAssignTarget(o)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/30 hover:bg-primary/20 transition-colors"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Assign Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textSecondary mt-2">
        Showing {filtered.length} of {officers.length} officers
      </p>

      {/* Assign modal */}
      {assignTarget && (
        <AssignModal
          officer={assignTarget}
          onClose={() => setAssignTarget(null)}
          onSuccess={fetchOfficers}
        />
      )}
    </div>
  );
}
