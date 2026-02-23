"use client";

import React, { useState } from "react";
import {
  FilePlus2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Users,
  Lightbulb,
  ShieldAlert,
  Gavel,
  HelpCircle,
} from "lucide-react";
import Input from "@/_components/common/inputs/Input";
import Select from "@/_components/common/inputs/Select";
import { cn } from "@/lib/utils";

/* ── Case types ── */
type CaseType =
  | ""
  | "MONEY_RECOVERY"
  | "DAMAGES_RECOVERY"
  | "APPEALS"
  | "LAND"
  | "CRIMINAL"
  | "INQUIRIES"
  | "OTHER";

const CASE_TYPES: { value: CaseType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "MONEY_RECOVERY", label: "Money Recovery", icon: <Briefcase className="h-5 w-5" />, description: "Debt collection, unpaid invoices" },
  { value: "DAMAGES_RECOVERY", label: "Damages Recovery", icon: <ShieldAlert className="h-5 w-5" />, description: "Compensation, property damage claims" },
  { value: "APPEALS", label: "Appeals", icon: <Gavel className="h-5 w-5" />, description: "Appeals against court decisions" },
  { value: "LAND", label: "Land", icon: <Briefcase className="h-5 w-5" />, description: "Property disputes, ownership" },
  { value: "CRIMINAL", label: "Criminal", icon: <Gavel className="h-5 w-5" />, description: "Criminal offenses, fraud" },
  { value: "INQUIRIES", label: "Inquiries", icon: <Users className="h-5 w-5" />, description: "Internal or external inquiries" },
  { value: "OTHER", label: "Other", icon: <HelpCircle className="h-5 w-5" />, description: "Any other legal matter" },
];

/* ── Shared form state ── */
interface CaseFormData {
  caseTitle: string;
  referenceNumber: string;
  partiesInvolved: string;
  natureOfCase: string;
  dateOfOccurrenceOrFiling: string;
  courtOrAuthority: string;
  financialExposure: string;
  summaryOfFacts: string;
  attachments: File | null;
}

const defaultForm: CaseFormData = {
  caseTitle: "",
  referenceNumber: "",
  partiesInvolved: "",
  natureOfCase: "",
  dateOfOccurrenceOrFiling: "",
  courtOrAuthority: "",
  financialExposure: "",
  summaryOfFacts: "",
  attachments: null,
};

/* ── Field wrapper ── */
const FieldGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const FullRow = ({ children }: { children: React.ReactNode }) => (
  <div className="sm:col-span-2">{children}</div>
);

