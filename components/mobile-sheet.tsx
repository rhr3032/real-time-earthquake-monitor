"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { List, ChevronDown, Activity } from "lucide-react";
import { EarthquakeList } from "./earthquake-list";
import { EarthquakeDetail } from "./earthquake-detail";
import type { Earthquake } from "@/app/api/earthquakes/route";

type SheetTab = "list" | "detail";

interface MobileSheetProps {
  earthquakes: Earthquake[];
  selected: Earthquake | null;
  onSelect: (eq: Earthquake) => void;
  onDeselect: () => void;
}

const SNAP_PEEK = 52;
const SNAP_HALF = 0.5;
const SNAP_FULL = 0.92;

export function MobileSheet({
  earthquakes,
  selected,
  onSelect,
  onDeselect,
}: MobileSheetProps) {
  const [activeTab, setActiveTab] = useState<SheetTab>("list");
  const [sheetHeight, setSheetHeight] = useState(SNAP_PEEK);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    if (selected) {
      setActiveTab("detail");
      setSheetHeight(window.innerHeight * SNAP_HALF);
    }
  }, [selected]);

  const snapTo = useCallback((height: number) => {
    const snaps = [SNAP_PEEK, window.innerHeight * SNAP_HALF, window.innerHeight * SNAP_FULL];
    let closest = snaps[0];
    let minDist = Math.abs(height - snaps[0]);
    for (const s of snaps) {
      const d = Math.abs(height - s);
      if (d < minDist) {
        minDist = d;
        closest = s;
      }
    }
    setSheetHeight(closest);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      startYRef.current = e.touches[0].clientY;
      startHeightRef.current = sheetHeight;
    },
    [sheetHeight]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const delta = startYRef.current - e.touches[0].clientY;
      const h = Math.max(SNAP_PEEK, Math.min(window.innerHeight * SNAP_FULL, startHeightRef.current + delta));
      setSheetHeight(h);
    },
    [isDragging]
  );

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    snapTo(sheetHeight);
  }, [sheetHeight, snapTo]);

  const isExpanded = sheetHeight > SNAP_PEEK + 20;
  const isPeek = !isExpanded;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden"
      style={{
        height: `${sheetHeight}px`,
        transition: isDragging ? "none" : "height 0.3s cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <div className="glass-panel h-full rounded-t-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Handle */}
        <div
          className="shrink-0 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => {
            if (isPeek) setSheetHeight(window.innerHeight * SNAP_HALF);
          }}
          role="button"
          tabIndex={0}
          aria-label={isPeek ? "Expand panel" : "Drag to resize"}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && isPeek) {
              setSheetHeight(window.innerHeight * SNAP_HALF);
            }
          }}
        >
          <div className="w-10 h-1 rounded-full mt-2 mb-1" style={{ background: "var(--text-ghost)" }} />

          <div className="flex items-center w-full px-3 py-1.5 gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("list");
                if (isPeek) setSheetHeight(window.innerHeight * SNAP_HALF);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-colors ${
                activeTab === "list" ? "bg-primary/15 text-primary" : ""
              }`}
              style={activeTab !== "list" ? { color: "var(--text-tertiary)" } : {}}
            >
              <List className="w-3 h-3" />
              Quakes
              <span className="text-[10px] font-mono ml-0.5 opacity-60">{earthquakes.length}</span>
            </button>
            {selected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("detail");
                  if (isPeek) setSheetHeight(window.innerHeight * SNAP_HALF);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide transition-colors ${
                  activeTab === "detail" ? "bg-primary/15 text-primary" : ""
                }`}
                style={activeTab !== "detail" ? { color: "var(--text-tertiary)" } : {}}
              >
                <Activity className="w-3 h-3" />
                Detail
              </button>
            )}

            <div className="flex-1" />

            {isExpanded && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSheetHeight(SNAP_PEEK);
                }}
                className="p-1 rounded-md bg-transparent"
                style={{ color: "var(--text-ghost)" }}
                aria-label="Minimize"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === "list" && (
              <EarthquakeList
                earthquakes={earthquakes}
                selected={selected}
                onSelect={onSelect}
              />
            )}
            {activeTab === "detail" && selected && (
              <EarthquakeDetail
                earthquake={selected}
                onClose={onDeselect}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
