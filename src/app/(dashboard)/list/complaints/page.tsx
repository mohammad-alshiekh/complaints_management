"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  complaints,
  complaintStats,
  complaintPriorityOrder,
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
} from "@/lib/complaints";

const statusPillStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
  Escalated: "bg-rose-50 text-rose-700 border-rose-100",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Canceled: "bg-gray-50 text-gray-600 border-gray-200",
};

const priorityDotStyles: Record<ComplaintPriority, string> = {
  Low: "bg-gray-300",
  Medium: "bg-amber-400",
  High: "bg-orange-500",
  Urgent: "bg-rose-600",
};

const statusFilters: Array<ComplaintStatus | "All"> = [
  "All",
  "Pending",
  "In Progress",
  "Escalated",
  "Resolved",
];

const ListComplaintsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "All">(
    "All"
  );
  const [sortKey, setSortKey] = useState<"updated" | "priority">("updated");

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
      .sort((a: Complaint, b: Complaint) => {
        if (sortKey === "updated") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        return (
          complaintPriorityOrder.indexOf(b.priority) -
          complaintPriorityOrder.indexOf(a.priority)
        );
      });
  }, [search, statusFilter, sortKey]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(value));

  return (
    <div className="min-h-full bg-[#f7fbfa] p-4 md:p-6 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase text-gray-500 tracking-wide">
          Complaints
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Guardian Complaints
            </h1>
            <p className="text-sm text-gray-500">
              Monitor escalations, track owner updates, and act before SLA
              breaches.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white text-sm font-semibold px-4 py-2 hover:bg-gray-800">
            + New complaint
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {complaintStats.map((stat: { label: string; value: number | string; meta: string }) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs uppercase text-gray-400 tracking-wide">
              {stat.label}
            </p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.meta}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 text-sm rounded-full border transition ${
                  statusFilter === filter
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student, title, or ID"
              className="w-full md:w-64 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
            />
            <select
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as "updated" | "priority")
              }
              className="w-full md:w-44 rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
            >
              <option value="updated">Sort by last update</option>
              <option value="priority">Sort by priority</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                {[
                  "Complaint",
                  "Student",
                  "Status",
                  "Priority",
                  "Updated",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="py-2 pr-4 font-medium">
                    {heading}
                  </th>
                ))}
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
    </div>
  );
};

const ComplaintRow = ({
  complaint,
  formatDate,
}: {
  complaint: Complaint;
  formatDate: (value: string) => string;
}) => {
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="py-4 pr-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">#{complaint.id}</span>
            <span className="text-xs rounded-full bg-gray-100 text-gray-600 px-2 py-0.5">
              {complaint.category}
            </span>
          </div>
          <p className="font-semibold text-gray-900">{complaint.title}</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {complaint.summary}
          </p>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col text-sm">
          <span className="font-medium text-gray-900">
            {complaint.studentName}
          </span>
          <span className="text-gray-500">{complaint.studentClass}</span>
        </div>
      </td>
      <td className="py-4 pr-4">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusPillStyles[complaint.status]}`}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-80" />
          {complaint.status}
        </span>
      </td>
      <td className="py-4 pr-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
          <span
            className={`h-2 w-2 rounded-full ${priorityDotStyles[complaint.priority]}`}
          />
          {complaint.priority}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm text-gray-500">
        {formatDate(complaint.updatedAt)}
      </td>
      <td className="py-4 pr-4">
        <Link
          href={`/list/complaints/${complaint.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-300"
        >
          View
          <span aria-hidden>↗</span>
        </Link>
      </td>
    </tr>
  );
};

export default ListComplaintsPage;
