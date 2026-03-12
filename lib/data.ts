export type SeverityLevel = "critical" | "high" | "medium" | "low";

export interface Marker {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  category: string;
  casualties: number;
  displaced: number;
  startDate: string;
  description: string;
  parties: string[];
  events: MarkerEvent[];
  trend: "escalating" | "stable" | "de-escalating";
  tags?: string[];
}

export interface MarkerEvent {
  id: string;
  markerId: string;
  timestamp: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  source: string;
}

export interface RegionSummary {
  name: string;
  activeCount: number;
  severity: SeverityLevel;
  impact30d: number;
}

export interface DatasetConfig {
  name: string;
  subtitle: string;
  markerLabel: string;
  markerLabelPlural: string;
  eventLabel: string;
  severityLabels: Record<SeverityLevel, string>;
  impactLabel: string;
  displacedLabel: string;
}

// --- Default dataset: Global Conflicts ---

export const CONFLICT_DATASET: DatasetConfig = {
  name: "AEGIS",
  subtitle: "Global Conflict Intelligence",
  markerLabel: "Conflict",
  markerLabelPlural: "Conflicts",
  eventLabel: "Intel",
  severityLabels: {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
  },
  impactLabel: "Est. Casualties",
  displacedLabel: "Displaced",
};

export const markers: Marker[] = [
  {
    id: "ukr-001",
    name: "Ukraine-Russia War",
    region: "Eastern Europe",
    country: "Ukraine",
    lat: 48.38,
    lng: 34.5,
    severity: "critical",
    category: "Interstate War",
    casualties: 198400,
    displaced: 6300000,
    startDate: "2022-02-24",
    description:
      "Full-scale military invasion and ongoing territorial conflict in eastern and southern Ukraine.",
    parties: ["Ukraine", "Russia"],
    trend: "stable",
    events: [
      {
        id: "ukr-e1",
        markerId: "ukr-001",
        timestamp: "2026-02-08T14:30:00Z",
        title: "Renewed drone strikes on energy infrastructure",
        description:
          "Large-scale drone attack targeting power stations across multiple oblasts.",
        severity: "critical",
        source: "OSINT",
      },
      {
        id: "ukr-e2",
        markerId: "ukr-001",
        timestamp: "2026-02-07T09:15:00Z",
        title: "Frontline engagement near Pokrovsk",
        description:
          "Intense ground combat reported along the Donetsk front sector.",
        severity: "high",
        source: "ISW",
      },
    ],
  },
  {
    id: "sdn-001",
    name: "Sudan Civil War",
    region: "East Africa",
    country: "Sudan",
    lat: 15.5,
    lng: 32.53,
    severity: "critical",
    category: "Civil War",
    casualties: 24000,
    displaced: 8500000,
    startDate: "2023-04-15",
    description:
      "Armed conflict between the Sudanese Armed Forces and the Rapid Support Forces.",
    parties: ["SAF", "RSF"],
    trend: "escalating",
    events: [
      {
        id: "sdn-e1",
        markerId: "sdn-001",
        timestamp: "2026-02-08T11:00:00Z",
        title: "Humanitarian corridor blocked in Darfur",
        description:
          "Aid convoys halted after shelling near El Fasher distribution center.",
        severity: "critical",
        source: "UNHCR",
      },
    ],
  },
  {
    id: "gaz-001",
    name: "Israel-Palestine Conflict",
    region: "Middle East",
    country: "Israel / Palestine",
    lat: 31.35,
    lng: 34.31,
    severity: "critical",
    category: "Asymmetric War",
    casualties: 46000,
    displaced: 1900000,
    startDate: "2023-10-07",
    description:
      "Escalated military operations in Gaza following the October 7 attack.",
    parties: ["Israel", "Hamas", "PIJ"],
    trend: "stable",
    events: [
      {
        id: "gaz-e1",
        markerId: "gaz-001",
        timestamp: "2026-02-08T16:45:00Z",
        title: "Ceasefire negotiations resume in Doha",
        description:
          "Mediators present new framework for hostage exchange and phased withdrawal.",
        severity: "medium",
        source: "Reuters",
      },
    ],
  },
  {
    id: "myn-001",
    name: "Myanmar Civil War",
    region: "Southeast Asia",
    country: "Myanmar",
    lat: 19.76,
    lng: 96.07,
    severity: "high",
    category: "Civil War",
    casualties: 5800,
    displaced: 2600000,
    startDate: "2021-02-01",
    description:
      "Multi-front civil war following military coup and resistance movement.",
    parties: ["Military Junta", "NUG", "Ethnic Armies"],
    trend: "escalating",
    events: [
      {
        id: "myn-e1",
        markerId: "myn-001",
        timestamp: "2026-02-07T08:20:00Z",
        title: "Resistance forces capture key border town",
        description:
          "Combined ethnic alliance seized control of strategic crossing point to Thailand.",
        severity: "high",
        source: "Myanmar Now",
      },
    ],
  },
  {
    id: "eth-001",
    name: "Ethiopia - Regional Tensions",
    region: "East Africa",
    country: "Ethiopia",
    lat: 9.03,
    lng: 38.74,
    severity: "medium",
    category: "Internal Conflict",
    casualties: 3200,
    displaced: 4200000,
    startDate: "2020-11-04",
    description:
      "Post-Tigray ceasefire tensions with ongoing Amhara and Oromia insurgencies.",
    parties: ["Federal Government", "Fano", "OLA"],
    trend: "stable",
    events: [
      {
        id: "eth-e1",
        markerId: "eth-001",
        timestamp: "2026-02-06T13:00:00Z",
        title: "Fano militia clashes in Gondar region",
        description:
          "Security forces engaged Amhara Fano fighters near Gondar, multiple casualties reported.",
        severity: "medium",
        source: "ACLED",
      },
    ],
  },
  {
    id: "sah-001",
    name: "Sahel Insurgency",
    region: "West Africa",
    country: "Mali / Niger / Burkina Faso",
    lat: 14.0,
    lng: -1.5,
    severity: "high",
    category: "Insurgency",
    casualties: 7800,
    displaced: 3400000,
    startDate: "2012-01-01",
    description:
      "Jihadist insurgency spanning the tri-border area with growing territorial control.",
    parties: ["JNIM", "ISGS", "National Armies", "Wagner Group"],
    trend: "escalating",
    events: [
      {
        id: "sah-e1",
        markerId: "sah-001",
        timestamp: "2026-02-07T17:30:00Z",
        title: "JNIM attack on military outpost in central Mali",
        description:
          "Complex assault on Malian army position, dozens of soldiers killed.",
        severity: "high",
        source: "ACLED",
      },
    ],
  },
  {
    id: "drc-001",
    name: "DRC - Eastern Congo",
    region: "Central Africa",
    country: "DR Congo",
    lat: -1.68,
    lng: 29.22,
    severity: "high",
    category: "Civil Conflict",
    casualties: 6200,
    displaced: 6900000,
    startDate: "2021-01-01",
    description:
      "M23 rebel group offensive in North Kivu backed by Rwandan forces.",
    parties: ["M23", "FARDC", "MONUSCO", "Rwanda (alleged)"],
    trend: "escalating",
    events: [
      {
        id: "drc-e1",
        markerId: "drc-001",
        timestamp: "2026-02-08T06:00:00Z",
        title: "M23 seizes Goma outskirts",
        description:
          "Rebel forces advanced into the suburbs of Goma, the capital of North Kivu.",
        severity: "critical",
        source: "UN OCHA",
      },
    ],
  },
  {
    id: "som-001",
    name: "Somalia - Al-Shabaab",
    region: "East Africa",
    country: "Somalia",
    lat: 2.05,
    lng: 45.32,
    severity: "medium",
    category: "Insurgency",
    casualties: 2100,
    displaced: 3800000,
    startDate: "2006-01-01",
    description:
      "Ongoing al-Shabaab insurgency against the federal government and AMISOM forces.",
    parties: ["Al-Shabaab", "Federal Government", "ATMIS"],
    trend: "de-escalating",
    events: [
      {
        id: "som-e1",
        markerId: "som-001",
        timestamp: "2026-02-06T09:45:00Z",
        title: "Mogadishu car bomb targets checkpoint",
        description:
          "VBIED detonated at a government checkpoint near the international airport.",
        severity: "high",
        source: "OSINT",
      },
    ],
  },
  {
    id: "syr-001",
    name: "Syria Residual Conflict",
    region: "Middle East",
    country: "Syria",
    lat: 35.0,
    lng: 38.0,
    severity: "medium",
    category: "Multi-party Conflict",
    casualties: 1400,
    displaced: 6800000,
    startDate: "2011-03-15",
    description:
      "Post-transition instability with ISIS remnants and SDF-Turkish tensions.",
    parties: ["HTS Government", "SDF", "ISIS remnants", "Turkey"],
    trend: "de-escalating",
    events: [
      {
        id: "syr-e1",
        markerId: "syr-001",
        timestamp: "2026-02-05T14:00:00Z",
        title: "ISIS sleeper cell ambush in Deir ez-Zor",
        description:
          "SDF convoy attacked in desert region, prompting counter-operation.",
        severity: "medium",
        source: "SOHR",
      },
    ],
  },
  {
    id: "col-001",
    name: "Colombia Armed Groups",
    region: "South America",
    country: "Colombia",
    lat: 4.6,
    lng: -74.08,
    severity: "medium",
    category: "Internal Conflict",
    casualties: 890,
    displaced: 350000,
    startDate: "2017-01-01",
    description:
      "FARC dissident groups, ELN, and clan violence destabilizing rural regions.",
    parties: ["ELN", "FARC Dissidents", "Clan del Golfo", "Government"],
    trend: "stable",
    events: [
      {
        id: "col-e1",
        markerId: "col-001",
        timestamp: "2026-02-06T11:30:00Z",
        title: "ELN ceasefire extension talks stall",
        description:
          "Negotiators failed to agree on monitoring framework for bilateral ceasefire.",
        severity: "medium",
        source: "InSight Crime",
      },
    ],
  },
  {
    id: "yem-001",
    name: "Yemen Crisis",
    region: "Middle East",
    country: "Yemen",
    lat: 15.37,
    lng: 44.19,
    severity: "high",
    category: "Civil War / Proxy War",
    casualties: 4100,
    displaced: 4500000,
    startDate: "2014-09-01",
    description:
      "Houthi forces maintaining control of major territory; Red Sea shipping disruptions ongoing.",
    parties: ["Houthis", "Saudi-led Coalition", "Government"],
    trend: "stable",
    events: [
      {
        id: "yem-e1",
        markerId: "yem-001",
        timestamp: "2026-02-07T20:00:00Z",
        title: "Anti-ship missile targets commercial vessel",
        description:
          "Houthi forces launched ballistic missile at bulk carrier in Red Sea.",
        severity: "high",
        source: "UKMTO",
      },
    ],
  },
  {
    id: "hti-001",
    name: "Haiti Gang Violence",
    region: "Caribbean",
    country: "Haiti",
    lat: 18.54,
    lng: -72.34,
    severity: "high",
    category: "Gang Warfare / State Collapse",
    casualties: 5600,
    displaced: 700000,
    startDate: "2021-07-01",
    description:
      "Gang coalitions controlling major portions of Port-au-Prince amid state collapse.",
    parties: ["Viv Ansanm", "Gran Grif", "MSS Kenyan Force"],
    trend: "escalating",
    events: [
      {
        id: "hti-e1",
        markerId: "hti-001",
        timestamp: "2026-02-08T03:00:00Z",
        title: "Port-au-Prince airport forced closed",
        description:
          "Gang sniper fire on runway forced indefinite suspension of flights.",
        severity: "high",
        source: "AP",
      },
    ],
  },
];

