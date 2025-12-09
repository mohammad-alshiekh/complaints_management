"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  complaints,
  complaintPriorityOrder,
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
} from "@/lib/complaints";

// --------------------------------------------------------
// STATUS COLORS
// --------------------------------------------------------
const statusPillStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
  Escalated: "bg-rose-50 text-rose-700 border-rose-100",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Completed: "bg-green-50 text-green-700 border-green-100",
  Canceled: "bg-gray-100 text-gray-600 border-gray-200",
};

// --------------------------------------------------------
// PRIORITY DOTS
// --------------------------------------------------------
const priorityDotStyles: Record<ComplaintPriority, string> = {
  Low: "bg-gray-300",
  Medium: "bg-amber-400",
  High: "bg-orange-500",
  Urgent: "bg-rose-600",
};

// --------------------------------------------------------
// FILTER OPTIONS
// --------------------------------------------------------
export const statusFilters: Array<ComplaintStatus | "All"> = [
  "All",
  ComplaintStatus.Pending,
  ComplaintStatus.InProgress,
  ComplaintStatus.Escalated,
  ComplaintStatus.Resolved,
  ComplaintStatus.Completed,
  ComplaintStatus.Canceled,
];

const ListComplaintsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">(
    "All"
  );

  // --------------------------------------------------------
  // FILTER + SORT
  // --------------------------------------------------------
  const filteredComplaints = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return complaints
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
  }, [search, statusFilter]);

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
              <th className="py-2 pr-4 font-medium">Created</th>
              <th className="py-2 pr-4 font-medium">Updated</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((complaint: Complaint) => (
              <ComplaintRow
                key={complaint.id}
                complaint={complaint}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>

        {filteredComplaints.length === 0 && (
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
