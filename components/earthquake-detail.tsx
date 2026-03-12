"use client";

import {
  X,
  MapPin,
  ArrowDown,
  Clock,
  Waves,
  ExternalLink,
  Hand,
  AlertTriangle,
} from "lucide-react";
import type { Earthquake } from "@/app/api/earthquakes/route";
import { getMagColor, getMagLevel, timeAgo, formatDepth } from "@/hooks/use-earthquakes";

interface EarthquakeDetailProps {
  earthquake: Earthquake;
  onClose: () => void;
}

export function EarthquakeDetail({
  earthquake: eq,
  onClose,
}: EarthquakeDetailProps) {
  const color = getMagColor(eq.mag);
  const level = getMagLevel(eq.mag);
  const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

  const stats = [
    {
      icon: ArrowDown,
      label: "Depth",
      value: formatDepth(eq.depth),
      color: "#3b82f6",
    },
    {
      icon: MapPin,
      label: "Coordinates",
      value: `${eq.lat.toFixed(3)}, ${eq.lng.toFixed(3)}`,
      color: "#8b5cf6",
    },
    {
      icon: Clock,
      label: "Time",
      value: new Date(eq.time).toLocaleString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " UTC",
      color: "#6366f1",
    },
    {
      icon: Hand,
      label: "Felt Reports",
      value: eq.felt ? `${eq.felt} reports` : "None",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-11 shrink-0 border-b"
        style={{ borderColor: "var(--divider)" }}
      >
        <span
          className="text-[11px] font-semibold tracking-widest"
          style={{ color: "var(--text-tertiary)" }}
        >
          EARTHQUAKE DETAIL
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md transition-colors bg-transparent"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Close"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 flex flex-col gap-5">
          {/* Magnitude hero */}
          <div
            className="flex items-center gap-4 p-4 rounded-lg"
            style={{
              background: `${color}08`,
              border: `1px solid ${color}20`,
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0"
              style={{
                background: `${color}15`,
                border: `2px solid ${color}40`,
              }}
            >
              <span
                className="text-2xl font-mono font-black leading-none tabular-nums"
                style={{ color }}
              >
                {eq.mag.toFixed(1)}
              </span>
              <span
                className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-80"
                style={{ color }}
              >
                MAG
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className="text-[14px] font-bold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {eq.place}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md tracking-wider"
                  style={{ color, backgroundColor: `${color}15` }}
                >
                  {levelLabel}
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: "var(--text-ghost)" }}
                >
                  {timeAgo(eq.time)}
                </span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {eq.tsunami && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-blue-500/10 border border-blue-500/20">
              <Waves className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-[11px] font-semibold text-blue-400">
                Tsunami warning issued for this event
              </span>
            </div>
          )}

          {eq.alert && (
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md"
              style={{
                background: `${color}10`,
                border: `1px solid ${color}25`,
              }}
            >
              <AlertTriangle
                className="w-4 h-4 shrink-0"
                style={{ color }}
              />
              <span className="text-[11px] font-semibold" style={{ color }}>
                PAGER alert level: {eq.alert.toUpperCase()}
              </span>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md"
                style={{
                  background: "var(--hover-bg)",
                  border: "1px solid var(--divider)",
                }}
              >
                <stat.icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: stat.color, opacity: 0.7 }}
                />
                <div className="min-w-0">
                  <p
                    className="text-[9px] uppercase tracking-widest font-medium"
                    style={{ color: "var(--text-ghost)" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-[12px] font-semibold truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Seismic profile */}
          <div>
            <p
              className="text-[10px] uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--text-ghost)" }}
            >
              Seismic Profile
            </p>
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center justify-between px-3 py-2 rounded-md"
                style={{ background: "var(--hover-bg)", border: "1px solid var(--divider)" }}
              >
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Event type
                </span>
                <span
                  className="text-[11px] font-mono font-semibold capitalize"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {eq.type}
                </span>
              </div>
              <div
                className="flex items-center justify-between px-3 py-2 rounded-md"
                style={{ background: "var(--hover-bg)", border: "1px solid var(--divider)" }}
              >
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Review status
                </span>
                <span
                  className="text-[11px] font-mono font-semibold capitalize"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {eq.status}
                </span>
              </div>
              <div
                className="flex items-center justify-between px-3 py-2 rounded-md"
                style={{ background: "var(--hover-bg)", border: "1px solid var(--divider)" }}
              >
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Last updated
                </span>
                <span
                  className="text-[11px] font-mono font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {timeAgo(eq.updated)}
                </span>
              </div>
            </div>
          </div>

          {/* USGS link */}
          <a
            href={eq.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[11px] font-semibold transition-colors"
            style={{
              background: "var(--hover-bg)",
              border: "1px solid var(--divider)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = getMagColor(eq.mag) + "40";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--divider)";
            }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View on USGS
          </a>
        </div>
      </div>
    </div>
  );
}
