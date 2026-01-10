import { ComplaintStatus, ComplaintType, Governorate } from "@/enums";

export type ComplaintPriority = "Low" | "Medium" | "High" | "Urgent";

export interface ComplaintAttachment {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

export interface AgencyNote {
  note: string;
  createdAt: string;
}

export interface AdditionalInfoRequest {
  requestMessage: string;
  createdAt: string;
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
  referenceNumber: string;
  locationLong: number;
  locationLat: number;
  createdAt: string;
  complaintType?: ComplaintType;
  description?: string;
}

export interface ComplaintVersion {
  id: string;
  complaintId: string;
  versionNumber: number;
  title: string;
  description: string;
  severity: number;
  status: number;
  citizenId: string;
  referenceNumber: string;
  type: number;
  locationLong: number;
  locationLat: number;
  governmentEntityId: string;
  governorate: number;
  lockedBy: string | null;
  modifiedBy: string;
  modifiedAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  category?: string;
  studentName?: string;
  studentClass?: string;
  studentId?: string;
  guardianName?: string;
  email?: string;
  phone?: string;
  status: ComplaintStatus;
  priority?: ComplaintPriority;
  severity?: number;
  complaintType?: ComplaintType;
  type?: ComplaintType;
  createdAt: string;
  updatedAt?: string;
  dueAt?: string;
  summary?: string;
  description: string;
  tags?: string[];
  attachments: ComplaintAttachment[];
  timeline: ComplaintTimelineEvent[];
  lockedBy?: string;
  citizenId?: string;
  referenceNumber?: string;
  governmentEntityId?: string;
  locationLong?: number;
  locationLat?: number;
  governorate?: number;
  agencyNotes?: AgencyNote[] | null;
  additionalInfoRequests?: AdditionalInfoRequest[] | null;
  rowVersion?: string;
}
