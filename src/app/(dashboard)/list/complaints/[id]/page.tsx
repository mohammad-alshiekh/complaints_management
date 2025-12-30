"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HistoryTimeline from "@/components/history-timeline";
import apiClient from "@/app/lib/api";
import { getToken } from "@/lib/auth";
import { 
    ComplaintStatus, 
    ComplaintType, 
    ActionType, 
    ComplaintStatusLabels,
    Governorate,
    GovernorateNames
} from "@/enums";
import { 
    Complaint, 
    ComplaintAttachment as Attachment 
} from "@/models/complaint";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface Props {
    params: { id: string };
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const PRIORITY_STYLES: Record<string, string> = {
    Low: "border-gray-200 text-gray-600 bg-gray-50",
    Medium: "border-amber-200 text-amber-600 bg-amber-50",
    High: "border-orange-200 text-orange-600 bg-orange-50",
    Urgent: "border-rose-200 text-rose-600 bg-rose-50",
};

const STATUS_STYLES: Record<string, string> = {
    [ComplaintStatusLabels[ComplaintStatus.Pending]]: "border-gray-200 text-gray-600 bg-gray-50",
    [ComplaintStatusLabels[ComplaintStatus.InProgress]]: "border-amber-200 text-amber-600 bg-amber-50",
    [ComplaintStatusLabels[ComplaintStatus.Completed]]: "border-green-200 text-green-600 bg-green-50",
    [ComplaintStatusLabels[ComplaintStatus.Rejected]]: "border-rose-200 text-rose-600 bg-rose-50",
};

const STATUS_MAP = ComplaintStatusLabels;

const TYPE_MAP: Record<ComplaintType, string> = {
    [ComplaintType.ServiceQuality]: "Service Quality",
    [ComplaintType.Corruption]: "Corruption",
    [ComplaintType.Delay]: "Delay",
    [ComplaintType.Misconduct]: "Misconduct",
    [ComplaintType.Other]: "Other",
};

const ASSIGNEES = [
    "Unassigned",
    "Government Agency",
    "Inspector",
    "Compliance Officer",
];

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function mapStatus(status: ComplaintStatus): string {
    return STATUS_MAP[status];
}

function mapPriority(severity: number | undefined): string {
    if (!severity) return "Low";
    if (severity === 1) return "Low";
    if (severity === 2) return "Medium";
    if (severity === 3) return "High";
    return "Urgent";
}

function mapType(type: ComplaintType): string {
    return TYPE_MAP[type];
}

const formatLongDate = (value: string | undefined): string =>
    value
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(new Date(value))
        : "—";

const formatShortDate = (value: string | undefined): string =>
    value
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(new Date(value))
        : "—";

const formatFileSize = (size: number): string => {
    const kb = size / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

// ------------------------------------------------------------------
// UI Components
// ------------------------------------------------------------------

const EmptyState = () => (
    <div className="min-h-full bg-[#f7fbfa] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
            <p className="text-2xl font-semibold text-gray-900">Complaint not found</p>
            <p className="text-sm text-gray-500">
                The record you are looking for no longer exists.
            </p>
            <Link
                href="/complaints"
                className="inline-flex rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
                Back to complaints
            </Link>
        </div>
    </div>
);

function Header({ complaint }: { complaint: Complaint | null }) {
    const opened = formatLongDate(complaint?.createdAt);
    const updated = formatLongDate(complaint?.updatedAt);
    return (
        <header className="space-y-2">
            <p className="text-xs uppercase text-gray-500">
                Complaint #{complaint?.referenceNumber ?? complaint?.id}
            </p>
            <h1 className="text-3xl font-semibold text-gray-900 break-words">
                {complaint?.title || "—"}
            </h1>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                <span>Opened {opened}</span>
                <span>•</span>
                <span>Last updated {updated}</span>
            </div>
        </header>
    );
}

function Overview({ complaint }: { complaint: Complaint }) {
    const statusLabel = mapStatus(complaint.status ?? ComplaintStatus.Pending);
    const priorityLabel = mapPriority(complaint.severity);
    const typeLabel = mapType(complaint.type ?? ComplaintType.Other);
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${STATUS_STYLES[statusLabel]}`}>
                    {statusLabel}
                </span>
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${PRIORITY_STYLES[priorityLabel]}`}>
                    Priority: {priorityLabel}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-sm text-gray-900 mb-2">Type</h3>
                    <p className="text-sm text-gray-600">{typeLabel}</p>
                </div>
                <div>
                    <h3 className="font-medium text-sm text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{complaint.description}</p>
                </div>
                <div>
                    <h3 className="font-medium text-sm text-gray-900 mb-2">Location</h3>
                    <p className="text-sm text-gray-600">
                        Lat: {complaint.locationLat}, Long: {complaint.locationLong}, Governorate: {complaint.governorate ? GovernorateNames[complaint.governorate as Governorate] : "N/A"}
                    </p>
                </div>
            </div>
        </section>
    );
}

