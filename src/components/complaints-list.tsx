"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  GovernorateNames,
  ComplaintStatus,
  ComplaintStatusLabels,
} from "@/enums";
import {
  Complaint,
  ComplaintPriority,
  ComplaintApiResponse,
} from "@/models/complaint";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";
import { ComplaintTableSkeleton } from "./Skeletons";

// Constants
const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: "bg-yellow-50 text-yellow-700 border-yellow-100",
  [ComplaintStatus.InProgress]: "bg-blue-50 text-blue-700 border-blue-100",
  [ComplaintStatus.Completed]: "bg-green-50 text-green-700 border-green-100",
  [ComplaintStatus.Rejected]: "bg-rose-50 text-rose-700 border-rose-100",
};

const STATUS_FILTERS: Array<{ label: string; value: number | "All" }> = [
  { label: "All", value: "All" },
  { label: ComplaintStatusLabels[ComplaintStatus.Pending], value: ComplaintStatus.Pending },
  { label: ComplaintStatusLabels[ComplaintStatus.InProgress], value: ComplaintStatus.InProgress },
  { label: ComplaintStatusLabels[ComplaintStatus.Completed], value: ComplaintStatus.Completed },
  { label: ComplaintStatusLabels[ComplaintStatus.Rejected], value: ComplaintStatus.Rejected },
];

const COMPLAINT_TYPES: Record<number, string> = {
  0: "Service Quality",
  1: "Corruption",
  2: "Delay",
  3: "Misconduct",
  99: "Other",
};

const PAGE_SIZE = 10;

// Utility Functions
const statusFromNumber = (value: number): ComplaintStatus => {
  switch (value) {
    case 0:
      return ComplaintStatus.Pending;
    case 1:
      return ComplaintStatus.InProgress;
    case 2:
      return ComplaintStatus.Completed;
    case 3:
      return ComplaintStatus.Rejected;
    default:
      return ComplaintStatus.Pending;
  }
};

const priorityFromSeverity = (value: number): ComplaintPriority => {
  if (value >= 3) return "Urgent";
  if (value === 2) return "High";
  if (value === 1) return "Medium";
  return "Low";
};

const mapComplaintFromApi = (apiComplaint: ComplaintApiResponse): Complaint => ({
  id: apiComplaint.id,
  title: apiComplaint.title,
  category: apiComplaint.governmentEntityName ?? "General",
  studentName: apiComplaint.citizenName ?? "Unknown",
  studentClass: "",
  studentId: apiComplaint.citizenPhoneNumber ?? "N/A",
  guardianName: apiComplaint.citizenName ?? "Unknown",
  email: apiComplaint.citizenEmail ?? "",
  phone: apiComplaint.citizenPhoneNumber ?? "",
  status: statusFromNumber(apiComplaint.status),
  priority: priorityFromSeverity(apiComplaint.severity),
  severity: apiComplaint.severity,
  // Accept either 'type' (numeric or string) or 'complaintType' from API
  type: (() => {
    const raw = (apiComplaint as any).type ?? apiComplaint.complaintType;
    if (raw === undefined || raw === null) return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })(),
  // backward-compatible field
  complaintType: (() => {
    const raw = (apiComplaint as any).type ?? apiComplaint.complaintType;
    if (raw === undefined || raw === null) return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })(),
  createdAt: apiComplaint.createdAt,
  updatedAt: apiComplaint.createdAt,
  dueAt: apiComplaint.createdAt,
  governorate: (() => {
    const raw = (apiComplaint as any).governorate;
    if (raw === undefined || raw === null) return undefined;
    const n = Number(raw);
    return Number.isNaN(n) ? undefined : n;
  })(),
  lockedBy: (() => {
    const raw = (apiComplaint as any).lockedBy ?? (apiComplaint as any).locked_by;
    if (raw === undefined || raw === null) return undefined;
    return String(raw);
  })(),
  summary: apiComplaint.title,
  description: apiComplaint.title,
  tags: [],
  attachments: [],
  timeline: [],
});

const formatDate = (value: string) => {
  if (!value) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(value));
  } catch (e) {
    return "N/A";
  }
};

 

