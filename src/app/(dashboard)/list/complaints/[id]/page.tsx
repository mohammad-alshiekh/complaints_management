// // app/students/[id]/page.tsx
// "use client";
// import Image from "next/image";
// import ComplianceCalender from "@/components/big-calandar";
// import AnnouncementsComponent from "@/components/announcements-componenet";
// import Link from "next/link";

// const teacherData = {
//   name: "Dean Guerrero",
//   email: "einar@gmail.com",
//   phone: "+1543 235 64",
//   attendance: 90,
//   branches: 2,
//   lessons: 12,
//   clients: 14,
// };

// const shortcuts = [
//   { label: " Classes", href: "#", color: "red-100" },
//   { label: " Students", href: "#", color: "green-100" },
//   { label: " Lessons", href: "#", color: "yellow-100" },
//   { label: " Exams", href: "#", color: "orange-100" },
//   { label: " Assignments", href: "#", color: "purple-100" },
// ];

// const SingleTeacherPage = () => {
//   return (
//     <div className="flex-1 xl:flex-row gap-4 flex flex-col p-4">
//       <div className="w-full lg:w-2/3">
//         {/*TOP => Profile Section */}
//         <div className="flex md:flex-row flex-col">
//           {/*User Info card*/}
//           <div className="flex-1 gap-4 bg-cyanx rounded-md py-6 px-4">
//             <div className="w-1/3">
//               <Image
//                 src="/avatar.png"
//                 alt="Teacher Avatar"
//                 width={122}
//                 height={122}
//                 className="rounded-full object-over h-36 w-36"
//               />
//             </div>

//             <div className="w-2/3">
//               <h2 className="text-md font-semibold">{teacherData.name}</h2>
//               <p className="text-xs text-gray-500">
//                 Lorem ipsum dolor sit amet...
//               </p>

//               <div className="flex items-center justify-between flex-wrap text-xs fomt-medium  gap-2 ">
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image
//                     src="/blood.png"
//                     alt="Teacher Avatar"
//                     width={14}
//                     height={14}
//                   />
//                   <span>A+</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image
//                     src="/date.png"
//                     alt="Teacher Avatar"
//                     width={14}
//                     height={14}
//                   />
//                   <span>2002/2/2</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image
//                     src="/mail.png"
//                     alt="Teacher Avatar"
//                     width={14}
//                     height={14}
//                   />
//                   <span>user@gamail.com</span>
//                 </div>
//                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
//                   <Image
//                     src="/phone.png"
//                     alt="Teacher Avatar"
//                     width={14}
//                     height={14}
//                   />
//                   <span>+1 231123213</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-wrap justify-between gap-4">
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleAttendance.png"
//                 alt=""
//                 width={22}
//                 height={22}
//                 className=" h-6 w-6"
//               />
//               <div className="flex flex-col ml-2">
//                 <p className="text-xl font-semibold">
//                   {teacherData.attendance}
//                 </p>
//                 <p className="text-xs  text-gray-400">Attendance</p>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singlelesson.png"
//                 alt=""
//                 width={22}
//                 height={22}
//                 className=" h-6 w-6"
//               />
//               <div className="flex flex-col ml-2">
//                 <p className="text-xl font-semibold">
//                   {teacherData.attendance}
//                 </p>
//                 <p className="text-xs  text-gray-400">Lesson</p>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleBranch.png"
//                 alt=""
//                 width={22}
//                 height={22}
//                 className=" h-6 w-6"
//               />
//               <div className="flex flex-col ml-2">
//                 <p className="text-xl font-semibold">
//                   {teacherData.attendance}
//                 </p>
//                 <p className="text-xs  text-gray-400">Branch</p>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[45%] 2xl:w-[48%]">
//               <Image
//                 src="/singleClass.png"
//                 alt=""
//                 width={22}
//                 height={22}
//                 className=" h-6 w-6"
//               />
//               <div className="flex flex-col ml-2">
//                 <p className="text-xl font-semibold">
//                   {teacherData.attendance}
//                 </p>
//                 <p className="text-xs  text-gray-400">Class</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Schedule Section */}
//         <ComplianceCalender />
//       </div>

//       {/* Shortcuts and Announcements Section */}
//       <div className="w-full xl:w-1/3 flex flex-col gap-4">
//         <div className="bg-white rounded-md p-4">
//           <h2 className="text-xl font-semibold mb-4">Shortcuts</h2>
//           <div className="flex flex-wrap text-xs text-gary-500 gap-4">
//             {shortcuts.map((shortcut) => (
//               <Link
//                 key={shortcut.label}
//                 href={shortcut.href}
//                 style={{ backgroundColor: "red-100" }}
//                 className="p-3 rounded-md text-center bg-pink-200"
//               >
//                 {shortcut.label}
//               </Link>
//             ))}
//           </div>
//         </div>

//         <h2 className="text-xl font-semibold mt-6 mb-4">Announcements</h2>
//         <AnnouncementsComponent />
//       </div>
//     </div>
//   );
// };
// export default SingleTeacherPage;
// pages/complaints/[id].tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getComplaintById,
  complaints,
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
} from "@/lib/complaints";
import HistoryTimeline from "@/components/history-timeline";

