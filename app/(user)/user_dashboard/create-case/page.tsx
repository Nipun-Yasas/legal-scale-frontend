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
  | "Contract Dispute"
  | "Employment"
  | "IP & Patents"
  | "Regulatory"
  | "Litigation"
  | "Other";

const CASE_TYPES: { value: CaseType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "Contract Dispute", label: "Contract Dispute", icon: <Briefcase className="h-5 w-5" />, description: "Breach of contract, payment disputes, vendor issues" },
  { value: "Employment", label: "Employment", icon: <Users className="h-5 w-5" />, description: "HR, termination, harassment, non-compete" },
  { value: "IP & Patents", label: "IP & Patents", icon: <Lightbulb className="h-5 w-5" />, description: "Trademark, copyright, patent infringement" },
  { value: "Regulatory", label: "Regulatory", icon: <ShieldAlert className="h-5 w-5" />, description: "Compliance, TRCSL, government regulations" },
  { value: "Litigation", label: "Litigation", icon: <Gavel className="h-5 w-5" />, description: "Active court proceedings, appeals" },
  { value: "Other", label: "Other", icon: <HelpCircle className="h-5 w-5" />, description: "Any other legal matter" },
];

const PRIORITY = ["Low", "Medium", "High", "Critical"];

/* ── Shared base form state ── */
interface BaseForm {
  title: string;
  description: string;
  priority: string;
  incidentDate: string;
  attachments: string;
}

/* ── Type-specific extra field states ── */
interface ContractFields { contractRef: string; counterparty: string; contractValue: string; breachDate: string; claimAmount: string; }
interface EmploymentFields { employeeId: string; department: string; incidentType: string; witnessNames: string; hrRef: string; }
interface IPFields { ipType: string; registrationNumber: string; infringerName: string; infringingProduct: string; jurisdictions: string; }
interface RegulatoryFields { regulatoryBody: string; regulationRef: string; inspectionDate: string; penaltyAmount: string; complianceDeadline: string; }
interface LitigationFields { courtName: string; caseNumber: string; opposingCounsel: string; hearingDate: string; jurisdictionType: string; }
interface OtherFields { legalArea: string; briefSummary: string; urgencyReason: string; }

const defaultBase: BaseForm = { title: "", description: "", priority: "Medium", incidentDate: "", attachments: "" };
const defaultContract: ContractFields = { contractRef: "", counterparty: "", contractValue: "", breachDate: "", claimAmount: "" };
const defaultEmployment: EmploymentFields = { employeeId: "", department: "", incidentType: "", witnessNames: "", hrRef: "" };
const defaultIP: IPFields = { ipType: "", registrationNumber: "", infringerName: "", infringingProduct: "", jurisdictions: "" };
const defaultRegulatory: RegulatoryFields = { regulatoryBody: "", regulationRef: "", inspectionDate: "", penaltyAmount: "", complianceDeadline: "" };
const defaultLitigation: LitigationFields = { courtName: "", caseNumber: "", opposingCounsel: "", hearingDate: "", jurisdictionType: "" };
const defaultOther: OtherFields = { legalArea: "", briefSummary: "", urgencyReason: "" };

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

