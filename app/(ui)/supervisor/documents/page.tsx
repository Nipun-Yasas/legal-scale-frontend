"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { Search, X, FileText, Upload, Download, Clock } from "lucide-react";
import { toast } from "sonner";

interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadDate: string;
  uploadedByUserId: number;
}

interface Case {
  id: number;
  caseTitle: string;
  caseType: string;
  referenceNumber: string;
  status: string;
  supportingAttachments: Attachment[];
}

interface FlatDocument extends Attachment {
  caseId: number;
  caseTitle: string;
  caseType: string;
  referenceNumber: string;
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function UploadDocumentModal({ onClose, onSuccess, cases }: { onClose: () => void, onSuccess: () => void, cases: Case[] }) {
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedCaseId || !file) {
      toast.error("Please select a case and a document.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await axiosInstance.post(API_PATHS.CASE.ATTACHMENT_DOCUMENT(selectedCaseId), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Document uploaded successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to upload document", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-backgroundSecondary border border-borderPrimary rounded-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-borderPrimary pb-4 mb-4">
          <h2 className="text-lg font-bold text-textPrimary">Upload Document</h2>
          <button onClick={onClose} className="text-textSecondary hover:text-textPrimary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-textPrimary">Select Case</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>Select a case</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.referenceNumber || c.id} - {c.caseTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-textPrimary">Document File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-borderPrimary bg-input text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-borderPrimary text-sm text-textSecondary hover:bg-hoverPrimary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedCaseId || !file}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<Case[]>([]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.SUPERVISOR.GET_OWN_CASES);
      let fetchedCases = [];
      if (Array.isArray(response.data)) {
        fetchedCases = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        fetchedCases = response.data.data;
      }
      setCases(fetchedCases);
    } catch (error) {
      console.error("Failed to fetch cases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const flatDocuments: FlatDocument[] = useMemo(() => {
    const docs: FlatDocument[] = [];
    cases.forEach((c) => {
      if (c.supportingAttachments && Array.isArray(c.supportingAttachments)) {
        c.supportingAttachments.forEach((a) => {
          docs.push({
            ...a,
            caseId: c.id,
            caseTitle: c.caseTitle,
            caseType: c.caseType,
            referenceNumber: c.referenceNumber,
          });
        });
      }
    });
    // Sort by most recent
    docs.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    return docs;
  }, [cases]);

  const filteredDocs = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return flatDocuments;
    return flatDocuments.filter(
      (d) =>
        d.fileName.toLowerCase().includes(q) ||
        d.caseTitle.toLowerCase().includes(q) ||
        (d.referenceNumber && d.referenceNumber.toLowerCase().includes(q)) ||
        d.caseType.toLowerCase().includes(q)
    );
  }, [flatDocuments, search]);

  const handleDownload = async (docId: number, fileName: string) => {
    try {
      const response = await axiosInstance.get(API_PATHS.DOC.DOWNLOAD_DOC(docId.toString()), {
        responseType: 'blob',
      });
      // Create a blob URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document", error);
      toast.error("Failed to download document.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Case Documents</h1>
          <p className="text-textSecondary text-sm mt-1">
            View and download documents attached to your cases.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by file name, case title, reference..."
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
      </div>

      {/* Document Loading / List */}
      {loading ? (
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary py-16 text-center text-textSecondary">
          Loading documents...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary py-16 text-center text-textSecondary">
          {search ? "No documents match your search." : "No documents found across your cases."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-borderPrimary bg-backgroundSecondary p-5 hover:bg-hoverPrimary transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-textPrimary truncate" title={d.fileName}>
                    {d.fileName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
                      {d.fileType.split("/").pop()?.toUpperCase() || d.fileType}
                    </span>
                    <span className="text-xs text-textSecondary truncate flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {fmt(d.uploadDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-borderPrimary space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-textSecondary w-16 shrink-0">Case:</span>
                  <span className="text-textPrimary font-medium truncate" title={d.caseTitle}>{d.caseTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-textSecondary w-16 shrink-0">Ref:</span>
                  <span className="text-primary font-mono truncate" title={d.referenceNumber || `ID-${d.caseId}`}>{d.referenceNumber || `ID-${d.caseId}`}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-textSecondary w-16 shrink-0">Type:</span>
                  <span className="text-textPrimary truncate" title={d.caseType}>{d.caseType}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-borderPrimary">
                <button
                  onClick={() => handleDownload(d.id, d.fileName)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-background text-textPrimary border border-borderPrimary text-xs font-medium hover:bg-hoverPrimary transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <UploadDocumentModal
          cases={cases}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchCases(); // Refresh cases locally
          }}
        />
      )}
    </div>
  );
}
