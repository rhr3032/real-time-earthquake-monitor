"use client";

import type { Earthquake } from "@/app/api/earthquakes/route";
import { getMagColor, timeAgo } from "@/hooks/use-earthquakes";

interface BottomBarProps {
  earthquakes: Earthquake[];
  lastUpdated: number | null;
}

export function BottomBar({ earthquakes, lastUpdated }: BottomBarProps) {
  const magBuckets = [
    { label: "M7+", min: 7, color: "#dc2626" },
    { label: "M6+", min: 6, max: 7, color: "#ef4444" },
    { label: "M5+", min: 5, max: 6, color: "#f97316" },
    { label: "M4+", min: 4, max: 5, color: "#eab308" },
    { label: "M3+", min: 3, max: 4, color: "#22c55e" },
    { label: "M2.5+", min: 2.5, max: 3, color: "#3b82f6" },
  ];

  const counts = magBuckets.map((b) => ({
    ...b,
    count: earthquakes.filter(
      (eq) => eq.mag >= b.min && (b.max === undefined || eq.mag < b.max)
    ).length,
  }));

  const total = earthquakes.length;
  const tsunamiCount = earthquakes.filter((eq) => eq.tsunami).length;
  const latest = earthquakes.length > 0 ? earthquakes[0] : null;

  return (
    <div
      className="glass-panel hidden lg:flex items-center justify-between px-5 h-10 border-0 border-t"
      style={{ borderColor: "var(--divider)" }}
    >
      {/* Magnitude distribution */}
      <div className="flex items-center gap-4">
        <span
          className="text-[10px] font-semibold tracking-widest"
          style={{ color: "var(--text-ghost)" }}
        >
          DISTRIBUTION
        </span>
        {total > 0 && (
          <div
            className="flex items-center gap-px h-2 w-32 rounded-full overflow-hidden"
            style={{ background: "var(--hover-bg)" }}
          >
            {counts.map(
              (b) =>
                b.count > 0 && (
                  <div
                    key={b.label}
                    className="h-full"
                    style={{
                      width: `${(b.count / total) * 100}%`,
                      backgroundColor: b.color,
                      opacity: 0.8,
                    }}
                  />
                )
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          {counts
            .filter((b) => b.count > 0)
            .map((b) => (
              <div key={b.label} className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                <span className="text-[10px]" style={{ color: "var(--text-ghost)" }}>
                  {b.label}
                </span>
                <span
                  className="text-[11px] font-mono font-semibold tabular-nums"
                  style={{ color: b.color }}
                >
                  {b.count}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Latest event */}
      {latest && (
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-semibold tracking-widest"
            style={{ color: "var(--text-ghost)" }}
          >
            LATEST
          </span>
          <span
            className="text-[11px] font-mono font-bold tabular-nums"
            style={{ color: getMagColor(latest.mag) }}
          >
            M{latest.mag.toFixed(1)}
          </span>
          <span
            className="text-[10px] truncate max-w-48"
            style={{ color: "var(--text-tertiary)" }}
          >
            {latest.place}
          </span>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-ghost)" }}>
            {timeAgo(latest.time)}
          </span>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center gap-3">
        {tsunamiCount > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
            {tsunamiCount} TSUNAMI
          </span>
        )}
        <span className="text-[10px] font-mono" style={{ color: "var(--text-ghost)" }}>
          USGS M2.5+ / 24h
        </span>
        {lastUpdated && (
          <span className="text-[10px] font-mono" style={{ color: "var(--text-ghost)" }}>
            Updated {timeAgo(lastUpdated)}
          </span>
        )}
      </div>
    </div>
  );
}