export default function CreateCasePage() {
  const [step, setStep] = useState(1); // 1: Type, 2: Details, 3: Review
  const [caseType, setCaseType] = useState<CaseType>("");
  const [base, setBase] = useState<BaseForm>(defaultBase);
  const [contract, setContract] = useState<ContractFields>(defaultContract);
  const [employment, setEmployment] = useState<EmploymentFields>(defaultEmployment);
  const [ip, setIp] = useState<IPFields>(defaultIP);
  const [regulatory, setRegulatory] = useState<RegulatoryFields>(defaultRegulatory);
  const [litigation, setLitigation] = useState<LitigationFields>(defaultLitigation);
  const [other, setOther] = useState<OtherFields>(defaultOther);
  const [submitted, setSubmitted] = useState(false);

  const setB = (k: keyof BaseForm) => (v: string) => setBase(p => ({ ...p, [k]: v }));

  /* ── Type-specific extra fields ── */
  const renderExtraFields = () => {
    switch (caseType) {
      case "Contract Dispute":
        return (
          <FieldGrid>
            <Input label="Contract Reference No." placeholder="e.g. CNT-2024-001" value={contract.contractRef} onChange={e => setContract(p => ({ ...p, contractRef: e.target.value }))} />
            <Input label="Counterparty Name" placeholder="Opposing party or vendor" value={contract.counterparty} onChange={e => setContract(p => ({ ...p, counterparty: e.target.value }))} />
            <Input label="Contract Value (LKR)" type="number" placeholder="0.00" value={contract.contractValue} onChange={e => setContract(p => ({ ...p, contractValue: e.target.value }))} />
            <Input label="Date of Breach" type="date" value={contract.breachDate} onChange={e => setContract(p => ({ ...p, breachDate: e.target.value }))} />
            <Input label="Claim Amount (LKR)" type="number" placeholder="0.00" value={contract.claimAmount} onChange={e => setContract(p => ({ ...p, claimAmount: e.target.value }))} />
          </FieldGrid>
        );

      case "Employment":
        return (
          <FieldGrid>
            <Input label="Employee ID" placeholder="e.g. EMP-00123" value={employment.employeeId} onChange={e => setEmployment(p => ({ ...p, employeeId: e.target.value }))} />
            <Input label="Department" placeholder="e.g. Engineering" value={employment.department} onChange={e => setEmployment(p => ({ ...p, department: e.target.value }))} />
            <Select label="Incident Type" value={employment.incidentType} onChange={e => setEmployment(p => ({ ...p, incidentType: e.target.value }))}>
              <option value="">Select incident type</option>
              {["Termination", "Harassment", "Discrimination", "Non-Compete Violation", "Wage Dispute", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Input label="HR Reference No." placeholder="e.g. HR-REF-2025-09" value={employment.hrRef} onChange={e => setEmployment(p => ({ ...p, hrRef: e.target.value }))} />
            <div className="sm:col-span-2">
              <Input label="Witness Names (comma-separated)" placeholder="e.g. John Doe, Jane Smith" value={employment.witnessNames} onChange={e => setEmployment(p => ({ ...p, witnessNames: e.target.value }))} />
            </div>
          </FieldGrid>
        );

      case "IP & Patents":
        return (
          <FieldGrid>
            <Select label="IP Type" value={ip.ipType} onChange={e => setIp(p => ({ ...p, ipType: e.target.value }))}>
              <option value="">Select IP type</option>
              {["Trademark", "Copyright", "Patent", "Trade Secret", "Industrial Design"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Input label="Registration / Application No." placeholder="e.g. TM-LK-2023-0012" value={ip.registrationNumber} onChange={e => setIp(p => ({ ...p, registrationNumber: e.target.value }))} />
            <Input label="Alleged Infringer Name" placeholder="Individual or company" value={ip.infringerName} onChange={e => setIp(p => ({ ...p, infringerName: e.target.value }))} />
            <Input label="Infringing Product / Service" placeholder="Describe the infringing item" value={ip.infringingProduct} onChange={e => setIp(p => ({ ...p, infringingProduct: e.target.value }))} />
            <div className="sm:col-span-2">
              <Input label="Jurisdictions Affected" placeholder="e.g. Sri Lanka, India, EU" value={ip.jurisdictions} onChange={e => setIp(p => ({ ...p, jurisdictions: e.target.value }))} />
            </div>
          </FieldGrid>
        );

      case "Regulatory":
        return (
          <FieldGrid>
            <Input label="Regulatory Body" placeholder="e.g. TRCSL, SEC, CBSL" value={regulatory.regulatoryBody} onChange={e => setRegulatory(p => ({ ...p, regulatoryBody: e.target.value }))} />
            <Input label="Regulation / Circular Reference" placeholder="e.g. TRCSL/DIR/2024/05" value={regulatory.regulationRef} onChange={e => setRegulatory(p => ({ ...p, regulationRef: e.target.value }))} />
            <Input label="Inspection / Notice Date" type="date" value={regulatory.inspectionDate} onChange={e => setRegulatory(p => ({ ...p, inspectionDate: e.target.value }))} />
            <Input label="Compliance Deadline" type="date" value={regulatory.complianceDeadline} onChange={e => setRegulatory(p => ({ ...p, complianceDeadline: e.target.value }))} />
            <Input label="Penalty Amount (LKR)" type="number" placeholder="0.00" value={regulatory.penaltyAmount} onChange={e => setRegulatory(p => ({ ...p, penaltyAmount: e.target.value }))} />
          </FieldGrid>
        );

      case "Litigation":
        return (
          <FieldGrid>
            <Input label="Court Name" placeholder="e.g. Commercial High Court, Colombo" value={litigation.courtName} onChange={e => setLitigation(p => ({ ...p, courtName: e.target.value }))} />
            <Input label="Court Case Number" placeholder="e.g. HC/COM/0123/2025" value={litigation.caseNumber} onChange={e => setLitigation(p => ({ ...p, caseNumber: e.target.value }))} />
            <Input label="Opposing Counsel" placeholder="Name of opposing lawyer / firm" value={litigation.opposingCounsel} onChange={e => setLitigation(p => ({ ...p, opposingCounsel: e.target.value }))} />
            <Input label="Next Hearing Date" type="date" value={litigation.hearingDate} onChange={e => setLitigation(p => ({ ...p, hearingDate: e.target.value }))} />
            <Select label="Jurisdiction Type" value={litigation.jurisdictionType} onChange={e => setLitigation(p => ({ ...p, jurisdictionType: e.target.value }))}>
              <option value="">Select jurisdiction</option>
              {["Civil", "Criminal", "Commercial", "Labour", "Administrative", "Appellate"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </FieldGrid>
        );

      case "Other":
        return (
          <FieldGrid>
            <Input label="Legal Area" placeholder="e.g. Property, Tax, Family Law" value={other.legalArea} onChange={e => setOther(p => ({ ...p, legalArea: e.target.value }))} />
            <Input label="Urgency Reason" placeholder="Why is this urgent?" value={other.urgencyReason} onChange={e => setOther(p => ({ ...p, urgencyReason: e.target.value }))} />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-textPrimary mb-1">Brief Summary</label>
              <textarea
                rows={3}
                placeholder="Provide any additional context..."
                value={other.briefSummary}
                onChange={e => setOther(p => ({ ...p, briefSummary: e.target.value }))}
                className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors resize-none"
              />
            </div>
          </FieldGrid>
        );

      default:
        return null;
    }
  };

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
          onClick={() => { setStep(1); setCaseType(""); setBase(defaultBase); setSubmitted(false); }}
          className="mt-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Submit Another Case
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary mb-1">User Portal</p>
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
            <Input label="Case Title *" placeholder="Brief title describing the issue" value={base.title} onChange={e => setB("title")(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-1">Description *</label>
              <textarea
                rows={4}
                placeholder="Provide a detailed description of the legal matter..."
                value={base.description}
                onChange={e => setB("description")(e.target.value)}
                className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors resize-none"
              />
            </div>
            <FieldGrid>
              <Select label="Priority" value={base.priority} onChange={e => setB("priority")(e.target.value)}>
                {PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
              <Input label="Date of Incident" type="date" value={base.incidentDate} onChange={e => setB("incidentDate")(e.target.value)} />
              <FullRow>
                <Input label="Supporting Documents / Links" placeholder="File paths, SharePoint links, etc." value={base.attachments} onChange={e => setB("attachments")(e.target.value)} />
              </FullRow>
            </FieldGrid>
          </div>

          {/* Type-specific fields */}
          {caseType && (
            <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-sm font-semibold text-textPrimary border-b border-borderPrimary pb-3">
                {caseType} — Additional Details
              </h3>
              {renderExtraFields()}
            </div>
          )}

          <div className="flex justify-between mt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-borderPrimary text-textSecondary hover:bg-hoverPrimary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              disabled={!base.title || !base.description}
              onClick={() => setStep(3)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                base.title && base.description
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
            <ReviewRow label="Case Type" value={caseType} />
            <ReviewRow label="Title" value={base.title} />
            <ReviewRow label="Description" value={base.description} />
            <ReviewRow label="Priority" value={base.priority} />
            <ReviewRow label="Date of Incident" value={base.incidentDate} />
            <ReviewRow label="Attachments" value={base.attachments} />

            {caseType === "Contract Dispute" && <>
              <ReviewRow label="Contract Ref" value={contract.contractRef} />
              <ReviewRow label="Counterparty" value={contract.counterparty} />
              <ReviewRow label="Contract Value (LKR)" value={contract.contractValue} />
              <ReviewRow label="Breach Date" value={contract.breachDate} />
              <ReviewRow label="Claim Amount (LKR)" value={contract.claimAmount} />
            </>}
            {caseType === "Employment" && <>
              <ReviewRow label="Employee ID" value={employment.employeeId} />
              <ReviewRow label="Department" value={employment.department} />
              <ReviewRow label="Incident Type" value={employment.incidentType} />
              <ReviewRow label="HR Reference" value={employment.hrRef} />
              <ReviewRow label="Witnesses" value={employment.witnessNames} />
            </>}
            {caseType === "IP & Patents" && <>
              <ReviewRow label="IP Type" value={ip.ipType} />
              <ReviewRow label="Registration No." value={ip.registrationNumber} />
              <ReviewRow label="Infringer" value={ip.infringerName} />
              <ReviewRow label="Infringing Product" value={ip.infringingProduct} />
              <ReviewRow label="Jurisdictions" value={ip.jurisdictions} />
            </>}
            {caseType === "Regulatory" && <>
              <ReviewRow label="Regulatory Body" value={regulatory.regulatoryBody} />
              <ReviewRow label="Regulation Ref" value={regulatory.regulationRef} />
              <ReviewRow label="Inspection Date" value={regulatory.inspectionDate} />
              <ReviewRow label="Compliance Deadline" value={regulatory.complianceDeadline} />
              <ReviewRow label="Penalty (LKR)" value={regulatory.penaltyAmount} />
            </>}
            {caseType === "Litigation" && <>
              <ReviewRow label="Court Name" value={litigation.courtName} />
              <ReviewRow label="Court Case No." value={litigation.caseNumber} />
              <ReviewRow label="Opposing Counsel" value={litigation.opposingCounsel} />
              <ReviewRow label="Next Hearing" value={litigation.hearingDate} />
              <ReviewRow label="Jurisdiction Type" value={litigation.jurisdictionType} />
            </>}
            {caseType === "Other" && <>
              <ReviewRow label="Legal Area" value={other.legalArea} />
              <ReviewRow label="Urgency Reason" value={other.urgencyReason} />
              <ReviewRow label="Brief Summary" value={other.briefSummary} />
            </>}
          </div>

          <div className="flex justify-between mt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-borderPrimary text-textSecondary hover:bg-hoverPrimary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" /> Submit Case
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
