"use client";

import { Search, Activity } from "lucide-react";
import { useState } from "react";
import type { Earthquake } from "@/app/api/earthquakes/route";
import { getMagColor, getMagLevel, timeAgo } from "@/hooks/use-earthquakes";

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  selected: Earthquake | null;
  onSelect: (eq: Earthquake) => void;
}

export function EarthquakeList({
  earthquakes,
  selected,
  onSelect,
}: EarthquakeListProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? earthquakes.filter((eq) =>
        eq.place.toLowerCase().includes(search.toLowerCase())
      )
    : earthquakes;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-11 shrink-0 border-b"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span
            className="text-[11px] font-semibold tracking-widest"
            style={{ color: "var(--text-tertiary)" }}
          >
            SEISMIC EVENTS
          </span>
        </div>
        <span
          className="text-[11px] font-mono font-semibold tabular-nums"
          style={{ color: "var(--text-ghost)" }}
        >
          {filtered.length}
        </span>
      </div>

      {/* Search */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderBottom: "1px solid var(--divider)" }}
      >
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
          style={{ background: "var(--hover-bg)" }}
        >
          <Search
            className="w-3 h-3 shrink-0"
            style={{ color: "var(--text-ghost)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location..."
            className="text-[11px] bg-transparent border-none outline-none w-full placeholder-current"
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.map((eq) => {
          const isSelected = selected?.id === eq.id;
          const color = getMagColor(eq.mag);
          const level = getMagLevel(eq.mag);

          return (
            <button
              type="button"
              key={eq.id}
              onClick={() => onSelect(eq)}
              className="relative w-full text-left px-4 py-3 transition-all duration-150"
              style={{
                borderBottom: "1px solid var(--divider)",
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
                {/* Magnitude badge */}
                <div
                  className="shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center"
                  style={{
                    background: `${color}12`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <span
                    className="text-[14px] font-mono font-bold leading-none tabular-nums"
                    style={{ color }}
                  >
                    {eq.mag.toFixed(1)}
                  </span>
                  <span
                    className="text-[7px] font-semibold uppercase tracking-wider mt-0.5 opacity-70"
                    style={{ color }}
                  >
                    {level === "extreme" ? "EXT" : level === "major" ? "MAJ" : level === "strong" ? "STR" : level === "moderate" ? "MOD" : "LGT"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[12px] font-semibold truncate leading-tight"
                      style={{
                        color: isSelected
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {eq.place}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="text-[10px] font-mono tabular-nums"
                      style={{ color: "var(--text-ghost)" }}
                    >
                      {timeAgo(eq.time)}
                    </span>
                    <span
                      className="text-[10px] font-mono tabular-nums"
                      style={{ color: "var(--text-ghost)" }}
                    >
                      {eq.depth.toFixed(0)}km deep
                    </span>
                    {eq.tsunami && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">
                        TSUNAMI
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Activity
              className="w-6 h-6"
              style={{ color: "var(--text-ghost)" }}
            />
            <span
              className="text-[12px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              No earthquakes found
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