function Details({ complaint }: { complaint: Complaint }) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Complaint Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-gray-500">Citizen ID</span>
                    <p className="font-medium">{complaint.citizenId}</p>
                </div>
                <div>
                    <span className="text-gray-500">Government Entity</span>
                    <p className="font-medium">{complaint.governmentEntityId}</p>
                </div>
                {complaint.agencyNotes && (
                    <div className="md:col-span-2">
                        <span className="text-gray-500">Agency Notes</span>
                        <p className="font-medium text-gray-600">{complaint.agencyNotes}</p>
                    </div>
                )}
                {complaint.additionalInfoRequest && (
                    <div className="md:col-span-2">
                        <span className="text-gray-500">Additional Info Requested</span>
                        <p className="font-medium text-gray-600">{complaint.additionalInfoRequest}</p>
                    </div>
                )}
                {complaint.lockedBy && (
                    <div>
                        <span className="text-gray-500">Locked By</span>
                        <p className="font-medium">{complaint.lockedBy}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function Attachments({ complaint }: { complaint: Complaint }) {
    const files = complaint.attachments ?? [];
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Attachments</h3>
            {files.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No attachments added.</p>
            ) : (
                <ul className="space-y-2">
                    {files.map((file) => {
                        const name = (file as any).fileName ?? (file as any).name ?? "attachment";
                        const url = (file as any).fileUrl ?? (file as any).url ?? "#";
                        const size = (file as any).fileSize ?? 0;
                        return (
                            <li key={name + url}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-xl border border-gray-200 px-3 py-2 text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    {name} ({formatFileSize(size)})
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

function Timeline({ complaint }: { complaint: Complaint }) {
    // Assume timeline is fetched or part of complaint; fallback to empty
    const events = complaint.timeline ?? [];
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Activity Timeline</h3>
            <HistoryTimeline events={events} />
            {events.length === 0 && (
                <p className="text-sm text-gray-500 italic mt-4">No activity recorded yet.</p>
            )}
        </section>
    );
}

function Related({ complaints }: { complaints: Complaint[] }) {
    if (complaints.length === 0) return null;

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Related Complaints</h3>
            <ul className="space-y-2">
                {complaints.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={`/complaints/${item.id}`}
                            className="block text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                        >
                            #{item.referenceNumber} — {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Actions({
    status,
    assignee,
    onStatusChange,
    onAssigneeChange,
    onSave,
}: {
    status: ComplaintStatus;
    assignee: string;
    onStatusChange: (s: ComplaintStatus) => void;
    onAssigneeChange: (a: string) => void;
    onSave: () => void;
}) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-gray-900">Quick Actions</h3>
            <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(Number(e.target.value) as ComplaintStatus)}
                    aria-label="Status"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                    {Object.entries(STATUS_MAP).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>

                <label className="block text-xs font-medium text-gray-700 mb-1">Assignee</label>
                <select
                    value={assignee}
                    onChange={(e) => onAssigneeChange(e.target.value)}
                    aria-label="Assignee"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                    {ASSIGNEES.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>

                <button
                    onClick={onSave}
                    className="w-full rounded-xl bg-amber-600 text-white py-2 text-sm font-semibold hover:bg-amber-700 transition-colors"
                >
                    Update Complaint
                </button>
            </div>
        </section>
    );
}

function Notes({
    note,
    onChange,
}: {
    note: string;
    onChange: (v: string) => void;
}) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Agency Notes</h3>
            <textarea
                value={note}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Add notes or updates..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[120px] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-vertical"
            />
        </section>
    );
}

function UserInfo({ complaint }: { complaint: Complaint }) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm text-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Citizen Information</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-500">Citizen ID</span>
                    <span className="font-medium">{complaint.citizenId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Reference Number</span>
                    <span className="font-medium">{complaint.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Government Entity ID</span>
                    <span className="font-medium">{complaint.governmentEntityId}</span>
                </div>
            </div>
        </section>
    );
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------

export default function ComplaintDetailsPage({ params }: Props) {
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState<ComplaintStatus>(ComplaintStatus.New);
    const [assignee, setAssignee] = useState(ASSIGNEES[0]);
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);

    const relatedComplaints: Complaint[] = []; // Fetch or compute as needed

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const data = await apiClient.getComplaint(params.id, token);
                if (!mounted) return;
                if (data) {
                    setComplaint(data);
                    setCurrentStatus((data.status ?? ComplaintStatus.New) as ComplaintStatus);
                    setNote(data.agencyNotes ?? "");
                    setAssignee(data.lockedBy ?? ASSIGNEES[0]);
                } else {
                    setComplaint(null);
                }
            } catch (err) {
                console.error("Failed to load complaint:", err);
                setComplaint(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [params.id]);

    const handleSave = async () => {
        if (!complaint) return;
        setSaving(true);
        try {
            const token = getToken();
            const payload = {
                id: complaint.id,
                status: Number(currentStatus),
                agencyNotes: note || null,
                additionalInfoRequest: complaint.additionalInfoRequest ?? null,
            };

            const updated = await apiClient.updateComplaintStatus(payload, token);

            // If API returned updated complaint object, merge it; otherwise apply optimistic update
            if (updated && typeof updated === "object" && updated.id === complaint.id) {
                setComplaint((prev) => ({ ...prev, ...(updated as any) }));
                setCurrentStatus((updated as any).status ?? currentStatus);
                setNote((updated as any).agencyNotes ?? note);
                setAssignee((updated as any).lockedBy ?? (assignee === "Unassigned" ? ASSIGNEES[0] : assignee));
            } else {
                setComplaint((prev) => prev ? { ...prev, status: currentStatus, agencyNotes: note || null, lockedBy: assignee === "Unassigned" ? null : assignee } : prev);
            }
        } catch (err) {
            console.error("Failed to update complaint:", err);
            // Handle error (e.g., toast)
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-full bg-[#f7fbfa] flex items-center justify-center p-6">
                <div className="text-lg text-gray-600">Loading complaint details...</div>
            </div>
        );
    }

    if (!complaint) return <EmptyState />;

    return (
        <div className="min-h-full bg-[#f7fbfa] p-4 md:p-6 space-y-6">
            <Header complaint={complaint} />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <main className="space-y-6">
                    <Overview complaint={complaint} />
                    <Details complaint={complaint} />
                    <Attachments complaint={complaint} />
                    <Timeline complaint={complaint} />
                    <Related complaints={relatedComplaints} />
                </main>

                <aside className="space-y-6 lg:sticky lg:top-6 self-start">
                    <Actions
                        status={currentStatus}
                        assignee={assignee}
                        onStatusChange={setCurrentStatus}
                        onAssigneeChange={setAssignee}
                        onSave={handleSave}
                    />
                    <Notes note={note} onChange={setNote} />
                    <UserInfo complaint={complaint} />
                </aside>
            </div>
        </div>
    );
}