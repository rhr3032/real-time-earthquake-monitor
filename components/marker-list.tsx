"use client";

import { TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { useState } from "react";
import type { Marker, SeverityLevel } from "@/lib/data";

interface MarkerListProps {
  markers: Marker[];
  selectedMarker: Marker | null;
  onSelectMarker: (marker: Marker) => void;
}

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#22c55e",
};

function TrendIcon({ trend }: { trend: Marker["trend"] }) {
  const cls = "w-3 h-3";
  if (trend === "escalating")
    return <TrendingUp className={cls} style={{ color: "#ef4444" }} />;
  if (trend === "de-escalating")
    return <TrendingDown className={cls} style={{ color: "#22c55e" }} />;
  return <Minus className={cls} style={{ color: "var(--text-ghost)" }} />;
}

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return Math.round(n / 1000) + "K";
  return n.toLocaleString();
}

export function MarkerList({
  markers: dataMarkers,
  selectedMarker,
  onSelectMarker,
}: MarkerListProps) {
  const [search, setSearch] = useState("");

  const sorted = [...dataMarkers].sort((a, b) => {
    const order: SeverityLevel[] = ["critical", "high", "medium", "low"];
    return order.indexOf(a.severity) - order.indexOf(b.severity);
  });

  const filtered = search
    ? sorted.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.country.toLowerCase().includes(search.toLowerCase()) ||
          m.category.toLowerCase().includes(search.toLowerCase())
      )
    : sorted;

  return (
    <div className="flex flex-col h-full" suppressHydrationWarning>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-11 shrink-0 border-b"
        style={{ borderColor: "var(--divider)" }}
      >
        <span
          className="text-[11px] font-semibold tracking-widest"
          style={{ color: "var(--text-tertiary)" }}
        >
          ACTIVE MARKERS
        </span>
        <span
          className="text-[11px] font-mono font-semibold"
          style={{ color: "var(--text-ghost)" }}
        >
          {filtered.length}
        </span>
      </div>

      {/* Search */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: `1px solid var(--divider)` }}
      >
        <div
          className="flex items-center gap-2 px-2.5 py-2 md:py-1.5 rounded-md"
          style={{ background: "var(--hover-bg)" }}
        >
          <Search
            className="w-3.5 md:w-3 h-3.5 md:h-3 shrink-0"
            style={{ color: "var(--text-ghost)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="text-[12px] md:text-[11px] bg-transparent border-none outline-none w-full placeholder-current"
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.map((marker) => {
          const isSelected = selectedMarker?.id === marker.id;
          const color = SEVERITY_COLORS[marker.severity];

          return (
            <button
              type="button"
              key={marker.id}
              onClick={() => onSelectMarker(marker)}
              className="relative w-full text-left px-4 py-4 md:py-3 transition-all duration-150"
              style={{
                borderBottom: `1px solid var(--divider)`,
                background: isSelected ? "var(--selected-bg)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  e.currentTarget.style.background = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {isSelected && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r"
                  style={{ backgroundColor: color }}
                />
              )}

              <div className="flex items-start gap-3">
                <div className="mt-[5px] shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}40`,
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[13px] md:text-[12px] font-semibold truncate"
                      style={{
                        color: isSelected
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {marker.name}
                    </span>
                    <TrendIcon trend={marker.trend} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] md:text-[9px] font-mono font-semibold uppercase tracking-widest"
                      style={{ color }}
                    >
                      {marker.severity}
                    </span>
                    <span
                      className="text-[11px] md:text-[10px]"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {marker.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="text-[11px] md:text-[10px]"
                      style={{ color: "var(--text-ghost)" }}
                    >
                      {marker.country}
                    </span>
                    <span
                      className="text-[11px] md:text-[10px] font-mono"
                      style={{ color: "var(--text-ghost)" }}
                    >
                      {formatNum(marker.casualties)} cas.
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
