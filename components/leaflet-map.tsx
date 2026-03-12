"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import type { Earthquake } from "@/app/api/earthquakes/route";
import { getMagColor } from "@/hooks/use-earthquakes";
import { buildDotIcon } from "@/hooks/use-dot-icon"; // Declare the buildDotIcon variable

const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_TILES =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

interface LeafletMapProps {
  earthquakes: Earthquake[];
  selected: Earthquake | null;
  onSelect: (eq: Earthquake) => void;
}

function getPinSize(mag: number): { w: number; h: number } {
  if (mag >= 7) return { w: 28, h: 38 };
  if (mag >= 6) return { w: 24, h: 33 };
  if (mag >= 5) return { w: 22, h: 30 };
  if (mag >= 4) return { w: 18, h: 25 };
  if (mag >= 3) return { w: 16, h: 22 };
  return { w: 14, h: 20 };
}

function buildPinIcon(
  color: string,
  mag: number,
  isSelected: boolean,
  hasPulse: boolean
) {
  const { w, h } = getPinSize(mag);
  const padX = hasPulse ? 14 : 4;
  const padTop = 4;
  const padBot = 6;
  const totalW = w + padX * 2;
  const totalH = h + padTop + padBot;

  const stroke = isSelected ? "#fff" : `${color}dd`;
  const strokeW = isSelected ? 2 : 1;
  const filter = isSelected
    ? `filter:drop-shadow(0 0 6px ${color}80) drop-shadow(0 2px 4px rgba(0,0,0,0.4));`
    : `filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35));`;

  const pulseRing = hasPulse
    ? `<div class="marker-pulse" style="position:absolute;left:${totalW / 2 - 14}px;bottom:${padBot - 2}px;width:28px;height:28px;border-radius:50%;border:1.5px solid ${color};opacity:0.35;"></div>`
    : "";

  // Ground shadow ellipse
  const shadow = `<div style="position:absolute;bottom:${padBot - 3}px;left:${totalW / 2 - 6}px;width:12px;height:5px;border-radius:50%;background:rgba(0,0,0,${isSelected ? 0.35 : 0.2});"></div>`;

  return L.divIcon({
    className: "",
    iconSize: [totalW, totalH],
    iconAnchor: [totalW / 2, totalH - padBot],
    html: `<div style="width:${totalW}px;height:${totalH}px;position:relative;pointer-events:none;">
      ${pulseRing}
      ${shadow}
      <svg width="${w}" height="${h}" viewBox="0 0 24 34" style="position:absolute;left:${padX}px;top:${padTop}px;pointer-events:auto;cursor:pointer;${filter}transition:filter 0.2s ease;">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 22 12 22s12-13 12-22C24 5.373 18.627 0 12 0z" fill="${color}" stroke="${stroke}" strokeWidth="${strokeW}"/>
        <circle cx="12" cy="12" r="5" fill="rgba(0,0,0,0.25)"/>
        <circle cx="12" cy="12" r="3.5" fill="#fff" fillOpacity="0.9"/>
      </svg>
    </div>`,
  });
}

export function LeafletMap({
  earthquakes,
  selected,
  onSelect,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const { resolvedTheme } = useTheme();

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      maxBounds: [
        [-85, -Infinity],
        [85, Infinity],
      ],
      maxBoundsViscosity: 1.0,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      markersRef.current = [];
      markerMapRef.current.clear();
    };
  }, []);

  // Tiles
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);

    const url = resolvedTheme === "dark" ? DARK_TILES : LIGHT_TILES;
    const layer = L.tileLayer(url, { maxZoom: 18, subdomains: "abcd" });
    layer.addTo(map);
    tileRef.current = layer;

    if (containerRef.current) {
      containerRef.current.style.background =
        resolvedTheme === "dark" ? "#0a0e18" : "#edf2f7";
    }
  }, [resolvedTheme]);

  // Tooltip builder
  const buildTooltip = useCallback(
    (eq: Earthquake) => {
      const color = getMagColor(eq.mag);
      const bg =
        resolvedTheme === "dark"
          ? "rgba(10,14,24,0.95)"
          : "rgba(255,255,255,0.96)";
      const fg =
        resolvedTheme === "dark"
          ? "rgba(255,255,255,0.88)"
          : "rgba(15,23,42,0.88)";
      const sub =
        resolvedTheme === "dark"
          ? "rgba(255,255,255,0.5)"
          : "rgba(15,23,42,0.5)";
      return `<div style="background:${bg};border:1px solid ${color}50;border-radius:8px;padding:8px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.25);min-width:140px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:16px;font-weight:800;color:${color};font-family:var(--font-ibm-plex-mono),monospace;letter-spacing:-0.02em;">M${eq.mag.toFixed(1)}</span>
          <span style="font-size:10px;color:${sub};font-weight:500;">${eq.depth.toFixed(0)}km deep</span>
        </div>
        <div style="font-size:11px;font-weight:600;color:${fg};font-family:Inter,system-ui,sans-serif;line-height:1.3;">${eq.place}</div>
      </div>`;
    },
    [resolvedTheme],
  );

  // Render markers -- uses L.marker + L.divIcon (HTML-based, no SVG scaling during zoom)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const m of markersRef.current) map.removeLayer(m);
    markersRef.current = [];
    markerMapRef.current.clear();

    for (const eq of earthquakes) {
      const color = getMagColor(eq.mag);
      const isSelected = selected?.id === eq.id;
      const hasPulse = eq.mag >= 5;

      const icon = buildPinIcon(color, eq.mag, isSelected, hasPulse);
      const { h } = getPinSize(eq.mag);

      const marker = L.marker([eq.lat, eq.lng], {
        icon,
        interactive: true,
        bubblingMouseEvents: false,
      });

      marker.bindTooltip(buildTooltip(eq), {
        direction: "top",
        offset: [0, -(h + 6)],
        className: "marker-tooltip",
      });

      marker.on("click", () => onSelectRef.current(eq));
      marker.addTo(map);
      markersRef.current.push(marker);
      markerMapRef.current.set(eq.id, marker);
    }
  }, [earthquakes, selected, buildTooltip]);

  // Fly to selected
  useEffect(() => {
    if (selected && mapRef.current) {
      const zoom = selected.mag >= 6 ? 8 : selected.mag >= 5 ? 9 : 11;
      mapRef.current.flyTo([selected.lat, selected.lng], zoom, {
        duration: 1.5,
        easeLinearity: 0.3,
      });
    }
  }, [selected]);

  return <div ref={containerRef} className="w-full h-full" />;
}
