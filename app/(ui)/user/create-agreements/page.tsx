"use client";

import React, { useState } from "react";
import {
  FilePlus2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  HandshakeIcon,
  ShieldCheck,
  Building2,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import Input from "@/_components/common/inputs/Input";
import { cn } from "@/lib/utils";
import axiosInstance, { API_PATHS } from "@/lib/axios";

type AgreementType =
  | ""
  | "NDA"
  | "SLA"
  | "EMPLOYMENT"
  | "VENDOR"
  | "LEASE"
  | "OTHER";

const AGREEMENT_TYPES: { value: AgreementType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "NDA", label: "Non-Disclosure", icon: <ShieldCheck className="h-5 w-5" />, description: "Protect confidential information" },
  { value: "SLA", label: "Service Level", icon: <FilePlus2 className="h-5 w-5" />, description: "Service level agreement" },
  { value: "EMPLOYMENT", label: "Employment", icon: <Briefcase className="h-5 w-5" />, description: "Employee hiring contracts" },
  { value: "VENDOR", label: "Vendor Service", icon: <Building2 className="h-5 w-5" />, description: "Contracts with external vendors" },
  { value: "LEASE", label: "Lease", icon: <Building2 className="h-5 w-5" />, description: "Property or equipment leases" },
  { value: "OTHER", label: "Other", icon: <HelpCircle className="h-5 w-5" />, description: "Any other type of agreement" },
];

interface AgreementFormData {
  title: string;
  parties: string;
  value: string;
  startDate: string;
  endDate: string;
  draftDocument: File | null;
}

const defaultForm: AgreementFormData = {
  title: "",
  parties: "",
  value: "",
  startDate: "",
  endDate: "",
  draftDocument: null,
};

const FieldGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

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

export default function CreateAgreementPage() {
  const [step, setStep] = useState(1);
  const [agreementType, setAgreementType] = useState<AgreementType>("");
  const [form, setForm] = useState<AgreementFormData>(defaultForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setF = (k: keyof AgreementFormData) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((p) => ({ ...p, draftDocument: e.target.files![0] }));
    } else {
      setForm((p) => ({ ...p, draftDocument: null }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const dataPayload = {
        title: form.title,
        type: agreementType,
        parties: form.parties,
        value: form.value ? parseFloat(form.value) : 0,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(dataPayload));

      if (form.draftDocument) {
        formData.append("document", form.draftDocument);
      }

      await axiosInstance.post(API_PATHS.AGREEMENT.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to create agreement", err);
      setErrorMsg(err?.response?.data?.message || "An error occurred while creating the agreement.");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-xl font-bold text-textPrimary">Agreement Submitted!</h2>
        <p className="text-sm text-textSecondary text-center max-w-sm">
          Your agreement has been submitted successfully for review and approval.
        </p>
        <button
          onClick={() => { setStep(1); setAgreementType(""); setForm(defaultForm); setSubmitted(false); }}
          className="mt-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Submit Another Agreement
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <HandshakeIcon className="h-6 w-6 text-blue-500" /> Create a New Agreement
        </h1>
        <p className="text-sm text-textSecondary mt-1">
          Provide the required details to initialize an agreement
        </p>
      </div>

      <div className="flex items-center gap-0">
        <StepDot step={1} current={step} label="Type" />
        <StepLine done={step > 1} />
        <StepDot step={2} current={step} label="Details" />
        <StepLine done={step > 2} />
        <StepDot step={3} current={step} label="Review" />
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-textPrimary">Select agreement type</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGREEMENT_TYPES.map(({ value, label, icon, description }) => (
              <button
                key={value}
                onClick={() => setAgreementType(value)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all",
                  agreementType === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                    : "border-borderPrimary bg-backgroundSecondary hover:border-blue-300 hover:bg-hoverPrimary"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl shrink-0 mt-0.5",
                  agreementType === value ? "bg-blue-500 text-white" : "bg-hoverPrimary text-textSecondary"
                )}>
                  {icon}
                </div>
                <div>
                  <p className={cn("font-semibold text-sm", agreementType === value ? "text-blue-600 dark:text-blue-400" : "text-textPrimary")}>{label}</p>
                  <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">{description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-2">
            <button
              disabled={!agreementType}
              onClick={() => setStep(2)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                agreementType ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-borderPrimary text-textSecondary cursor-not-allowed"
              )}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
              {AGREEMENT_TYPES.find(a => a.value === agreementType)?.label || agreementType}
            </span>
            <button onClick={() => setStep(1)} className="text-xs text-textSecondary hover:text-textPrimary underline">
              Change type
            </button>
          </div>

          <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="text-sm font-semibold text-textPrimary border-b border-borderPrimary pb-3">Agreement Details</h3>
            <FieldGrid>
              <Input label="Title *" placeholder="Agreement title" value={form.title} onChange={e => setF("title")(e.target.value)} />
              <Input label="Parties Involved *" placeholder="e.g. Party A and Party B" value={form.parties} onChange={e => setF("parties")(e.target.value)} />
              <Input label="Value (LKR) *" type="number" placeholder="0.00" value={form.value} onChange={e => setF("value")(e.target.value)} />
              <Input label="Start Date *" type="date" value={form.startDate} onChange={e => setF("startDate")(e.target.value)} />
              <Input label="End Date *" type="date" value={form.endDate} onChange={e => setF("endDate")(e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-textPrimary">Draft Document *</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </FieldGrid>
          </div>

          <div className="flex justify-between mt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-borderPrimary text-textSecondary hover:bg-hoverPrimary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              disabled={!form.title || !form.parties || !form.value || !form.startDate || !form.endDate || !form.draftDocument}
              onClick={() => setStep(3)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                form.title && form.parties && form.value && form.startDate && form.endDate && form.draftDocument
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-borderPrimary text-textSecondary cursor-not-allowed"
              )}
            >
              Review <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col shadow-sm">
            <h3 className="text-sm font-semibold text-textPrimary border-b border-borderPrimary pb-3 mb-2">Review</h3>
            <ReviewRow label="Type" value={AGREEMENT_TYPES.find(a => a.value === agreementType)?.label || agreementType} />
            <ReviewRow label="Title" value={form.title} />
            <ReviewRow label="Parties" value={form.parties} />
            <ReviewRow label="Value (LKR)" value={form.value} />
            <ReviewRow label="Start Date" value={form.startDate} />
            <ReviewRow label="End Date" value={form.endDate} />
            {form.draftDocument && <ReviewRow label="Draft Document" value={form.draftDocument.name} />}
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
                  <CheckCircle2 className="h-4 w-4" /> Submit
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
