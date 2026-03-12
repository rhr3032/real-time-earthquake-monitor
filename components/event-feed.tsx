"use client";

import { Radio } from "lucide-react";
import type { MarkerEvent, SeverityLevel } from "@/lib/data";

interface EventFeedProps {
  events: MarkerEvent[];
  label?: string;
}

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#22c55e",
};

function timeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  if (diffHrs < 1) return "< 1h";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function EventFeed({ events, label = "EVENT FEED" }: EventFeedProps) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-4 h-11 shrink-0 border-b"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span
            className="text-[11px] font-semibold tracking-widest"
            style={{ color: "var(--text-tertiary)" }}
          >
            {label}
          </span>
        </div>
        <span
          className="text-[11px] font-mono font-semibold"
          style={{ color: "var(--text-ghost)" }}
        >
          {events.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {events.map((event) => {
          const color = SEVERITY_COLORS[event.severity];
          return (
            <div
              key={event.id}
              className="relative px-4 py-3.5 md:py-3 transition-colors cursor-pointer"
              style={{ borderBottom: `1px solid var(--divider)` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r"
                style={{ backgroundColor: color, opacity: 0.5 }}
              />
              <div className="flex items-start gap-3">
                <div className="mt-[5px] shrink-0">
                  <div
                    className="w-[6px] h-[6px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[12px] font-semibold leading-snug"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {event.title}
                  </p>
                  <p
                    className="text-[11px] mt-1.5 leading-relaxed line-clamp-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: "var(--text-ghost)" }}
                    >
                      {timeAgo(event.timestamp)}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-primary/60">
                      {event.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
