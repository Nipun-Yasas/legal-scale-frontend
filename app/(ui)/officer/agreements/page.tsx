"use client";

import React, { useEffect, useState } from "react";
import { HandshakeIcon, ChevronDown, ChevronRight, FileText, CheckSquare, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axiosInstance, { API_PATHS } from "@/lib/axios";

interface Version {
  id: number;
  agreementId: number;
  versionNumber: number;
  documentId: number;
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
  uploadedById: number;
  uploadedByName: string;
  versionNotes: string;
}

interface Comment {
  id: number;
  agreementId: number;
  commentedById: number;
  commentedByName: string;
  commentText: string;
  createdAt: string;
}

interface Agreement {
  id: number;
  title: string;
  type: string;
  parties: string;
  value: number;
  startDate: string;
  endDate: string;
  status: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string | null;
  reviewerId: number | null;
  reviewerName: string | null;
  approverId: number | null;
  approverName: string | null;
  linkedCaseId: number | null;
  approvalRemarks: string | null;
  isDigitallySigned: boolean;
  versions: Version[];
  comments: Comment[];
}

const statusColor: Record<string, string> = {
  "DRAFT": "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  "REVIEW_REQUESTED": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "IN_REVIEW": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "PENDING_APPROVAL": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "AWAITING_SIGNATORIES": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "APPROVED": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "REJECTED": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  // Fallbacks
  "Open": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Closed": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const formatStatus = (status: string) => {
  if (!status) return "Unknown";
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export default function OfficerAgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState<number | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAgreements = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AGREEMENT.GET_ALL);
      setAgreements(response.data);
    } catch (error) {
      console.error("Failed to fetch agreements:", error);
      toast.error("Failed to load agreements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handleReviewSubmit = async () => {
    if (!selectedAgreementId) return;
    setActionLoading(true);
    try {
      const body = {
        reviewStatus: "PENDING_APPROVAL",
        remarks: reviewRemarks || undefined
      };
      await axiosInstance.post(API_PATHS.OFFICER.REVIEW_AGREEMENT(selectedAgreementId.toString()), body);
      await fetchAgreements();
      setReviewModalOpen(false);
      toast.success("Agreement submitted for approval successfully");
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("Failed to submit agreement for approval");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadDocument = async (docId: number, docName: string) => {
    try {
      const url = API_PATHS.DOC.DOWNLOAD_DOC(docId.toString());
      const response = await axiosInstance.get(url, { responseType: 'blob' });

      const windowUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = windowUrl;
      link.setAttribute('download', docName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Failed to download document", error);
      toast.error("Failed to download document");
    }
  };

  return (
    <div className="flex flex-col gap-8 mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <HandshakeIcon className="h-6 w-6 text-blue-500" /> All Agreements
        </h1>
        <p className="text-sm text-textSecondary mt-1">
          Track and manage all submitted agreements
        </p>
      </div>

      <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-borderPrimary">
          <h2 className="text-sm font-semibold text-textPrimary">Agreements Directory</h2>
        </div>
        {loading ? (
          <div className="w-full">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borderPrimary">
                  <th className="w-10 px-4 py-3"></th>
                  {["Title", "Type", "Parties", "Value (LKR)", "Duration", "Status", "Creator", "Submitted"].map(h => (
                    <th key={h} className="text-left px-4 sm:px-6 py-3 text-textSecondary font-medium text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-borderPrimary last:border-0 h-[68px]">
                    <td className="px-4 py-3"><div className="w-4 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-32 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-20 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-24 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-20 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-40 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-20 h-6 rounded-full bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-24 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                    <td className="px-4 sm:px-6 py-3.5"><div className="w-24 h-4 rounded bg-textSecondary/20 animate-pulse"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : agreements.length === 0 ? (
          <p className="text-center py-10 text-sm text-textSecondary">No agreements found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderPrimary">
                <th className="w-10 px-4 py-3"></th>
                {[
                  "Title",
                  "Type",
                  "Parties",
                  "Value (LKR)",
                  "Duration",
                  "Status",
                  "Creator",
                  "Submitted",
                ].map((h) => (
                  <th key={h} className="text-left px-4 sm:px-6 py-3 text-textSecondary font-medium text-xs whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agreements.map(a => (
                <React.Fragment key={a.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-textSecondary">
                      {expandedId === a.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 font-medium text-textPrimary min-w-[150px]">{a.title}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{a.type}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-textSecondary min-w-[150px]">{a.parties}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">
                      {a.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{a.startDate} to {a.endDate}</td>
                    <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColor[a.status] || "bg-gray-100 text-gray-700")}>{formatStatus(a.status)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{a.createdByName}</td>
                    <td className="px-4 sm:px-6 py-3.5 text-textSecondary whitespace-nowrap">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                  {expandedId === a.id && (
                    <tr className="bg-backgroundPrimary/30 border-b border-borderPrimary">
                      <td colSpan={10} className="p-0">
                        <div className="p-4 sm:p-6 lg:pl-16 flex flex-col gap-6">

                          {/* Additional Information */}
                          <div className="flex items-center justify-between mb-4 mt-2">
                            <h3 className="text-sm font-bold text-textPrimary">Agreement Details</h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAgreementId(a.id);
                                  setReviewRemarks("");
                                  setReviewModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg text-xs font-semibold transition-colors"
                              >
                                <CheckSquare className="h-4 w-4" /> Submit for Approval
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {a.reviewerName && (
                              <div>
                                <span className="text-textSecondary block text-xs mb-0.5 uppercase tracking-wider">Reviewer</span>
                                <span className="font-medium text-textPrimary text-sm">{a.reviewerName}</span>
                              </div>
                            )}
                            {a.approverName && (
                              <div>
                                <span className="text-textSecondary block text-xs mb-0.5 uppercase tracking-wider">Approver</span>
                                <span className="font-medium text-textPrimary text-sm">{a.approverName}</span>
                              </div>
                            )}
                            {a.updatedAt && (
                              <div>
                                <span className="text-textSecondary block text-xs mb-0.5 uppercase tracking-wider">Last Updated</span>
                                <span className="font-medium text-textPrimary text-sm">{new Date(a.updatedAt).toLocaleString()}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-textSecondary block text-xs mb-0.5 uppercase tracking-wider">Digitally Signed</span>
                              <span className="font-medium text-textPrimary text-sm">{a.isDigitallySigned ? 'Yes' : 'No'}</span>
                            </div>
                            {a.approvalRemarks && (
                              <div className="sm:col-span-2 lg:col-span-4 mt-2">
                                <span className="text-textSecondary block text-xs mb-0.5 uppercase tracking-wider">Approval Remarks</span>
                                <div className="bg-backgroundSecondary p-3 rounded-xl border border-borderPrimary mt-1">
                                  <span className="text-sm text-textPrimary">{a.approvalRemarks}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <hr className="border-borderPrimary" />

                          {/* Document Versions */}
                          <div>
                            <h3 className="text-sm font-bold text-textPrimary mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              Document Versions
                            </h3>
                            {a.versions && a.versions.length > 0 ? (
                              <div className="rounded-xl border border-borderPrimary overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-backgroundSecondary">
                                    <tr className="border-b border-borderPrimary">
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs">Version</th>
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs">Document Name</th>
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs">Uploaded By</th>
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs">Date</th>
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs">Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {a.versions.map(v => (
                                      <tr key={v.id} className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary">
                                        <td className="px-4 py-2.5 text-textPrimary text-xs font-medium">v{v.versionNumber}</td>
                                        <td className="px-4 py-2.5 text-blue-500 font-medium text-xs hover:underline cursor-pointer" onClick={() => handleDownloadDocument(v.documentId, v.documentName)}>
                                          {v.documentName}
                                        </td>
                                        <td className="px-4 py-2.5 text-textSecondary text-xs">{v.uploadedByName}</td>
                                        <td className="px-4 py-2.5 text-textSecondary text-xs">{new Date(v.uploadedAt).toLocaleString()}</td>
                                        <td className="px-4 py-2.5 text-textSecondary text-xs">{v.versionNotes || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-textSecondary italic">No document versions uploaded yet.</p>
                            )}
                          </div>

                          {/* Comments */}
                          <div>
                            <h3 className="text-sm font-bold text-textPrimary mb-3 flex items-center gap-2">
                              Comments
                            </h3>
                            {a.comments && a.comments.length > 0 ? (
                              <div className="rounded-xl border border-borderPrimary overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-backgroundSecondary">
                                    <tr className="border-b border-borderPrimary">
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs">Comment</th>
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs w-48">Author</th>
                                      <th className="text-left px-4 py-2.5 text-textSecondary font-medium text-xs w-48">Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {a.comments.map((c, i) => (
                                      <tr key={c.id || i} className="border-b border-borderPrimary last:border-0 hover:bg-hoverPrimary">
                                        <td className="px-4 py-3 text-textPrimary text-sm">{c.commentText}</td>
                                        <td className="px-4 py-3 text-textSecondary text-xs">{c.commentedByName}</td>
                                        <td className="px-4 py-3 text-textSecondary text-xs">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-textSecondary italic pb-2">No comments available.</p>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-md shadow-xl p-6">
            <h2 className="text-lg font-bold text-textPrimary mb-4">Submit for Approval</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-textPrimary mb-1">Remarks (Optional)</label>
              <textarea
                rows={4}
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="Add any remarks for the approver..."
                className="w-full p-3 text-sm text-textPrimary bg-backgroundPrimary border border-borderPrimary rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-textSecondary hover:bg-hoverPrimary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Submitting..." : "Submit Approval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
