 "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HistoryTimeline from "@/components/history-timeline";
import apiClient from "@/app/lib/api";
import { getToken, getUser } from "@/lib/auth";
import { toast } from "sonner";
import { 
    ComplaintStatus, 
    ComplaintType, 
    ComplaintStatusLabels,
    GovernorateNames
} from "@/enums";
import { 
    Send,
    MessageSquare,
    User,
    Clock,
    X,
    Download,
    Eye,
    FileText,
    ChevronRight,
    ArrowLeft,
    Calendar,
    MapPin,
    Shield,
    AlertCircle,
    CheckCircle2,
    Lock,
    Unlock,
    ExternalLink,
    MoreHorizontal,
    BadgeCheck,
    Briefcase,
    FileSearch,
    History
} from "lucide-react";
import { 
    Complaint, 
    ComplaintAttachment as Attachment,
    ComplaintVersion
} from "@/models/complaint";

// ------------------------------------------------------------------
// Types & Constants
// ------------------------------------------------------------------

interface Props {
    params: { id: string };
}

const PRIORITY_STYLES: Record<string, string> = {
    Low: "bg-slate-100 text-slate-700 border-slate-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-orange-50 text-orange-700 border-orange-200",
    Urgent: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_STYLES: Record<string, string> = {
    [ComplaintStatusLabels[ComplaintStatus.Pending]]: "bg-slate-100 text-slate-700 border-slate-200",
    [ComplaintStatusLabels[ComplaintStatus.InProgress]]: "bg-blue-50 text-blue-700 border-blue-200",
    [ComplaintStatusLabels[ComplaintStatus.Completed]]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [ComplaintStatusLabels[ComplaintStatus.Rejected]]: "bg-rose-50 text-rose-700 border-rose-200",
};

const TYPE_MAP: Record<ComplaintType, string> = {
    [ComplaintType.ServiceQuality]: "Service Quality",
    [ComplaintType.Corruption]: "Corruption",
    [ComplaintType.Delay]: "Delay",
    [ComplaintType.Misconduct]: "Misconduct",
    [ComplaintType.Other]: "Other",
};

const ASSIGNEES = ["Unassigned", "Government Agency", "Inspector", "Compliance Officer"];
const API_BASE_URL = "https://complaint.runasp.net";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

const mapStatus = (status: ComplaintStatus) => ComplaintStatusLabels[status];
const mapType = (type: ComplaintType) => TYPE_MAP[type];
const mapPriority = (severity: number | undefined): string => {
    if (!severity || severity === 1) return "Low";
    if (severity === 2) return "Medium";
    if (severity === 3) return "High";
    return "Urgent";
};

const formatDate = (date: string | undefined, format: "long" | "short" = "long") => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", format === "long" ? {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
    } : { month: "short", day: "numeric" }).format(new Date(date));
};

