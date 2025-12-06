"use client";

import { ComplaintTimelineEvent } from "@/lib/complaints";
import clsx from "clsx";

interface HistoryTimelineProps {
  events: ComplaintTimelineEvent[];
  className?: string;
  isRTL?: boolean;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(value));

const HistoryTimeline = ({
  events,
  className,
  isRTL = false,
}: HistoryTimelineProps) => {
  const paddingClass = isRTL ? "pr-12 text-right" : "pl-12";
  const dotPosition = isRTL ? "right-2" : "left-2";
  const linePosition = isRTL ? "right-[9px]" : "left-[9px]";

  return (
    <div className={clsx("relative", className)} dir={isRTL ? "rtl" : "ltr"}>
      <span
        className={clsx(
          "absolute top-0 bottom-0 w-px bg-gray-200",
          linePosition
        )}
      />
      <ol className="space-y-6">
        {events.map((event) => (
          <li key={event.timestamp} className={clsx("relative", paddingClass)}>
            <span
              className={clsx(
                "absolute top-2 h-4 w-4 rounded-full border-2 border-white bg-gray-900 shadow",
                dotPosition
              )}
            />
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {formatDate(event.timestamp)}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {event.action}
              </p>
              <p className="text-xs text-gray-500">{event.actor}</p>
              {event.note && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {event.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default HistoryTimeline;
