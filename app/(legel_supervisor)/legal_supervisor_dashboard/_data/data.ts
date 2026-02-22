/* Local type definitions to avoid missing './types' import */
export interface LegalOfficer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  activeCases: number;
  status: string;
  joinedDate: string;
}

export interface ReviewableDocument {
  id: string;
  caseId: string;
  caseTitle: string;
  docType: string;
  submittedBy: string;
  submittedDate: string;
  status: string;
  notes: string;
  reviewedDate?: string;
  reviewedBy?: string;
}

export interface CaseShiftRequest {
  id: string;
  caseId: string;
  caseTitle: string;
  currentType: string;
  requestedType: string;
  requestedBy: string;
  requestDate: string;
  status: string;
  reason: string;
  reviewedDate?: string;
}

/* ── Legal Officers ── */
export const legalOfficers: LegalOfficer[] = [
  {
    id: "OFF-001",
    name: "Amara Perera",
    email: "a.perera@mobitel.lk",
    avatar: "AP",
    specialization: "Contract Law",
    activeCases: 3,
    status: "Active",
    joinedDate: "2023-04-10",
  },
  {
    id: "OFF-002",
    name: "Roshan Fernando",
    email: "r.fernando@mobitel.lk",
    avatar: "RF",
    specialization: "Regulatory Compliance",
    activeCases: 4,
    status: "Active",
    joinedDate: "2022-08-22",
  },
  {
    id: "OFF-003",
    name: "Dilini Jayasuriya",
    email: "d.jayasuriya@mobitel.lk",
    avatar: "DJ",
    specialization: "Employment Law",
    activeCases: 2,
    status: "Active",
    joinedDate: "2024-01-15",
  },
  {
    id: "OFF-004",
    name: "Kasun Wickramasinghe",
    email: "k.wickrama@mobitel.lk",
    avatar: "KW",
    specialization: "IP & Patents",
    activeCases: 1,
    status: "Active",
    joinedDate: "2023-11-05",
  },
  {
    id: "OFF-005",
    name: "Thilini Rathnayake",
    email: "t.rathnayake@mobitel.lk",
    avatar: "TR",
    specialization: "Litigation",
    activeCases: 0,
    status: "On Leave",
    joinedDate: "2021-06-30",
  },
];

/* ── Documents pending review / approval ── */
export const reviewableDocuments: ReviewableDocument[] = [
  {
    id: "DOC-001",
    caseId: "CAS-003",
    caseTitle: "Vendor Contract Breach",
    docType: "Demand Letter",
    submittedBy: "Amara Perera",
    submittedDate: "2026-01-10",
    status: "Pending Review",
    notes: "Demand letter issued to vendor citing SLA breach. Awaiting supervisor sign-off.",
  },
  {
    id: "DOC-002",
    caseId: "CAS-012",
    caseTitle: "Data Privacy Complaint — PDPA",
    docType: "Initial Assessment",
    submittedBy: "Roshan Fernando",
    submittedDate: "2026-02-19",
    status: "Pending Review",
    notes: "Critical urgency — PDPA complaint initial assessment ready for review.",
  },
  {
    id: "DOC-003",
    caseId: "CAS-007",
    caseTitle: "TRCSL Compliance Investigation",
    docType: "Compliance Report",
    submittedBy: "Roshan Fernando",
    submittedDate: "2026-02-20",
    status: "Pending Approval",
    notes: "Preliminary compliance findings compiled. Requires approval before submission to TRCSL.",
  },
  {
    id: "DOC-004",
    caseId: "CAS-005",
    caseTitle: "Contractor Non-Compete Violation",
    docType: "Cease & Desist Letter",
    submittedBy: "Dilini Jayasuriya",
    submittedDate: "2026-01-28",
    status: "Approved",
    notes: "Cease & desist approved and sent to contractor.",
    reviewedDate: "2026-01-30",
    reviewedBy: "Supervisor",
  },
  {
    id: "DOC-005",
    caseId: "CAS-008",
    caseTitle: "Software License Dispute",
    docType: "Legal Brief",
    submittedBy: "Kasun Wickramasinghe",
    submittedDate: "2026-02-10",
    status: "Reviewed",
    notes: "Legal brief reviewed, minor revisions requested.",
    reviewedDate: "2026-02-12",
    reviewedBy: "Supervisor",
  },
  {
    id: "DOC-006",
    caseId: "CAS-009",
    caseTitle: "Tower Lease Termination",
    docType: "Mediation Brief",
    submittedBy: "Amara Perera",
    submittedDate: "2025-11-25",
    status: "Approved",
    notes: "Mediation brief approved. Awaiting mediator availability.",
    reviewedDate: "2025-11-28",
    reviewedBy: "Supervisor",
  },
  {
    id: "DOC-007",
    caseId: "CAS-002",
    caseTitle: "Employee Termination Appeal",
    docType: "Settlement Agreement",
    submittedBy: "Dilini Jayasuriya",
    submittedDate: "2026-01-15",
    status: "Approved",
    notes: "Settlement agreement approved. Case subsequently closed.",
    reviewedDate: "2026-01-16",
    reviewedBy: "Supervisor",
  },
];

/* ── Case type shift requests ── */
export const caseShiftRequests: CaseShiftRequest[] = [
  {
    id: "SHIFT-001",
    caseId: "CAS-003",
    caseTitle: "Vendor Contract Breach",
    currentType: "Contract Dispute",
    requestedType: "Litigation",
    requestedBy: "Amara Perera",
    requestDate: "2026-02-15",
    status: "Pending",
    reason:
      "Vendor rejected settlement offer. Matter is likely to proceed to court. Requesting type shift to Litigation.",
  },
  {
    id: "SHIFT-002",
    caseId: "CAS-007",
    caseTitle: "TRCSL Compliance Investigation",
    currentType: "Regulatory",
    requestedType: "Litigation",
    requestedBy: "Roshan Fernando",
    requestDate: "2026-02-20",
    status: "Pending",
    reason:
      "TRCSL has indicated potential legal action. Preemptively requesting type shift to Litigation for proper classification.",
  },
  {
    id: "SHIFT-003",
    caseId: "CAS-008",
    caseTitle: "Software License Dispute",
    currentType: "IP & Patents",
    requestedType: "Contract Dispute",
    requestedBy: "Kasun Wickramasinghe",
    requestDate: "2026-02-11",
    status: "Approved",
    reason: "Review of claim shows the primary issue is contract scope, not IP infringement.",
    reviewedDate: "2026-02-13",
  },
  {
    id: "SHIFT-004",
    caseId: "CAS-005",
    caseTitle: "Contractor Non-Compete Violation",
    currentType: "Employment",
    requestedType: "Litigation",
    requestedBy: "Dilini Jayasuriya",
    requestDate: "2026-02-16",
    status: "Rejected",
    reason: "Contractor has responded. Litigation premature at this stage.",
    reviewedDate: "2026-02-17",
  },
];