export const regionSummaries: RegionSummary[] = [
  { name: "Eastern Europe", activeCount: 1, severity: "critical", impact30d: 3200 },
  { name: "Middle East", activeCount: 3, severity: "critical", impact30d: 2100 },
  { name: "East Africa", activeCount: 3, severity: "critical", impact30d: 1800 },
  { name: "West Africa", activeCount: 1, severity: "high", impact30d: 640 },
  { name: "Central Africa", activeCount: 1, severity: "high", impact30d: 520 },
  { name: "Southeast Asia", activeCount: 1, severity: "high", impact30d: 380 },
  { name: "South America", activeCount: 1, severity: "medium", impact30d: 120 },
  { name: "Caribbean", activeCount: 1, severity: "high", impact30d: 410 },
];

// --- Utility functions ---

export function getSeverityColor(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "text-red-500";
    case "high": return "text-orange-400";
    case "medium": return "text-yellow-400";
    case "low": return "text-emerald-400";
  }
}

export function getSeverityBg(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "bg-red-500/15 border-red-500/30";
    case "high": return "bg-orange-400/15 border-orange-400/30";
    case "medium": return "bg-yellow-400/15 border-yellow-400/30";
    case "low": return "bg-emerald-400/15 border-emerald-400/30";
  }
}

export function getSeverityDot(level: SeverityLevel): string {
  switch (level) {
    case "critical": return "bg-red-500";
    case "high": return "bg-orange-400";
    case "medium": return "bg-yellow-400";
    case "low": return "bg-emerald-400";
  }
}

export function getAllEvents(): MarkerEvent[] {
  return markers
    .flatMap((m) => m.events)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

export function getStats() {
  const totalMarkers = markers.length;
  const criticalCount = markers.filter((m) => m.severity === "critical").length;
  const totalCasualties = markers.reduce((sum, m) => sum + m.casualties, 0);
  const totalDisplaced = markers.reduce((sum, m) => sum + m.displaced, 0);
  const escalating = markers.filter((m) => m.trend === "escalating").length;

  return { totalMarkers, criticalCount, totalCasualties, totalDisplaced, escalating };
}