/* ── Step indicator ── */
const StepDot = ({ step, current, label }: { step: number; current: number; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={cn(
      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
      step < current ? "bg-blue-500 border-blue-500 text-white"
        : step === current ? "border-blue-500 text-blue-500 bg-backgroundSecondary"
          : "border-borderPrimary text-textSecondary bg-backgroundSecondary"
    )}>
      {step < current ? <CheckCircle2 className="h-4 w-4" /> : step}
    </div>
    <span className={cn("text-xs hidden sm:block", step === current ? "text-blue-500 font-medium" : "text-textSecondary")}>{label}</span>
  </div>
);

const StepLine = ({ done }: { done: boolean }) => (
  <div className={cn("flex-1 h-0.5 mt-4 transition-colors", done ? "bg-blue-500" : "bg-borderPrimary")} />
);

import axiosInstance, { API_PATHS } from "@/lib/axios";

export default function CreateCasePage() {
  const [step, setStep] = useState(1); // 1: Type, 2: Details, 3: Review
  const [caseType, setCaseType] = useState<CaseType>("");
  const [form, setForm] = useState<CaseFormData>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setF = (k: keyof CaseFormData) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((p) => ({ ...p, attachments: e.target.files![0] }));
    } else {
      setForm((p) => ({ ...p, attachments: null }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const dataPayload = {
        caseTitle: form.caseTitle,
        caseType: caseType,
        referenceNumber: form.referenceNumber,
        partiesInvolved: form.partiesInvolved,
        natureOfCase: form.natureOfCase,
        dateOfOccurrenceOrFiling: form.dateOfOccurrenceOrFiling,
        courtOrAuthority: form.courtOrAuthority,
        financialExposure: form.financialExposure ? parseFloat(form.financialExposure) : 0,
        summaryOfFacts: form.summaryOfFacts,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(dataPayload));

      if (form.attachments) {
        formData.append("attachments", form.attachments);
      }

      await axiosInstance.post(API_PATHS.SUPERVISOR.CREATE_CASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to create case", err);
      setErrorMsg(err?.response?.data?.message || "An error occurred while creating the case.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Helper missing in new setup ── */

  /* ── Review rows ── */
  const ReviewRow = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div className="flex gap-3 py-2 border-b border-borderPrimary last:border-0">
        <span className="text-xs text-textSecondary w-44 shrink-0">{label}</span>
        <span className="text-sm text-textPrimary font-medium">{value || "—"}</span>
      </div>
    ) : null;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-textPrimary">Case Submitted!</h2>
        <p className="text-sm text-textSecondary text-center max-w-sm">
          Your case has been submitted successfully. A legal officer will review and follow up shortly.
        </p>
        <button
          onClick={() => { setStep(1); setCaseType(""); setForm(defaultForm); setSubmitted(false); }}
          className="mt-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Submit Another Case
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <FilePlus2 className="h-6 w-6 text-blue-500" /> Create a New Case
        </h1>
        <p className="text-sm text-textSecondary mt-1">
          Fill in the details below to submit your legal case
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        <StepDot step={1} current={step} label="Case Type" />
        <StepLine done={step > 1} />
        <StepDot step={2} current={step} label="Details" />
        <StepLine done={step > 2} />
        <StepDot step={3} current={step} label="Review" />
      </div>

      {/* ── STEP 1: Pick case type ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-textPrimary">Select the type of legal case</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CASE_TYPES.map(({ value, label, icon, description }) => (
              <button
                key={value}
                onClick={() => setCaseType(value)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all",
                  caseType === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                    : "border-borderPrimary bg-backgroundSecondary hover:border-blue-300 hover:bg-hoverPrimary"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl shrink-0 mt-0.5",
                  caseType === value ? "bg-blue-500 text-white" : "bg-hoverPrimary text-textSecondary"
                )}>
                  {icon}
                </div>
                <div>
                  <p className={cn("font-semibold text-sm", caseType === value ? "text-blue-600 dark:text-blue-400" : "text-textPrimary")}>{label}</p>
                  <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">{description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-2">
            <button
              disabled={!caseType}
              onClick={() => setStep(2)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                caseType
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-borderPrimary text-textSecondary cursor-not-allowed"
              )}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Case details ── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          {/* Type badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
              {caseType}
            </span>
            <button onClick={() => setStep(1)} className="text-xs text-textSecondary hover:text-textPrimary underline">
              Change type
            </button>
          </div>

          {/* Base fields */}
          <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="text-sm font-semibold text-textPrimary border-b border-borderPrimary pb-3">General Information</h3>
            <FieldGrid>
              <Input label="Reference Number *" placeholder="e.g. REF-2292" value={form.referenceNumber} onChange={e => setF("referenceNumber")(e.target.value)} />
              <Input label="Case Title *" placeholder="Brief title describing the issue" value={form.caseTitle} onChange={e => setF("caseTitle")(e.target.value)} />
              <Input label="Parties Involved *" placeholder="e.g. Party A vs Party B" value={form.partiesInvolved} onChange={e => setF("partiesInvolved")(e.target.value)} />
              <Input label="Nature of Case *" placeholder="e.g. Property Dispute" value={form.natureOfCase} onChange={e => setF("natureOfCase")(e.target.value)} />
              <Input label="Date of Filing/Occurrence *" type="date" value={form.dateOfOccurrenceOrFiling} onChange={e => setF("dateOfOccurrenceOrFiling")(e.target.value)} />
              <Input label="Court or Authority *" placeholder="e.g. High Court" value={form.courtOrAuthority} onChange={e => setF("courtOrAuthority")(e.target.value)} />
              <Input label="Financial Exposure (LKR)" type="number" placeholder="0.00" value={form.financialExposure} onChange={e => setF("financialExposure")(e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-textPrimary">Attachments</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </FieldGrid>
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">Summary of Facts *</label>
              <textarea
                rows={4}
                placeholder="Provide a detailed summary outlining the core arguments..."
                value={form.summaryOfFacts}
                onChange={e => setF("summaryOfFacts")(e.target.value)}
                className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-borderPrimary text-textSecondary hover:bg-hoverPrimary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              disabled={!form.caseTitle || !form.referenceNumber || !form.summaryOfFacts}
              onClick={() => setStep(3)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                form.caseTitle && form.referenceNumber && form.summaryOfFacts
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-borderPrimary text-textSecondary cursor-not-allowed"
              )}
            >
              Review <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Submit ── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col shadow-sm">
            <h3 className="text-sm font-semibold text-textPrimary border-b border-borderPrimary pb-3 mb-2">Review your submission</h3>
            <ReviewRow label="Case Type" value={CASE_TYPES.find(c => c.value === caseType)?.label || caseType} />
            <ReviewRow label="Title" value={form.caseTitle} />
            <ReviewRow label="Reference No" value={form.referenceNumber} />
            <ReviewRow label="Parties Involved" value={form.partiesInvolved} />
            <ReviewRow label="Nature of Case" value={form.natureOfCase} />
            <ReviewRow label="Date" value={form.dateOfOccurrenceOrFiling} />
            <ReviewRow label="Court/Authority" value={form.courtOrAuthority} />
            <ReviewRow label="Financial Exp. (LKR)" value={form.financialExposure} />
            <ReviewRow label="Summary" value={form.summaryOfFacts} />
            {form.attachments && <ReviewRow label="Attachments" value={form.attachments.name} />}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-600 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-between mt-2">
            <button
              onClick={() => setStep(2)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-borderPrimary text-textSecondary hover:bg-hoverPrimary transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Submit Case
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
