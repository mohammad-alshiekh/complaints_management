"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  complaints,
  complaintPriorityOrder,
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintApiResponse,
} from "@/lib/complaints";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";

// STATUS COLORS
// --------------------------------------------------------
const statusPillStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
   Completed: "bg-green-50 text-green-700 border-green-100",
   Rejected: "bg-rose-50 text-rose-700 border-rose-100",

};

 
const statusFilters: Array<ComplaintStatus | "All"> = [
  "All",
  ComplaintStatus.Pending,
  ComplaintStatus.InProgress,
   ComplaintStatus.Completed,
  ComplaintStatus.Rejected,
];

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
  complaintType: apiComplaint.complaintType,
  createdAt: apiComplaint.createdAt,
  updatedAt: apiComplaint.createdAt,
  dueAt: apiComplaint.createdAt,
  summary: apiComplaint.title,
  description: apiComplaint.title,
  tags: [],
  attachments: [],
  timeline: [],
});

const ListComplaintsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">(
    "All"
  );
  const [complaintData, setComplaintData] = useState<Complaint[]>(complaints);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = getToken();
        const apiComplaints = await apiClient.getComplaints(token);
        setComplaintData(apiComplaints.map(mapComplaintFromApi));
        setError(null);
      } catch (apiError: any) {
        console.error("Failed to load complaints", apiError);
        setError(apiError?.message ?? "Unable to load complaints");
        setComplaintData(complaints);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // --------------------------------------------------------
  // FILTER + SORT
  // --------------------------------------------------------
  const filteredComplaints = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return complaintData
      .filter((complaint: Complaint) => {
        const matchesStatus =
          statusFilter === "All" || complaint.status === statusFilter;

        const matchesSearch =
          complaint.title.toLowerCase().includes(lowerSearch) ||
          complaint.studentName.toLowerCase().includes(lowerSearch) ||
          complaint.id.includes(lowerSearch);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        return (
          complaintPriorityOrder.indexOf(b.priority) -
          complaintPriorityOrder.indexOf(a.priority)
        );
      });
  }, [search, statusFilter, complaintData]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(value));

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">

      {/* --------------------------------------------------------
          SEARCH + FILTER BAR
      -------------------------------------------------------- */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div></div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center lg:ml-auto">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by ID, title"
            className="w-full md:w-64 rounded-xl border border-gray-200 px-3 py-2 text-sm 
                       focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
          />

          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as ComplaintStatus | "All"
                )
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white 
                         focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
            >
              {statusFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* --------------------------------------------------------
          TABLE
      -------------------------------------------------------- */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
              <th className="py-2 pr-4 font-medium">ID</th>
              <th className="py-2 pr-4 font-medium">Title</th>
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">User</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Severity</th>
              <th className="py-2 pr-4 font-medium">Created</th>
              <th className="py-2 pr-4 font-medium">Updated</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-sm text-gray-500"
                >
                  Loading complaints...
                </td>
              </tr>
            )}

            {!isLoading &&
              filteredComplaints.map((complaint: Complaint) => (
                <ComplaintRow
                  key={complaint.id}
                  complaint={complaint}
                  formatDate={formatDate}
                />
              ))}
          </tbody>
        </table>

        {!isLoading && filteredComplaints.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-500">
            No complaints match your filters.
          </div>
        )}
      </div>

    </section>
  );
};

// --------------------------------------------------------
// ROW COMPONENT
// --------------------------------------------------------
const ComplaintRow = ({
  complaint,
  formatDate,
}: {
  complaint: Complaint;
  formatDate: (value: string) => string;
}) => {
  const limitWords = (text: string, maxWords: number) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  const formatType = (type?: any) => {
    if (type === undefined || type === null) return "N/A";
    const map: Record<number, string> = {
      0: "ServiceQuality",
      1: "Corruption",
      2: "Delay",
      3: "Misconduct",
      99: "Other",
    };
    return map[type] ?? "Other";
  };

  const formatSeverity = (severity?: number) => {
    if (severity === undefined || severity === null) return "N/A";
    return severity.toString();
  };

  return (
    <tr className="border-b border-gray-50 last:border-0">

      {/* ID */}
      <td className="py-4 pr-4 font-semibold text-gray-800">#{complaint.id}</td>

      {/* Title */}
      <td className="py-4 pr-4 text-gray-900">
        {limitWords(complaint.title, 10)}
      </td>

      {/* Category */}
      <td className="py-4 pr-4">
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
          {complaint.category}
        </span>
      </td>

      {/* USER ID + NAME */}
      <td className="py-4 pr-4">
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-gray-900">
            {complaint.studentId}
          </span>
          <span className="text-xs text-gray-500">{complaint.studentName}</span>
        </div>
      </td>

      {/* Type */}
      <td className="py-4 pr-4 text-sm text-gray-600">
        {formatType(complaint.complaintType)}
      </td>

      {/* Severity */}
      <td className="py-4 pr-4 text-sm text-gray-600">
        {formatSeverity(complaint.severity)}
      </td>

      {/* Created */}
      <td className="py-4 pr-4 text-sm text-gray-500">
        {formatDate(complaint.createdAt)}
      </td>

      {/* Updated */}
      <td className="py-4 pr-4 text-sm text-gray-500">
        {formatDate(complaint.updatedAt)}
      </td>

      {/* Status */}
      <td className="py-4 pr-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusPillStyles[complaint.status]}`}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-80" />
          {complaint.status}
        </span>
      </td>

      {/* Action */}
      <td className="py-4 pr-4">
        <Link
          href={`/list/complaints/${complaint.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300"
        >
          View <span aria-hidden>↗</span>
        </Link>
      </td>
    </tr>
  );
};

export default ListComplaintsPage;
