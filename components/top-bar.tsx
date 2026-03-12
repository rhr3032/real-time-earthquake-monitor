"use client";

import { Activity, Clock, Sun, Moon, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import type { Earthquake } from "@/app/api/earthquakes/route";
import { getMagColor } from "@/hooks/use-earthquakes";

interface TopBarProps {
  earthquakes: Earthquake[];
  isLoading: boolean;
  lastUpdated: number | null;
  onRefresh: () => void;
}

export function TopBar({
  earthquakes,
  isLoading,
  lastUpdated,
  onRefresh,
}: TopBarProps) {
  const [time, setTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = earthquakes.length;
  const m5plus = earthquakes.filter((eq) => eq.mag >= 5).length;
  const m4plus = earthquakes.filter((eq) => eq.mag >= 4).length;
  const maxMag = earthquakes.length > 0 ? Math.max(...earthquakes.map((eq) => eq.mag)) : 0;
  const maxColor = getMagColor(maxMag);

  return (
    <div
      className="glass-panel flex items-center justify-between px-3 md:px-5 h-12 border-0 border-b"
      style={{ borderColor: "var(--divider)" }}
    >
      {/* Left: branding */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary/10 border border-primary/20">
          <Activity className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex items-baseline gap-2.5">
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            TREMOR
          </span>
          <span
            className="text-[10px] font-medium tracking-widest hidden sm:inline"
            style={{ color: "var(--text-ghost)" }}
          >
            REAL-TIME EARTHQUAKE MONITOR
          </span>
        </div>
      </div>

      {/* Center: stats */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-ghost)" }}>
            EVENTS
          </span>
          <span className="text-[12px] font-mono font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {total}
          </span>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--divider)" }} />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-ghost)" }}>
            M5+
          </span>
          <span className="text-[12px] font-mono font-bold tabular-nums" style={{ color: m5plus > 0 ? "#ef4444" : "var(--text-tertiary)" }}>
            {m5plus}
          </span>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--divider)" }} />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-ghost)" }}>
            M4+
          </span>
          <span className="text-[12px] font-mono font-bold tabular-nums" style={{ color: m4plus > 0 ? "#f59e0b" : "var(--text-tertiary)" }}>
            {m4plus}
          </span>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--divider)" }} />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-ghost)" }}>
            PEAK
          </span>
          <span className="text-[12px] font-mono font-bold tabular-nums" style={{ color: maxColor }}>
            {maxMag > 0 ? `M${maxMag.toFixed(1)}` : "--"}
          </span>
        </div>
      </div>

      {/* Right: status, controls */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/15">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold tracking-wide">
            LIVE
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <Clock className="w-3 h-3" style={{ color: "var(--text-ghost)" }} />
          <span
            className="text-[11px] font-mono tabular-nums"
            style={{ color: "var(--text-tertiary)" }}
          >
            {time} UTC
          </span>
        </div>

        <div className="h-5 w-px hidden sm:block" style={{ background: "var(--divider)" }} />

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-transparent"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Refresh data"
          disabled={isLoading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>

        {/* Theme toggle -- render after mount to avoid hydration mismatch */}
        {mounted ? (
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-transparent"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>
    </div>
  );
}
