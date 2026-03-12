"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Earthquake } from "@/app/api/earthquakes/route";

interface EarthquakeResponse {
  earthquakes: Earthquake[];
  metadata: {
    count: number;
    generated: number;
    title: string;
  };
}

// Poll USGS feed every 60 seconds
const POLL_INTERVAL = 60_000;

export function useEarthquakes() {
  const [data, setData] = useState<EarthquakeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/earthquakes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: EarthquakeResponse = await res.json();
      setData(json);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  // Refetch on window focus
  useEffect(() => {
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchData]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    earthquakes: data?.earthquakes ?? [],
    metadata: data?.metadata ?? null,
    isLoading,
    isError,
    refresh,
  };
}

// Utility helpers

export type MagnitudeLevel =
  | "extreme"
  | "major"
  | "strong"
  | "moderate"
  | "light";

export function getMagLevel(mag: number): MagnitudeLevel {
  if (mag >= 7) return "extreme";
  if (mag >= 6) return "major";
  if (mag >= 5) return "strong";
  if (mag >= 4) return "moderate";
  return "light";
}

export function getMagColor(mag: number): string {
  if (mag >= 7) return "#dc2626";
  if (mag >= 6) return "#ef4444";
  if (mag >= 5) return "#f97316";
  if (mag >= 4) return "#eab308";
  if (mag >= 3) return "#22c55e";
  return "#3b82f6";
}

export function getMagRadius(mag: number): number {
  if (mag >= 7) return 10;
  if (mag >= 6) return 9;
  if (mag >= 5) return 7;
  if (mag >= 4) return 6;
  if (mag >= 3) return 5;
  return 4;
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDepth(depth: number): string {
  return `${depth.toFixed(1)} km`;
}
