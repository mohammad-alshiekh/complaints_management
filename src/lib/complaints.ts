 

export type ComplaintPriority = "Low" | "Medium" | "High" | "Urgent";

export interface ComplaintAttachment {
  name: string;
  url: string;
  type: "image" | "document";
}

export interface ComplaintTimelineEvent {
  timestamp: string;
  actor: string;
  action: string;
  note?: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: string;
  studentName: string;
  studentClass: string;
  studentId: string;
  guardianName: string;
  email: string;
  phone: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  summary: string;
  description: string;
  tags: string[];
  attachments: ComplaintAttachment[];
  timeline: ComplaintTimelineEvent[];
}
export enum ComplaintStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Escalated = "Escalated",
  Resolved = "Resolved",
  Completed = "Completed",
  Canceled = "Canceled",
}

export const complaints: Complaint[] = [
  {
    id: "9823",
    title: "Teacher not responding to homework portal",
    category: "Communication",
    studentName: "Layla Hussain",
    studentClass: "Grade 7B",
    studentId: "ST-22134",
    guardianName: "Omar Hussain",
    email: "omar.hussain@example.com",
    phone: "+971 50 234 9981",
    status: ComplaintStatus.Pending,
    priority: "High",
    createdAt: "2025-11-12T09:15:00Z",
    updatedAt: "2025-11-17T08:10:00Z",
    dueAt: "2025-11-20T00:00:00Z",
    summary:
      "Guardian reports that class advisor has not been replying to homework-related questions for the past week.",
    description:
      "Layla was unable to submit the last two math assignments because clarifications sent through the homework portal remained unanswered. Guardian escalated after noticing the zero submission notice. Requested immediate response and an alternate escalation path.",
    tags: ["Grade 7", "Math", "Portal"],
    attachments: [
      { name: "portal-log.png", url: "/images.png", type: "image" },
      { name: "parent-email.pdf", url: "/complaints.png", type: "document" },
    ],
    timeline: [
      {
        timestamp: "2025-11-12T09:15:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
      {
        timestamp: "2025-11-13T15:42:00Z",
        actor: "Support",
        action: "Assigned to academic coordinator",
      },
      {
        timestamp: "2025-11-16T11:20:00Z",
        actor: "Academic Coordinator",
        action: "Status changed to In Progress",
        note: "Awaiting teacher response, follow-up sent.",
      },
    ],
  },
  {
    id: "9827",
    title: "Bus arrival time inconsistency",
    category: "Transportation",
    studentName: "Youssef Al Nuaimi",
    studentClass: "Grade 5A",
    studentId: "ST-22931",
    guardianName: "Sara Al Nuaimi",
    email: "sara.nuaimi@example.com",
    phone: "+971 56 876 2451",
    status: ComplaintStatus.Pending,
    priority: "Medium",
    createdAt: "2025-11-15T06:00:00Z",
    updatedAt: "2025-11-16T06:00:00Z",
    dueAt: "2025-11-22T00:00:00Z",
    summary:
      "Morning bus arrived 20+ minutes late three times in the last week.",
    description:
      "Bus route 5B has been inconsistent since the new driver joined. Students wait outside with no updates. Guardian is asking for clear communication and ETA alerts.",
    tags: ["Transport", "Route 5B"],
    attachments: [{ name: "tracking.csv", url: "/complaints.png", type: "document" }],
    timeline: [
      {
        timestamp: "2025-11-15T06:00:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
    ],
  },
  {
    id: "9829",
    title: "Cafeteria hygiene concerns",
    category: "Facilities",
    studentName: "Maya Farid",
    studentClass: "Grade 8C",
    studentId: "ST-22871",
    guardianName: "Farid Hassan",
    email: "farid.hassan@example.com",
    phone: "+971 50 288 1290",
    status: ComplaintStatus.Canceled,
    priority: "Urgent",
    createdAt: "2025-11-10T11:32:00Z",
    updatedAt: "2025-11-17T09:45:00Z",
    dueAt: "2025-11-18T00:00:00Z",
    summary:
      "Multiple students from the same class felt sick after lunch on Monday.",
    description:
      "Parent shared photos showing improper food storage. Health & Safety requested a joint inspection with Facilities. Complaint escalated to executive level.",
    tags: ["Health", "Inspection"],
    attachments: [
      { name: "cafeteria.jpg", url: "/images.png", type: "image" },
      { name: "health-report.pdf", url: "/complaints.png", type: "document" },
    ],
    timeline: [
      {
        timestamp: "2025-11-10T11:32:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
      {
        timestamp: "2025-11-12T08:10:00Z",
        actor: "Facilities",
        action: "Status changed to In Progress",
        note: "Inspection scheduled with vendor.",
      },
      {
        timestamp: "2025-11-16T14:40:00Z",
        actor: "Executive Office",
        action: "Escalated to urgent",
        note: "Awaiting external lab report.",
      },
    ],
  },
  {
    id: "9831",
    title: "Request for assignment extension",
    category: "Academics",
    studentName: "Rami Siddiqui",
    studentClass: "Grade 9A",
    studentId: "ST-22401",
    guardianName: "Nadia Siddiqui",
    email: "nadia.siddiqui@example.com",
    phone: "+971 52 301 8552",
    status: ComplaintStatus.Completed,
    priority: "Low",
    createdAt: "2025-11-05T07:50:00Z",
    updatedAt: "2025-11-08T09:10:00Z",
    dueAt: "2025-11-09T00:00:00Z",
    summary:
      "Student missed submission because of participation in national science fair.",
    description:
      "Guardian requested flexibility for two assignments. Homeroom teacher approved extension and recorded it in LMS.",
    tags: ["LMS", "Grade 9"],
    attachments: [],
    timeline: [
      {
        timestamp: "2025-11-05T07:50:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
      {
        timestamp: "2025-11-07T13:05:00Z",
        actor: "Academic Coordinator",
        action: "Provided extension letter",
      },
      {
        timestamp: "2025-11-08T09:10:00Z",
        actor: "System",
        action: "Marked as resolved",
      },
    ],
  },
  {
    id: "9834",
    title: "Library books unavailable",
    category: "Resources",
    studentName: "Hiba Abdulrahman",
    studentClass: "Grade 6C",
    studentId: "ST-22350",
    guardianName: "Abdulrahman Saad",
    email: "abdulrahman.saad@example.com",
    phone: "+971 55 778 3421",
    status: ComplaintStatus.InProgress,
    priority: "Low",
    createdAt: "2025-11-14T10:00:00Z",
    updatedAt: "2025-11-15T10:00:00Z",
    dueAt: "2025-11-25T00:00:00Z",
    summary:
      "Advance Arabic textbooks have been checked out for weeks, no waitlist updates.",
    description:
      "Guardian suggests increasing copies for popular titles and wants an ETA on currently unavailable books.",
    tags: ["Library", "Arabic"],
    attachments: [],
    timeline: [
      {
        timestamp: "2025-11-14T10:00:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
    ],
  },
  {
    id: "9831",
    title: "Request for assignment extension",
    category: "Academics",
    studentName: "Rami Siddiqui",
    studentClass: "Grade 9A",
    studentId: "ST-22401",
    guardianName: "Nadia Siddiqui",
    email: "nadia.siddiqui@example.com",
    phone: "+971 52 301 8552",
    status: ComplaintStatus.Escalated,
    priority: "Low",
    createdAt: "2025-11-05T07:50:00Z",
    updatedAt: "2025-11-08T09:10:00Z",
    dueAt: "2025-11-09T00:00:00Z",
    summary:
      "Student missed submission because of participation in national science fair.",
    description:
      "Guardian requested flexibility for two assignments. Homeroom teacher approved extension and recorded it in LMS.",
    tags: ["LMS", "Grade 9"],
    attachments: [],
    timeline: [
      {
        timestamp: "2025-11-05T07:50:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
      {
        timestamp: "2025-11-07T13:05:00Z",
        actor: "Academic Coordinator",
        action: "Provided extension letter",
      },
      {
        timestamp: "2025-11-08T09:10:00Z",
        actor: "System",
        action: "Marked as resolved",
      },
    ],
  },
  {
    id: "9831",
    title: "Request for assignment extension",
    category: "Academics",
    studentName: "Rami Siddiqui",
    studentClass: "Grade 9A",
    studentId: "ST-22401",
    guardianName: "Nadia Siddiqui",
    email: "nadia.siddiqui@example.com",
    phone: "+971 52 301 8552",
    status: ComplaintStatus.Resolved,
    priority: "Low",
    createdAt: "2025-11-05T07:50:00Z",
    updatedAt: "2025-11-08T09:10:00Z",
    dueAt: "2025-11-09T00:00:00Z",
    summary:
      "Student missed submission because of participation in national science fair.",
    description:
      "Guardian requested flexibility for two assignments. Homeroom teacher approved extension and recorded it in LMS.",
    tags: ["LMS", "Grade 9"],
    attachments: [],
    timeline: [
      {
        timestamp: "2025-11-05T07:50:00Z",
        actor: "Parent Portal",
        action: "Complaint created",
      },
      {
        timestamp: "2025-11-07T13:05:00Z",
        actor: "Academic Coordinator",
        action: "Provided extension letter",
      },
      {
        timestamp: "2025-11-08T09:10:00Z",
        actor: "System",
        action: "Marked as resolved",
      },
    ],
  },
];

 

export const complaintPriorityOrder: ComplaintPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const getComplaintById = (id: string) =>
  complaints.find((complaint) => complaint.id === id);

export const complaintStats = [
  {
    label: "Open complaints",
    value: complaints.filter((c) => c.status !== "Resolved").length,
    meta: "Rolling 7 days",
  },
  {
    label: "High priority",
    value: complaints.filter((c) => c.priority === "High" || c.priority === "Urgent").length,
    meta: "Need immediate follow-up",
  },
  {
    label: "Avg. resolution",
    value: "2.4 days",
    meta: "Last 30 days",
  },
  {
    label: "Completed",
    value: complaints.filter((c) => c.status ===ComplaintStatus.Completed).length,
    meta: "Require leadership visibility",
  },
];


