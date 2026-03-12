"use client";

import { useState, useCallback } from "react";
import { WorldMap } from "@/components/world-map";
import { TopBar } from "@/components/top-bar";
import { BottomBar } from "@/components/bottom-bar";
import { EarthquakeList } from "@/components/earthquake-list";
import { EarthquakeDetail } from "@/components/earthquake-detail";
import { MobileSheet } from "@/components/mobile-sheet";
import { useEarthquakes } from "@/hooks/use-earthquakes";
import type { Earthquake } from "@/app/api/earthquakes/route";

export default function Page() {
  const { earthquakes, metadata, isLoading, refresh } = useEarthquakes();
  const [selected, setSelected] = useState<Earthquake | null>(null);

  const handleSelect = useCallback((eq: Earthquake) => {
    setSelected(eq);
  }, []);

  const handleDeselect = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Full-bleed map */}
      <div className="absolute inset-0 z-0">
        <WorldMap
          earthquakes={earthquakes}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <TopBar
          earthquakes={earthquakes}
          isLoading={isLoading}
          lastUpdated={metadata?.generated ?? null}
          onRefresh={refresh}
        />
      </div>

      {/* Desktop right panel */}
      <div className="absolute top-12 right-0 bottom-10 w-[340px] z-10 hidden lg:flex flex-col" suppressHydrationWarning>
        <div className="glass-panel flex-1 flex flex-col overflow-hidden border-0 border-l" style={{ borderColor: "var(--divider)" }}>
          {selected ? (
            <EarthquakeDetail earthquake={selected} onClose={handleDeselect} />
          ) : (
            <EarthquakeList
              earthquakes={earthquakes}
              selected={selected}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {/* Desktop bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 hidden lg:block">
        <BottomBar
          earthquakes={earthquakes}
          lastUpdated={metadata?.generated ?? null}
        />
      </div>

      {/* Mobile bottom sheet */}
      <MobileSheet
        earthquakes={earthquakes}
        selected={selected}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />
    </div>
  );
}
