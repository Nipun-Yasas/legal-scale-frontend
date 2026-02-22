export type ApprovalStatus =
  | "Awaiting Final Approval"
  | "Finally Approved"
  | "Returned for Revision"
  | "Escalated";

export type AgreementType =
  | "Vendor Contract"
  | "Service Level Agreement"
  | "Non-Disclosure Agreement"
  | "Employment Contract"
  | "Lease Agreement"
  | "Partnership Agreement";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface ApprovalHistoryEntry {
  date: string;
  action: string;
  by: string;
  note?: string;
}

export interface ApprovableAgreement {
  id: string;
  title: string;
  type: AgreementType;
  counterparty: string;
  submittedBy: string;        // original submitter
  reviewedBy: string;         // agreement reviewer who cleared it
  submittedDate: string;
  reviewedDate: string;
  value: string;
  valueNumeric: number;       // for sorting / charts
  status: ApprovalStatus;
  dueDate: string;
  riskLevel: RiskLevel;
  description: string;
  reviewerComment: string;    // summary comment left by reviewer
  approvedDate?: string;
  history: ApprovalHistoryEntry[];
}
