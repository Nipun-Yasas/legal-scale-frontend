export type OfficerStatus = "Active" | "On Leave" | "Inactive";
export type CaseType =
  | "Contract Dispute"
  | "Employment"
  | "IP & Patents"
  | "Regulatory"
  | "Litigation"
  | "Other";

export type DocStatus = "Pending Review" | "Pending Approval" | "Reviewed" | "Approved" | "Rejected";
export type ShiftStatus = "Pending" | "Approved" | "Rejected";

export interface LegalOfficer {
  id: string;
  name: string;
  email: string;
  avatar: string;       // 2-letter initials
  specialization: CaseType | string;
  activeCases: number;
  status: OfficerStatus;
  joinedDate: string;
}

export interface ReviewableDocument {
  id: string;
  caseId: string;
  caseTitle: string;
  docType: string;
  submittedBy: string;
  submittedDate: string;
  status: DocStatus;
  notes: string;
  reviewedDate?: string;
  reviewedBy?: string;
}

export interface CaseShiftRequest {
  id: string;
  caseId: string;
  caseTitle: string;
  currentType: CaseType;
  requestedType: CaseType;
  requestedBy: string;
  requestDate: string;
  status: ShiftStatus;
  reason: string;
  reviewedDate?: string;
}
