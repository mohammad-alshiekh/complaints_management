import { ComplaintStatus, ComplaintType, Governorate } from "@/enums";

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

export interface ComplaintApiResponse {
  id: string;
  title: string;
  status: number;
  severity: number;
  governmentEntityName: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhoneNumber: string;
  governorate: number;
  lockedBy?: string;
  locationLong: number;
  locationLat: number;
  createdAt: string;
  complaintType?: ComplaintType;
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
  severity?: number;
  complaintType?: ComplaintType;
  type?: ComplaintType;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  summary: string;
  description: string;
  tags: string[];
  attachments: ComplaintAttachment[];
  timeline: ComplaintTimelineEvent[];
  lockedBy?: string;
  // Fields from [id]/page.tsx
  citizenId?: string;
  referenceNumber?: string;
  governmentEntityId?: string;
  locationLong?: number;
  locationLat?: number;
  governorate?: number;
  agencyNotes?: string | null;
  additionalInfoRequest?: string | null;
  rowVersion?: string;
}