const statusBadgeStyles: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: "bg-yellow-50 text-yellow-700 border-yellow-100",
  [ComplaintStatus.InProgress]: "bg-blue-50 text-blue-700 border-blue-100",
  [ComplaintStatus.Completed]: "bg-green-50 text-green-700 border-green-100",
  [ComplaintStatus.Rejected]: "bg-rose-50 text-rose-700 border-rose-100",
};

const priorityBorderStyles: Record<ComplaintPriority, string> = {
  Low: "border-gray-200 text-gray-600",
  Medium: "border-amber-200 text-amber-600",
  High: "border-orange-200 text-orange-600",
  Urgent: "border-rose-200 text-rose-600",
};

const assignees = [
  "Academic Coordinator",
  "Branch Principal",
  "Transport Lead",
  "Facilities Manager",
];

const formatDateLong = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(value));

const formatDateShort = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const EmptyState = () => (
  <div className="min-h-full bg-[#f7fbfa] flex items-center justify-center p-6">
    <div className="max-w-md text-center space-y-4">
      <p className="text-2xl font-semibold text-gray-900">
        Complaint not found
      </p>
      <p className="text-sm text-gray-500">
        The record you are looking for no longer exists. Return to the list to
        select another complaint.
      </p>
      <Link
        href="/list/complaints"
        className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold"
      >
        Back to complaints
      </Link>
    </div>
  </div>
);

interface ComplaintPageProps {
  params: { id: string };
}

export default function ComplaintDetailsPage({ params }: ComplaintPageProps) {
  const complaint = getComplaintById(params.id);
  const [status, setStatus] = useState<ComplaintStatus>(
    complaint?.status ?? ComplaintStatus.Pending
  );
  const [assignee, setAssignee] = useState(assignees[0]);
  const [note, setNote] = useState("");

  const relatedComplaints = useMemo(() => {
    if (!complaint) return [];
    return complaints
      .filter(
        (item) =>
          item.id !== complaint.id && item.category === complaint.category
      )
      .slice(0, 3);
  }, [complaint]);

  if (!complaint) return <EmptyState />;

  return (
    <div className="min-h-full bg-[#f7fbfa] p-4 md:p-6 space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase text-gray-500 tracking-wide">
          Complaint #{complaint.id}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">
          {complaint.title}
        </h1>
        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
          <span>Opened {formatDateLong(complaint.createdAt)}</span>
          <span>•</span>
          <span>Last updated {formatDateLong(complaint.updatedAt)}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold bg-white text-gray-700 border-gray-200">
            Category: {complaint.category}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Current status</p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusBadgeStyles[complaint.status]}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                  {complaint.status}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${priorityBorderStyles[complaint.priority]}`}
              >
                Priority: {complaint.priority}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Created",
                  value: formatDateShort(complaint.createdAt),
                },
                { label: "Due", value: formatDateShort(complaint.dueAt) },
                {
                  label: "Guardian",
                  value: complaint.guardianName,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Summary</p>
              <p className="text-sm text-gray-600">{complaint.summary}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Detailed context
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {complaint.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {complaint.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {complaint.attachments.length > 0 && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  Attachments
                </p>
                <span className="text-xs text-gray-500">
                  {complaint.attachments.length} files
                </span>
              </div>
              <div className="space-y-3">
                {complaint.attachments.map((file) => (
                  <a
                    key={file.name}
                    href={file.url}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-700 hover:border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-semibold text-gray-500">
                        {file.type === "image" ? "IMG" : "PDF"}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          Tap to preview
                        </span>
                      </div>
                    </div>
                    <span aria-hidden className="text-gray-400">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">Timeline</p>
              <span className="text-xs text-gray-500">
                {complaint.timeline.length} updates
              </span>
            </div>
            <HistoryTimeline events={complaint.timeline} />
          </section>

          {relatedComplaints.length > 0 && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  Similar cases
                </p>
                <Link
                  href="/list/complaints"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {relatedComplaints.map((item) => (
                  <Link
                    key={item.id}
                    href={`/list/complaints/${item.id}`}
                    className="flex flex-col rounded-xl border border-gray-100 px-3 py-2 text-sm hover:border-gray-200"
                  >
                    <span className="text-xs text-gray-400">
                      #{item.id} · {item.status}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.studentName}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-gray-900">Take action</p>
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-500">
                Update status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ComplaintStatus)
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
              >
                {Object.keys(statusBadgeStyles).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button className="w-full rounded-xl bg-gray-900 text-white text-sm font-semibold px-4 py-2 hover:bg-gray-800">
                Save status
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-500">
                Assign to
              </label>
              <select
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
              >
                {assignees.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-gray-900">Add note</p>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add internal note for the support team..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[120px] focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
            />
            <button className="w-full rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 px-4 py-2 hover:border-gray-300">
              Record note
            </button>
          </section>
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-gray-900">User info</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex justify-between">
                <span className="text-gray-500">User Name</span>
                <span className="font-medium">{complaint.studentName}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-500">User ID</span>
                <span className="font-medium">{complaint.studentId}</span>
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{complaint.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{complaint.phone}</span>
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
