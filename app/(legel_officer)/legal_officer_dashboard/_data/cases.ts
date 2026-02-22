export type CaseProgress = "New" | "Active" | "On Hold" | "Closed";
export type CasePriority = "Low" | "Medium" | "High" | "Critical";
export type CaseType =
  | "Contract Dispute"
  | "Employment"
  | "IP & Patents"
  | "Regulatory"
  | "Litigation"
  | "Other";

export interface ActivityLog {
  date: string;
  action: string;
  note?: string;
}

export interface AssignedCase {
  id: string;
  title: string;
  type: CaseType;
  progress: CaseProgress;
  priority: CasePriority;
  client: string;
  department: string;
  openedDate: string;
  lastActivity: string;
  dueDate: string;
  exposure: string;
  description: string;
  activity: ActivityLog[];
}

export const assignedCases: AssignedCase[] = [
  {
    id: "CAS-003",
    title: "Vendor Contract Breach",
    type: "Contract Dispute",
    progress: "Active",
    priority: "High",
    client: "Procurement Dept.",
    department: "Procurement",
    openedDate: "2025-12-15",
    lastActivity: "2026-02-18",
    dueDate: "2026-03-15",
    exposure: "LKR 2.1M",
    description:
      "Vendor failed to deliver equipment within SLA terms, causing operational delays. Seeking compensation and contract termination.",
    activity: [
      { date: "2025-12-15", action: "Case opened", note: "Assigned to legal officer." },
      { date: "2025-12-20", action: "Initial review completed", note: "Contract documents reviewed." },
      { date: "2026-01-10", action: "Demand letter sent", note: "30-day response window." },
      { date: "2026-02-01", action: "Vendor responded", note: "Partial settlement offered." },
      { date: "2026-02-18", action: "Negotiation in progress", note: "Counter-proposal drafted." },
    ],
  },
  {
    id: "CAS-005",
    title: "Contractor Non-Compete Violation",
    type: "Employment",
    progress: "Active",
    priority: "Medium",
    client: "HR Department",
    department: "HR",
    openedDate: "2026-01-08",
    lastActivity: "2026-02-15",
    dueDate: "2026-04-08",
    exposure: "LKR 1.0M",
    description:
      "Former contractor found to be working with a direct competitor in violation of non-compete clause signed in 2024.",
    activity: [
      { date: "2026-01-08", action: "Case opened", note: "Reported by HR." },
      { date: "2026-01-15", action: "Non-compete agreement reviewed" },
      { date: "2026-01-28", action: "Cease & desist letter issued" },
      { date: "2026-02-15", action: "Follow-up response received", note: "Contractor denies violation." },
    ],
  },
  {
    id: "CAS-007",
    title: "TRCSL Compliance Investigation",
    type: "Regulatory",
    progress: "Active",
    priority: "High",
    client: "Regulatory Affairs",
    department: "Regulatory",
    openedDate: "2026-02-05",
    lastActivity: "2026-02-20",
    dueDate: "2026-03-05",
    exposure: "LKR 5.0M",
    description:
      "TRCSL initiated an investigation on spectrum usage compliance. Response and documentation required within 30 days.",
    activity: [
      { date: "2026-02-05", action: "Case opened", note: "Notice received from TRCSL." },
      { date: "2026-02-10", action: "Internal audit started" },
      { date: "2026-02-20", action: "Preliminary findings compiled", note: "Minor discrepancies found." },
    ],
  },
  {
    id: "CAS-008",
    title: "Software License Dispute",
    type: "IP & Patents",
    progress: "New",
    priority: "Medium",
    client: "IT Department",
    department: "IT",
    openedDate: "2026-02-10",
    lastActivity: "2026-02-10",
    dueDate: "2026-04-10",
    exposure: "LKR 0.6M",
    description:
      "Third-party vendor claiming Mobitel used software beyond licensed scope. License agreement under review.",
    activity: [
      { date: "2026-02-10", action: "Case opened", note: "Claim received from vendor." },
    ],
  },
  {
    id: "CAS-009",
    title: "Tower Lease Termination",
    type: "Contract Dispute",
    progress: "On Hold",
    priority: "Low",
    client: "Infrastructure Dept.",
    department: "Infrastructure",
    openedDate: "2025-11-20",
    lastActivity: "2026-01-05",
    dueDate: "2026-05-20",
    exposure: "LKR 0.4M",
    description:
      "Landowner disputing early termination clause of tower lease. Matter is on hold pending mediation appointment.",
    activity: [
      { date: "2025-11-20", action: "Case opened" },
      { date: "2025-12-01", action: "Mediation requested" },
      { date: "2026-01-05", action: "On hold", note: "Awaiting mediator availability." },
    ],
  },
  {
    id: "CAS-002",
    title: "Employee Termination Appeal",
    type: "Employment",
    progress: "Closed",
    priority: "Medium",
    client: "HR Department",
    department: "HR",
    openedDate: "2025-11-03",
    lastActivity: "2026-01-30",
    dueDate: "2026-02-03",
    exposure: "LKR 0.8M",
    description:
      "Former employee filed appeal against termination decision. Matter resolved through settlement.",
    activity: [
      { date: "2025-11-03", action: "Case opened" },
      { date: "2025-11-20", action: "HR review completed" },
      { date: "2025-12-10", action: "Mediation held" },
      { date: "2026-01-15", action: "Settlement agreed" },
      { date: "2026-01-30", action: "Case closed", note: "Settlement paid. No further action." },
    ],
  },
  {
    id: "CAS-012",
    title: "Data Privacy Complaint — PDPA",
    type: "Regulatory",
    progress: "New",
    priority: "Critical",
    client: "Data & Privacy Office",
    department: "Legal & Compliance",
    openedDate: "2026-02-19",
    lastActivity: "2026-02-19",
    dueDate: "2026-03-19",
    exposure: "LKR 3.0M",
    description:
      "Customer complaint filed under PDPA alleging unauthorized data sharing with third parties. Requires urgent response.",
    activity: [
      { date: "2026-02-19", action: "Case opened", note: "Escalated as critical." },
    ],
  },
];
