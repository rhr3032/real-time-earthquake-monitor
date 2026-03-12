"use client";

import dynamic from "next/dynamic";
import type { Earthquake } from "@/app/api/earthquakes/route";

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => ({ default: mod.LeafletMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            Initializing map...
          </span>
        </div>
      </div>
    ),
  }
);

interface WorldMapProps {
  earthquakes: Earthquake[];
  selected: Earthquake | null;
  onSelect: (eq: Earthquake) => void;
}

export function WorldMap({ earthquakes, selected, onSelect }: WorldMapProps) {
  return (
    <LeafletMap
      earthquakes={earthquakes}
      selected={selected}
      onSelect={onSelect}
    />
  );
}
