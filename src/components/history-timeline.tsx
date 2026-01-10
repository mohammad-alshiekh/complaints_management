"use client";

import { useState } from "react";
import { 
    Clock, 
    User, 
    FileText, 
    Info, 
    Lock, 
    Unlock, 
    ChevronDown, 
    ChevronUp,
    CheckCircle2
} from "lucide-react";
import { ActionType } from "@/enums";
import { format } from "date-fns";

interface TimelineEvent {
    id: string;
    actionType: number;
    issuerId: string;
    description: string;
    occurredAt: string;
}

interface HistoryTimelineProps {
    events: TimelineEvent[];
    isLoading?: boolean;
}

const ACTION_CONFIG: Record<number, { icon: any; color: string; bgColor: string; label: string }> = {
    [ActionType.StatusChanged]: {
        icon: CheckCircle2,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        label: "Status Changed"
    },
    [ActionType.AgencyNotesAdded]: {
        icon: FileText,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        label: "Note Added"
    },
    [ActionType.AdditionalInfoRequested]: {
        icon: Info,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        label: "Info Requested"
    },
    [ActionType.TakenOwnership]: {
        icon: Lock,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        label: "Ownership Taken"
    },
    [ActionType.ReleasedOwnership]: {
        icon: Unlock,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        label: "Ownership Released"
    }
};

export default function HistoryTimeline({ events, isLoading }: HistoryTimelineProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayLimit = 3;
    const hasMore = events.length > displayLimit;
    const displayedEvents = isExpanded ? events : events.slice(0, displayLimit);

    if (isLoading) {
        return (
            <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-8 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <h3 className="font-bold text-slate-900">Activity History</h3>
                </div>
                <div className="space-y-6 animate-pulse">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-1/4" />
                                <div className="h-10 bg-slate-50 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900">Activity History</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold">
                    {events.length} Events
                </span>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-500 italic">No activity recorded yet.</p>
                </div>
            ) : (
                <div className="relative space-y-0">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />

                    <div className="space-y-8">
                        {displayedEvents.map((event, index) => {
                            const config = ACTION_CONFIG[event.actionType] || {
                                icon: User,
                                color: "text-slate-400",
                                bgColor: "bg-slate-50",
                                label: "Unknown Action"
                            };
                            const Icon = config.icon;

                            return (
                                <div key={event.id} className="relative flex gap-6 group">
                                    {/* Icon Container */}
                                    <div className={`relative z-10 w-8 h-8 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center ring-4 ring-white shrink-0 transition-transform group-hover:scale-110`}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                            <span className={`text-sm font-bold ${config.color}`}>
                                                {config.label}
                                            </span>
                                            <time className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                                                {format(new Date(event.occurredAt), "MMM d, yyyy • h:mm a")}
                                            </time>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 group-hover:bg-slate-50 group-hover:border-slate-200 transition-colors">
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {hasMore && (
                        <div className="mt-8 pt-4 border-t border-slate-50 flex justify-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
                            >
                                {isExpanded ? (
                                    <>
                                        <ChevronUp className="w-4 h-4" />
                                        <span>Show Less</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4" />
                                        <span>View All Events</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
