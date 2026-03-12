"use client";

import {
  X,
  MapPin,
  Calendar,
  Users,
  Crosshair,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
} from "lucide-react";
import type { Marker, SeverityLevel } from "@/lib/data";

interface MarkerDetailProps {
  marker: Marker;
  onClose: () => void;
}

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#22c55e",
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return Math.round(n / 1000) + "K";
  return n.toLocaleString();
}

function TrendLabel({ trend }: { trend: Marker["trend"] }) {
  const configs = {
    escalating: { Icon: TrendingUp, label: "Escalating", color: "#ef4444" },
    "de-escalating": { Icon: TrendingDown, label: "De-escalating", color: "#22c55e" },
    stable: { Icon: Minus, label: "Stable", color: "#f59e0b" },
  };
  const config = configs[trend];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md"
      style={{ color: config.color, backgroundColor: `${config.color}12` }}
    >
      <config.Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}

export function MarkerDetail({ marker, onClose }: MarkerDetailProps) {
  const color = SEVERITY_COLORS[marker.severity];

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-4 h-11 shrink-0 border-b"
        style={{ borderColor: "var(--divider)" }}
      >
        <span
          className="text-[11px] font-semibold tracking-widest"
          style={{ color: "var(--text-tertiary)" }}
        >
          DETAILS
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 md:p-1.5 rounded-md transition-colors bg-transparent"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Close detail panel"
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
          {/* Title */}
          <div>
            <h4
              className="text-[15px] font-bold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {marker.name}
            </h4>
            <div className="flex items-center gap-2 mt-3">
              <span
                className="text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-md tracking-wider"
                style={{ color, backgroundColor: `${color}12` }}
              >
                {marker.severity}
              </span>
              <TrendLabel trend={marker.trend} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Crosshair, label: "Impact", value: formatNumber(marker.casualties), iconColor: "#f59e0b" },
              { icon: Users, label: "Displaced", value: formatNumber(marker.displaced), iconColor: "#8b5cf6" },
              { icon: MapPin, label: "Region", value: marker.region, iconColor: "#3b82f6" },
              { icon: Calendar, label: "Started", value: marker.startDate, iconColor: "#3b82f6" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-3 py-3 md:py-2.5 rounded-md"
                style={{ background: "var(--hover-bg)", border: `1px solid var(--divider)` }}
              >
                <stat.icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: stat.iconColor, opacity: 0.7 }}
                />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: "var(--text-ghost)" }}>
                    {stat.label}
                  </p>
                  <p className="text-[12px] font-semibold truncate" style={{ color: "var(--text-secondary)" }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-ghost)" }}>
              Overview
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              {marker.description}
            </p>
          </div>

          {/* Parties */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-ghost)" }}>
              Parties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {marker.parties.map((party) => (
                <span
                  key={party}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 md:py-1 rounded-md"
                  style={{ background: "var(--hover-bg)", border: `1px solid var(--divider)`, color: "var(--text-secondary)" }}
                >
                  <Shield className="w-2.5 h-2.5" style={{ color: "var(--text-ghost)" }} />
                  {party}
                </span>
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-ghost)" }}>
              Recent Events
            </p>
            <div className="flex flex-col gap-2">
              {marker.events.map((event) => {
                const evColor = SEVERITY_COLORS[event.severity];
                return (
                  <div
                    key={event.id}
                    className="relative px-3 py-3 rounded-md"
                    style={{ background: "var(--hover-bg)", border: `1px solid var(--divider)` }}
                  >
                    <div
                      className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r"
                      style={{ backgroundColor: evColor, opacity: 0.5 }}
                    />
                    <p className="text-[12px] font-semibold leading-snug" style={{ color: "var(--text-secondary)" }}>
                      {event.title}
                    </p>
                    <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono" style={{ color: "var(--text-ghost)" }}>
                        {event.source}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
