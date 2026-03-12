import { NextResponse } from "next/server";

const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

export const revalidate = 60;

export interface Earthquake {
  id: string;
  title: string;
  place: string;
  mag: number;
  depth: number;
  lat: number;
  lng: number;
  time: number;
  updated: number;
  tsunami: boolean;
  felt: number | null;
  alert: string | null;
  status: string;
  url: string;
  type: string;
}

export async function GET() {
  try {
    const res = await fetch(USGS_URL, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch USGS data" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const earthquakes: Earthquake[] = data.features.map(
      (feature: {
        id: string;
        properties: {
          title: string;
          place: string;
          mag: number;
          time: number;
          updated: number;
          tsunami: number;
          felt: number | null;
          alert: string | null;
          status: string;
          url: string;
          type: string;
        };
        geometry: {
          coordinates: [number, number, number];
        };
      }) => ({
        id: feature.id,
        title: feature.properties.title,
        place: feature.properties.place || "Unknown location",
        mag: feature.properties.mag,
        depth: feature.geometry.coordinates[2],
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        time: feature.properties.time,
        updated: feature.properties.updated,
        tsunami: feature.properties.tsunami === 1,
        felt: feature.properties.felt,
        alert: feature.properties.alert,
        status: feature.properties.status,
        url: feature.properties.url,
        type: feature.properties.type,
      })
    );

    // Sort by time descending (newest first)
    earthquakes.sort((a, b) => b.time - a.time);

    return NextResponse.json({
      earthquakes,
      metadata: {
        count: earthquakes.length,
        generated: data.metadata?.generated || Date.now(),
        title: data.metadata?.title || "USGS Earthquakes M2.5+ Past Day",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error fetching earthquake data" },
      { status: 500 }
    );
  }
}