const ComplaintRow = ({ complaint }: { complaint: Complaint }) => {
  const limitWords = (text: string, maxWords: number) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  const formatLocked = (lockedBy?: string) => {
    if (lockedBy === undefined || lockedBy === null || lockedBy === "" || lockedBy === "null") return "No";
    return `Yes — ${lockedBy}`;
  };

  const formatSeverity = (i?: number) => {
    if (i === undefined || i === null) return "N/A";
    if (i >= 3) return "Urgent";
    if (i === 2) return "High";
    if (i === 1) return "Medium";
    return "Low";
  };

  const getSeverityColor = (i?: number) => {
    if (i === undefined || i === null) return "bg-gray-100 text-gray-600";
    if (i >= 3) return "bg-rose-50 text-rose-700 border-rose-100";
    if (i === 2) return "bg-orange-50 text-orange-700 border-orange-100";
    if (i === 1) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
      <td className="py-4 pr-4 font-semibold text-gray-800">#{complaint.id.substring(0, 5)}</td>
      <td className="py-4 pr-4 text-gray-900">{limitWords(complaint.title, 10)}</td>
      <td className="py-4 pr-4">
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
          {complaint.category}
        </span>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-gray-900">{complaint.studentId}</span>
          <span className="text-xs text-gray-500">{complaint.studentName}</span>
        </div>
      </td>

      <td className="py-4 pr-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium ${getSeverityColor(complaint.severity)}`}>
          {formatSeverity(complaint.severity)}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm text-gray-500">
        {formatDate(complaint.createdAt)}
      </td>
      <td className="py-4 pr-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[complaint.status]}`}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-80" />
          {ComplaintStatusLabels[complaint.status]}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm text-gray-600">
        {formatLocked(complaint.lockedBy)}
      </td>
      <td className="py-4 pr-4">
        <Link
          href={`/list/complaints/${complaint.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          View <span aria-hidden>↗</span>
        </Link>
      </td>
    </tr>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${page === currentPage
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Main Component

export const ComplaintsList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "All">("All");
  const [agencyFilter, setAgencyFilter] = useState<string | "All">("All");
  const [agencies, setAgencies] = useState<Array<{ id: string; name: string }>>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch agencies for filter dropdown
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const token = getToken();
        const result = await apiClient.getAgencies(token);
        setAgencies(result);
      } catch (e) {
        // ignore
      }
    };
    fetchAgencies();
  }, []);

  // Fetch complaints with filters and pagination
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = getToken();
        const params: any = {
          page: currentPage,
          size: PAGE_SIZE,
        };
        if (agencyFilter !== "All") params.agencyId = agencyFilter;
        if (statusFilter !== "All") params.complaintStatus = statusFilter;
        // Optionally add search if API supports it
        const apiComplaints = await apiClient.getComplaints(token, params);
        // Support both paged and array response
        let complaintsArr: ComplaintApiResponse[] = [];
        let total = 0;
        if (Array.isArray(apiComplaints)) {
          complaintsArr = apiComplaints;
          total = complaintsArr.length;
        } else if (apiComplaints && typeof apiComplaints === "object" && Array.isArray((apiComplaints as any).data)) {
          complaintsArr = (apiComplaints as any).data;
          total = typeof (apiComplaints as any).totalCount === "number" ? (apiComplaints as any).totalCount : complaintsArr.length;
        }
        setComplaints(complaintsArr.map(mapComplaintFromApi));
        setTotalCount(total);
        setTotalPages(Math.ceil(total / PAGE_SIZE) || 1);
      } catch (apiError: any) {
        console.error("Failed to load complaints", apiError);
        setError(apiError?.message ?? "Unable to load complaints");
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, [currentPage, agencyFilter, statusFilter]);

  // Filter on client for search only (if API does not support search)
  const filteredComplaints = useMemo(() => {
    if (!search) return complaints;
    const searchLower = search.toLowerCase();
    return complaints.filter(
      (c) =>
        c.id.toLowerCase().includes(searchLower) ||
        c.title.toLowerCase().includes(searchLower)
    );
  }, [complaints, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, agencyFilter]);

  return (

      <section className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title..."
              className="w-full md:w-64 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
            />
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="w-full md:w-44 rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
              title="Filter by agency"
            >
              <option value="All">All Agencies</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>{agency.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
              className="w-full md:w-44 rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
              title="Filter by status"
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-4">
              <ComplaintTableSkeleton />
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="py-3 pr-4 font-medium">ID</th>
                  <th className="py-3 pr-4 font-medium">Title</th>
                  <th className="py-3 pr-4 font-medium">Agency</th>
                  <th className="py-3 pr-4 font-medium">User</th>
                  <th className="py-3 pr-4 font-medium">Severity</th>
                  <th className="py-3 pr-4 font-medium">Created</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Locked</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-sm text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <ComplaintRow key={complaint.id} complaint={complaint} />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filteredComplaints.length > 0 && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        {filteredComplaints.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">Total: {totalCount}</div>
        )}
      </section>
   );
};