const formatFileSize = (size: number): string => {
    const kb = size / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

// ------------------------------------------------------------------
// UI Components
// ------------------------------------------------------------------

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${className}`}>
            {children}
        </span>
    );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>
             </div>
        </div>
    );
}

function VersionsModal({ versions, isLoading, onClose }: { versions: ComplaintVersion[], isLoading: boolean, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Complaint Version History</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking all system modifications</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving History...</p>
                        </div>
                    ) : versions.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <History className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-slate-500 font-medium">No previous versions found for this complaint.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {versions.map((v) => {
                                const status = mapStatus(v.status as ComplaintStatus);
                                const priority = mapPriority(v.severity);
                                return (
                                    <div key={v.id} className="group relative pl-8 border-l-2 border-slate-100 hover:border-indigo-200 transition-colors py-2">
                                        <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-indigo-400 transition-colors" />
                                        
                                        <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-sm transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                        v{v.versionNumber}
                                                    </span>
                                                    <h4 className="font-bold text-slate-900 truncate max-w-[200px]">{v.title}</h4>
                                                </div>
                                                <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-100">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(v.modifiedAt)}
                                                </time>
                                            </div>

                                            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                                                {v.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                <Badge className={STATUS_STYLES[status] || ""}>{status}</Badge>
                                                <Badge className={PRIORITY_STYLES[priority] || ""}>{priority}</Badge>
                                                <Badge className="bg-white text-slate-500 border-slate-100 lowercase">
                                                    modified by: <span className="font-mono ml-1">{v.modifiedBy.slice(0, 8)}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-50 shrink-0 bg-slate-50/30">
                    <button onClick={onClose} className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white hover:border-slate-300 transition-all active:scale-95">
                        Close History View
                    </button>
                </div>
            </Card>
        </div>
    );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

function ImageWithLoading({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 cursor-pointer group" onClick={onClick}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
            </div>
        </div>
    );
}

function ImageModal({ src, alt, isOpen, onClose }: { src: string; alt: string; isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
            <button className="absolute top-6 right-6 p-3 text-white/60 hover:text-white transition-colors bg-white/10 rounded-full">
                <X className="w-6 h-6" />
            </button>
            <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />
        </div>
    );
}

const EmptyState = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100">
            <AlertCircle className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Complaint Not Found</h2>
        <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">
            The record you are looking for might have been moved or deleted from our system.
        </p>
        <Link href="/list/complaints" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-8 py-4 text-sm font-bold hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-95">
            <ArrowLeft className="w-4 h-4" />
            Back to All Complaints
        </Link>
    </div>
);

// ------------------------------------------------------------------
// Main Page Sections
// ------------------------------------------------------------------

function Header({ complaint, isTakingOwnership, onOwnershipToggle, onLoadVersions }: { 
    complaint: Complaint; 
    isTakingOwnership: boolean; 
    onOwnershipToggle: () => void;
    onLoadVersions: () => void;
}) {
    const user = getUser();
    const currentUserId = user?.userId;
    const isLocked = !!complaint.lockedBy;
    const isLockedByMe = complaint.lockedBy === currentUserId;
    const isLockedByOthers = isLocked && !isLockedByMe;

    return (
        <header className="space-y-8">
            <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <Link href="/list/complaints" className="hover:text-slate-900 transition-colors">Complaints</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">Details</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-400 font-mono">#{complaint.referenceNumber || complaint.id.slice(0, 8)}</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-2xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">
                            {complaint.title || "Untitled Complaint"}
                        </h1>
                        {isLocked && (
                            <Badge className={`${isLockedByMe ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"} flex items-center gap-1.5 py-0.6 px-2`}>
                                <Shield className="w-3 h-3" />
                                {isLockedByMe ? "Locked by You" : "Locked by Agency"}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onOwnershipToggle}
                        disabled={isTakingOwnership || isLockedByOthers}
                        className={`group relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
                            isLocked 
                            ? isLockedByMe
                                ? "bg-white text-rose-600 border-2 border-rose-100 hover:bg-rose-50 hover:border-rose-200" 
                                : "bg-slate-50 text-slate-400 border-2 border-slate-100 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 border-2 border-transparent"
                        }`}
                    >
                        {isTakingOwnership ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isLocked ? (
                            isLockedByMe ? (
                                <><Unlock className="w-4 h-4 transition-transform group-hover:-rotate-12" />UnLock</>
                            ) : (
                                <><Lock className="w-4 h-4" /> Locked</>
                            )
                        ) : (
                            <><Lock className="w-4 h-4 transition-transform group-hover:rotate-12" /> Lock </>
                        )}
                    </button>

                    <button 
                        onClick={onLoadVersions}
                        className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-slate-900 text-sm font-bold border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <History className="w-4 h-4 text-slate-400" />
                        <span>History</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

function Overview({ complaint }: { complaint: Complaint }) {
    const status = mapStatus(complaint.status as ComplaintStatus);
    const priority = mapPriority(complaint.severity);
    
    const items = [
        { label: "Current Status", value: status, icon: CheckCircle2, style: STATUS_STYLES[status] },
        { label: "Priority Level", value: priority, icon: AlertCircle, style: PRIORITY_STYLES[priority] },
        { label: "Category", value: mapType(complaint.type as ComplaintType), icon: Briefcase, style: "bg-slate-50 text-slate-700 border-slate-200" },
        { label: "Location", value: GovernorateNames[complaint.governorate] || "Not Specified", icon: MapPin, style: "bg-slate-50 text-slate-700 border-slate-200" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {items.map((item, idx) => (
                <Card key={idx} className="p-5 flex flex-col justify-between group hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                        <item.icon className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                    <div className="flex items-center">
                        <Badge className={item.style}>{item.value}</Badge>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function Details({ complaint }: { complaint: Complaint }) {
    return (
        <Card className="p-8 space-y-10">
            <div>
                <SectionTitle icon={FileSearch} title="Complaint Details" subtitle="Full Description" />
               <div className="space-y-3">
                            <div   className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base">
                        {complaint.description || "No description provided."}
                    </p>
                </div>
                </div>  
            </div>

            {(complaint.agencyNotes && complaint.agencyNotes.length > 0) && (
                <div className="space-y-3">
                    <SectionTitle icon={Briefcase} title="Agency Notes" subtitle="Internal Observations" />
                    <div className="space-y-3">
                        {complaint.agencyNotes.map((note, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-sm text-slate-700 leading-relaxed">{note.note}</p>
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(note.createdAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(complaint.additionalInfoRequests && complaint.additionalInfoRequests.length > 0) && (
                <div className="space-y-3">
                    <SectionTitle icon={MessageSquare} title="Information Requests" subtitle="Pending Citizen Input" />
                    <div className="space-y-3">
                        {complaint.additionalInfoRequests.map((req, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-sm text-slate-900 leading-relaxed">{req.requestMessage}</p>
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(req.createdAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

function Attachments({ complaint }: { complaint: Complaint }) {
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
    const attachments = complaint.attachments || [];
    const images = attachments.filter(a => a.contentType.startsWith('image/'));
    const documents = attachments.filter(a => !a.contentType.startsWith('image/'));

    if (attachments.length === 0) return null;

    return (
        <Card className="p-6 space-y-8">
            <SectionTitle icon={FileText} title="Evidence & Attachments" subtitle="Supporting Files" />
            
            {images.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visual Evidence</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((file, idx) => {
                            const fullUrl = file.fileUrl.startsWith('http') ? file.fileUrl : `${API_BASE_URL}${file.fileUrl}`;
                            return (
                                <ImageWithLoading 
                                    key={idx}
                                    src={fullUrl}
                                    alt={file.fileName}
                                    onClick={() => setSelectedImage({ src: fullUrl, alt: file.fileName })}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {documents.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Official Documents</h4>
                    <div className="flex flex-col gap-3">
                        {documents.map((file, idx) => {
                            const fullUrl = file.fileUrl.startsWith('http') ? file.fileUrl : `${API_BASE_URL}${file.fileUrl}`;
                            return (
                                <a
                                    key={idx}
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-300 transition-all">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-slate-700 truncate">{file.fileName}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{formatFileSize(file.fileSize)}</span>
                                        </div>
                                    </div>
                                    <Download className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            <ImageModal 
                isOpen={!!selectedImage}
                src={selectedImage?.src || ""}
                alt={selectedImage?.alt || ""}
                onClose={() => setSelectedImage(null)}
            />
        </Card>
    );
}

function Actions({ status, onStatusChange, onSave, onRequestInfo, saving, disabled }: { 
    status: ComplaintStatus; 
    onStatusChange: (s: ComplaintStatus) => void; 
    onSave: () => void; 
    onRequestInfo: () => void;
    saving: boolean;
    disabled?: boolean;
}) {
    return (
        <Card className="p-8 h-full flex flex-col">
            <SectionTitle icon={Shield} title="Resolution Center" subtitle="Case Management" />
            
            <div className="flex-1 flex flex-col justify-between gap-8">
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Update Status</label>
                    <div className="relative">
                        <select
                            value={status}
                            disabled={disabled}
                            onChange={(e) => onStatusChange(Number(e.target.value) as ComplaintStatus)}
                            className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {Object.entries(ComplaintStatusLabels).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={onSave}
                        disabled={saving || disabled}
                        className="w-full py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                    </button>
                    <button
                        onClick={onRequestInfo}
                        disabled={disabled}
                        className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-4 h-4" /> Request Info
                    </button>
                </div>
            </div>
        </Card>
    );
}

function UserInfo({ complaint }: { complaint: Complaint }) {
    return (
        <Card className="bg-slate-900 text-white p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors" />
            
            <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold tracking-tight">Citizen Profile</h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verified Submitter</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Full Name</span>
                        <p className="text-sm font-bold">{complaint.studentName || "Anonymous Citizen"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Email Address</span>
                        <p className="text-sm font-bold truncate">{complaint.email || "No email provided"}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">National ID</span>
                        <p className="text-sm font-bold font-mono">{complaint.citizenId || "Not Verified"}</p>
                    </div>
                </div>

               
            </div>
        </Card>
    );
}

function ComplaintNotes({ onAddNote, isAdding, disabled }: { onAddNote: (note: string) => void, isAdding: boolean, disabled?: boolean }) {
    const [text, setText] = useState("");
    const handleSubmit = () => {
        if (!text.trim() || disabled) return;
        onAddNote(text);
        setText("");
    };

    return (
        <Card className="p-8 h-full flex flex-col">
            <SectionTitle icon={MessageSquare} title="Internal Notes" subtitle="Agency Collaboration" />
            
            <div className="flex-1 flex flex-col gap-6">
                <textarea
                    value={text}
                    disabled={disabled}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={disabled ? "You must take ownership to post notes..." : "Type a professional internal note here..."}
                    className="flex-1 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm min-h-[140px] focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all resize-none placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isAdding || !text.trim() || disabled}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                >
                    {isAdding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Post Note</>}
                </button>
            </div>
        </Card>
    );
}

 

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export default function ComplaintDetailsPage({ params }: Props) {
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [currentStatus, setCurrentStatus] = useState<ComplaintStatus>(ComplaintStatus.Pending);
    const [saving, setSaving] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isTakingOwnership, setIsTakingOwnership] = useState(false);
    const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
    const [isRequestingInfo, setIsRequestingInfo] = useState(false);
    const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);
    const [versions, setVersions] = useState<ComplaintVersion[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);

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
                    setCurrentStatus((data.status ?? ComplaintStatus.Pending) as ComplaintStatus);
                }
            } catch (err) {
                console.error("Failed to load complaint:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        const loadHistory = async () => {
            setLoadingHistory(true);
            try {
                const token = getToken();
                const historyData = await apiClient.getComplaintHistory(params.id, token);
                if (mounted) setHistory(historyData || []);
            } catch (err) {
                console.error("Failed to load history:", err);
            } finally {
                if (mounted) setLoadingHistory(false);
            }
        };

        load();
        loadHistory();
        return () => { mounted = false; };
    }, [params.id]);

    const handleOwnershipToggle = async () => {
        if (!complaint) return;
        setIsTakingOwnership(true);
        try {
            const token = getToken();
            if (complaint.lockedBy) {
                await apiClient.releaseOwnership(complaint.id, token);
                toast.success("Ownership released successfully");
            } else {
                await apiClient.takeOwnership(complaint.id, token);
                toast.success("Ownership taken successfully");
            }
            setTimeout(() => window.location.reload(), 500);
        } catch (err: any) {
            toast.error(err.message || "Failed to update ownership");
        } finally {
            setIsTakingOwnership(false);
        }
    };

    const handleRequestInfo = async (message: string) => {
        if (!complaint) return;
        setIsRequestingInfo(true);
        try {
            const token = getToken();
            await apiClient.requestInfo(complaint.id, message, token);
            toast.success("Information requested successfully");
            setIsRequestInfoModalOpen(false);
            setTimeout(() => window.location.reload(), 500);
        } catch (err: any) {
            toast.error(err.message || "Failed to request information");
        } finally {
            setIsRequestingInfo(false);
        }
    };

    const handleAddInternalNote = async (text: string) => {
        if (!complaint) return;
        setIsAddingNote(true);
        try {
            const token = getToken();
            await apiClient.addComplaintNote(complaint.id, text, token);
            toast.success("Note added successfully");
            setTimeout(() => window.location.reload(), 500);
        } catch (err: any) {
            toast.error(err.message || "Failed to add note");
        } finally {
            setIsAddingNote(false);
        }
    };

    const handleLoadVersions = async () => {
        if (!complaint) return;
        setLoadingVersions(true);
        setIsVersionsModalOpen(true);
        try {
            const token = getToken();
            const data = await apiClient.getComplaintVersions(complaint.id, token);
            setVersions(data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load version history");
        } finally {
            setLoadingVersions(false);
        }
    };

    const handleSave = async () => {
        if (!complaint) return;
        setSaving(true);
        const promise = (async () => {
            const token = getToken();
            const payload = { 
                id: complaint.id,
                status: currentStatus 
            };
            const updated = await apiClient.updateComplaintStatus(payload as any, token);
            setTimeout(() => window.location.reload(), 500);
            return updated;
        })();

        toast.promise(promise, {
            loading: 'Updating complaint...',
            success: 'Complaint updated successfully',
            error: (err) => err.message || 'Failed to update complaint'
        });

        try { await promise; } catch (err) {
            if (complaint) setCurrentStatus((complaint.status ?? ComplaintStatus.Pending) as ComplaintStatus);
        } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="min-h-screen  flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Details</p>
                </div>
            </div>
        );
    }

    if (!complaint) return <EmptyState />;

    const user = getUser();
    const currentUserId = user?.userId;
    const canAction = !complaint.lockedBy || complaint.lockedBy === currentUserId;

    return (
  <div className="min-h-screen   p-5  ">
    <div className="max-w-[1400px] mx-auto space-y-12">

      {/* HEADER */}
      <Header
        complaint={complaint}
        isTakingOwnership={isTakingOwnership}
        onOwnershipToggle={handleOwnershipToggle}
        onLoadVersions={handleLoadVersions}
      />

      {/* OVERVIEW */}
      <Overview complaint={complaint} />
        <Details complaint={complaint} />
         {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 items-start">
        
        {/* Row 1: Details & Actions */}
        <Actions
          status={currentStatus}
          onStatusChange={setCurrentStatus}
          onSave={handleSave}
          onRequestInfo={() => setIsRequestInfoModalOpen(true)}
          saving={saving}
          disabled={!canAction}
        />

        {/* Row 2: Timeline & Internal Notes */}
        <ComplaintNotes
          onAddNote={handleAddInternalNote}
          isAdding={isAddingNote}
          disabled={!canAction}
        />

        {/* Row 3: Attachments & User Info */}
        <Attachments complaint={complaint} />
 
      </div>
        <HistoryTimeline events={history} isLoading={loadingHistory} />

     

      {/* MODALS */}
      {isVersionsModalOpen && (
        <VersionsModal
          versions={versions}
          isLoading={loadingVersions}
          onClose={() => setIsVersionsModalOpen(false)}
        />
      )}

      {isRequestInfoModalOpen && (
        <RequestInfoModal
          onClose={() => setIsRequestInfoModalOpen(false)}
          onSubmit={handleRequestInfo}
          isSubmitting={isRequestingInfo}
        />
      )}

    </div>
  </div>
);

}

function RequestInfoModal({ onClose, onSubmit, isSubmitting }: { onClose: () => void, onSubmit: (msg: string) => void, isSubmitting: boolean }) {
    const [message, setMessage] = useState("");
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <Card className="w-full max-w-lg animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                            <BadgeCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Request Information</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Request Message</label>
                        <textarea
                            autoFocus
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe what information you need from the citizen..."
                            className="w-full min-h-[160px] p-5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(message)}
                            disabled={isSubmitting || !message.trim()}
                            className="flex-1 px-6 py-4 rounded-2xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Request"}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
