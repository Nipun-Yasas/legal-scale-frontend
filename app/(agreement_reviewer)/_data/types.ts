export type AgreementStatus = "Pending Review" | "Under Review" | "Reviewed" | "Approved" | "Rejected";
export type AgreementType =
  | "Vendor Contract"
  | "Service Level Agreement"
  | "Non-Disclosure Agreement"
  | "Employment Contract"
  | "Lease Agreement"
  | "Partnership Agreement";

export interface AgreementComment {
  id: string;
  author: string;
  date: string;
  text: string;
  clause?: string;
}

export interface Agreement {
  id: string;
  title: string;
  type: AgreementType;
  counterparty: string;
  submittedBy: string;
  submittedDate: string;
  value: string;
  status: AgreementStatus;
  dueDate: string;
  description: string;
  comments: AgreementComment[];
  reviewedDate?: string;
}
