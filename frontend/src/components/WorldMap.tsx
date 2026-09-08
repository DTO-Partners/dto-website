import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Minus, Plus, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { geoCentroid, geoInterpolate, geoMercator, geoPath } from "d3-geo";
import countriesGeo from "react-svg-worldmap/dist/countries.geo.js";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";

type Region = "all" | "europe" | "middle-east";
type LabelAnchor = "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "top-left";

type CountryGeometry = {
  N: string;
  I: string;
  C: number[][][][];
};

type GeoFeature = {
  type: "Feature";
  properties: {
    name: string;
    iso2: string;
  };
  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
};

type CountryData = {
  country: string;
  value: number;
  color: string;
  name: string;
  description: string;
  industries: string[];
  established: string;
  services?: {
    title: string;
    description: string;
  }[];
};

type NetworkLocation = {
  countryCode: string;
  region: Exclude<Region, "all">;
  locationType: "country";
  labelAnchor: LabelAnchor;
};

type ProjectedLocation = NetworkLocation & {
  country: CountryData;
  coordinates: [number, number];
  x: number;
  y: number;
};

type CameraState = {
  userZoom: number;
};

const width = 1200;
const height = 720;
const minUserZoom = 1;
const maxUserZoom = 1.72;

const visibleCountries = [
  "pl",
  "de",
  "lu",
  "ie",
  "sa",
  "ae",
  "at",
  "be",
  "bg",
  "hr",
  "cy",
  "cz",
  "dk",
  "ee",
  "es",
  "fi",
  "fr",
  "gr",
  "hu",
  "it",
  "lt",
  "lv",
  "mt",
  "nl",
  "pt",
  "ro",
  "se",
  "si",
  "sk",
  "ch",
  "no",
  "is",
  "rs",
  "me",
  "mk",
  "ba",
  "al",
  "md",
  "ua",
  "by",
  "gb",
  "ge",
  "am",
  "az",
  "ru",
  "xk",
  "tr",
  "sy",
  "lb",
  "jo",
  "il",
  "ps",
  "iq",
  "ir",
  "kw",
  "bh",
  "qa",
  "om",
  "ye",
  "kz",
  "uz",
  "tm",
  "kg",
  "tj",
  "af",
  "pk",
  "eg",
  "sd",
  "er",
  "et",
  "so",
];

const europe = ["at", "be", "bg", "hr", "cy", "cz", "dk", "ee", "es", "fi", "fr", "gr", "hu", "it", "lt", "lv", "mt", "ro", "se", "si", "sk", "ch", "no", "is", "rs", "me", "mk", "ba", "al", "md", "ua", "by", "gb", "ie", "ge", "am", "az", "ru", "xk", "pl", "de", "lu"];
const middleEast = ["tr", "sy", "lb", "jo", "il", "ps", "iq", "ir", "kw", "bh", "qa", "ae", "om", "sa", "ye", "kz", "uz", "tm", "kg", "tj", "af", "pk", "eg", "sd", "er", "et", "so"];
const coreCountries = ["pl", "de", "lu", "ie", "sa", "ae"];

const networkLocations: NetworkLocation[] = [
  { countryCode: "ie", region: "europe", locationType: "country", labelAnchor: "top-left" },
  { countryCode: "lu", region: "europe", locationType: "country", labelAnchor: "bottom-left" },
  { countryCode: "de", region: "europe", locationType: "country", labelAnchor: "top-right" },
  { countryCode: "pl", region: "europe", locationType: "country", labelAnchor: "right" },
  { countryCode: "sa", region: "middle-east", locationType: "country", labelAnchor: "bottom-left" },
  { countryCode: "ae", region: "middle-east", locationType: "country", labelAnchor: "bottom-right" },
];

const filterLabels = {
  en: {
    all: "All network",
    europe: "Europe",
    "middle-east": "Middle East",
    drag: "Drag to explore",
    exploring: "Exploring",
    reset: "Reset",
    view: "View",
    regionEurope: "Europe",
    regionMiddleEast: "Middle East",
    viewDetails: "View details",
    region: "Region",
  },
  pl: {
    all: "Cała sieć",
    europe: "Europa",
    "middle-east": "Bliski Wschód",
    drag: "Przeciągnij mapę",
    exploring: "Eksploracja",
    reset: "Reset",
    view: "Zobacz",
    regionEurope: "Europa",
    regionMiddleEast: "Bliski Wschód",
    viewDetails: "Zobacz szczegóły",
    region: "Region",
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: 22 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

const mapFeatures: GeoFeature[] = (countriesGeo.features as CountryGeometry[]).map((country) => ({
  type: "Feature",
  properties: {
    name: country.N,
    iso2: country.I.toLowerCase(),
  },
  geometry: {
    type: "MultiPolygon",
    coordinates: country.C,
  },
}));

const featureByCode = new Map(mapFeatures.map((feature) => [feature.properties.iso2, feature]));

function getRegion(country: string): Region {
  if (europe.includes(country)) return "europe";
  if (middleEast.includes(country)) return "middle-east";
  return "all";
}

function getBoundsForRegion(region: Region): GeoFeature[] {
  const codes = region === "all" ? coreCountries : networkLocations.filter((location) => location.region === region).map((location) => location.countryCode);

  return codes.map((code) => featureByCode.get(code)).filter((feature): feature is GeoFeature => Boolean(feature));
}

function getPadding(region: Region, selectedCode: string | null) {
  if (region === "europe") return [[86, 92], [width - 150, height - 88]] as [[number, number], [number, number]];
  if (region === "middle-east") return [[96, 92], [width - 158, height - 92]] as [[number, number], [number, number]];
  if (selectedCode) return [[82, 92], [width - 390, height - 92]] as [[number, number], [number, number]];

  return [[80, 86], [width - 120, height - 86]] as [[number, number], [number, number]];
}

function createProjection(region: Region, selectedCode: string | null, userZoom: number) {
  const boundsFeatures = getBoundsForRegion(region);
  const projection = geoMercator();
  projection.fitExtent(getPadding(region, selectedCode), {
    type: "FeatureCollection",
    features: boundsFeatures,
  });
  projection.scale(projection.scale() * userZoom);

  if (selectedCode) {
    const selectedFeature = featureByCode.get(selectedCode);
    if (selectedFeature) {
      const [longitude, latitude] = geoCentroid(selectedFeature);
      projection.center([longitude, latitude]);
    }
  }

  return projection;
}

function labelOffset(anchor: LabelAnchor) {
  const offsets: Record<LabelAnchor, { x: number; y: number; textAnchor: "start" | "middle" | "end"; dominantBaseline: "auto" | "middle" | "hanging" }> = {
    top: { x: 0, y: -20, textAnchor: "middle", dominantBaseline: "auto" },
    "top-right": { x: 17, y: -16, textAnchor: "start", dominantBaseline: "auto" },
    right: { x: 18, y: 1, textAnchor: "start", dominantBaseline: "middle" },
    "bottom-right": { x: 17, y: 18, textAnchor: "start", dominantBaseline: "hanging" },
    bottom: { x: 0, y: 22, textAnchor: "middle", dominantBaseline: "hanging" },
    "bottom-left": { x: -17, y: 18, textAnchor: "end", dominantBaseline: "hanging" },
    left: { x: -18, y: 1, textAnchor: "end", dominantBaseline: "middle" },
    "top-left": { x: -17, y: -16, textAnchor: "end", dominantBaseline: "auto" },
  };

  return offsets[anchor];
}

function greatCirclePath(from: [number, number], to: [number, number], projection: ReturnType<typeof geoMercator>) {
  const interpolate = geoInterpolate(from, to);
  const points = Array.from({ length: 34 }, (_, index) => interpolate(index / 33))
    .map((point) => projection(point as [number, number]))
    .filter((point): point is [number, number] => Boolean(point));

  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, size };
}

export default function WorldMapComponent({ autoTour = false }: { autoTour?: boolean }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [camera, setCamera] = useState<CameraState>({ userZoom: 1 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [animatedCountries, setAnimatedCountries] = useState<Set<string>>(new Set());
  const [hasDrawnConnection, setHasDrawnConnection] = useState(false);
  const [filterRegion, setFilterRegion] = useState<Region>("all");
  const hasAutoToured = useRef(false);
  const reduced = useReducedMotion();
  const { ref: mapAreaRef, size: mapAreaSize } = useElementSize<HTMLDivElement>();
  const { i18n, t } = useTranslation();
  const language = i18n.language?.startsWith("pl") ? "pl" : "en";
  const labels = filterLabels[language];

  const data = useMemo(() => {
    const colors = {
      pl: "#c99a57",
      de: "#9a8f80",
      lu: "#b8a16f",
      ie: "#879b90",
      sa: "#9f8a64",
      ae: "#bfb3a4",
    };

    return coreCountries.map((countryCode) => {
      const countryData = t(`worldMap.countries.${countryCode}`, { returnObjects: true }) as Omit<CountryData, "country" | "value" | "color">;

      return {
        country: countryCode,
        value: 1,
        color: colors[countryCode as keyof typeof colors] || "#c99a57",
        ...countryData,
      };
    });
  }, [t]);

  const selectedCode = selectedCountry?.country ?? null;
  const activeCode = hoveredCountry ?? selectedCode;

  const projection = useMemo(() => {
    return createProjection(filterRegion, selectedCode, camera.userZoom);
  }, [camera.userZoom, filterRegion, selectedCode]);

  const path = useMemo(() => geoPath(projection), [projection]);

  const projectedLocations = useMemo<ProjectedLocation[]>(() => {
    return networkLocations
      .map((location) => {
        const feature = featureByCode.get(location.countryCode);
        const country = data.find((item) => item.country === location.countryCode);
        if (!feature || !country) return null;

        const coordinates = geoCentroid(feature) as [number, number];
        const point = projection(coordinates);
        if (!point) return null;

        return {
          ...location,
          country,
          coordinates,
          x: point[0],
          y: point[1],
        };
      })
      .filter((location): location is ProjectedLocation => Boolean(location));
  }, [data, projection]);

  const projectedByCode = useMemo(() => new Map(projectedLocations.map((location) => [location.countryCode, location])), [projectedLocations]);
  const activeProjectedLocations = useMemo(() => {
    return projectedLocations.filter((location) => filterRegion === "all" || getRegion(location.countryCode) === filterRegion);
  }, [filterRegion, projectedLocations]);

  const networkConnections = useMemo(() => {
    const hub = projectedByCode.get("pl");
    if (!hub) return [];

    return activeProjectedLocations
      .filter((location) => location.countryCode !== "pl")
      .map((location) => ({
        from: "pl",
        to: location.countryCode,
        d: greatCirclePath(hub.coordinates, location.coordinates, projection),
      }));
  }, [activeProjectedLocations, projectedByCode, projection]);

  const setRegion = (region: Region) => {
    setFilterRegion(region);
    setSelectedCountry(null);
    setHoveredCountry(null);
    setCamera({ userZoom: 1 });
  };

  const handleCountryClick = useCallback(
    (countryCode: string) => {
      const code = countryCode.toLowerCase();
      const country = data.find((item) => item.country === code);
      if (!country) return;

      setSelectedCountry(country);
      setHoveredCountry(null);
      setCamera((currentCamera) => ({
        ...currentCamera,
        userZoom: reduced ? currentCamera.userZoom : Math.max(1.08, currentCamera.userZoom),
      }));
      setAnimatedCountries(new Set([code]));
      window.setTimeout(() => setAnimatedCountries(new Set()), 900);
    },
    [data, reduced],
  );

  const clearSelection = useCallback(() => {
    setSelectedCountry(null);
    setHoveredCountry(null);
  }, []);

  const runTour = useCallback(() => {
    if (reduced) {
      setHasDrawnConnection(true);
      return;
    }

    const timers = [
      window.setTimeout(() => setAnimatedCountries(new Set(["pl"])), 300),
      window.setTimeout(() => setHasDrawnConnection(true), 700),
      window.setTimeout(() => setAnimatedCountries(new Set(["ae"])), 1350),
      window.setTimeout(() => setAnimatedCountries(new Set()), 2100),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduced]);

  useEffect(() => {
    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!autoTour || hasAutoToured.current) return;
    hasAutoToured.current = true;
    const cleanupTimer = window.setTimeout(() => {
      const cleanup = runTour();
      if (cleanup) {
        window.setTimeout(cleanup, 2400);
      }
    }, 300);

    return () => window.clearTimeout(cleanupTimer);
  }, [autoTour, runTour]);

  useEffect(() => {
    if (reduced) setHasDrawnConnection(true);
  }, [reduced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearSelection();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [clearSelection]);

  const selectedPanelRegion = selectedCountry ? (getRegion(selectedCountry.country) === "middle-east" ? labels.regionMiddleEast : labels.regionEurope) : "";
  const cursorLocation = hoveredCountry ? data.find((item) => item.country === hoveredCountry) : null;
  const panelHeading = selectedCountry ? selectedCountry.name.split(/\s+/).join("\n") : "";
  const panelAvailable = typeof document !== "undefined";
  const effectiveMapWidth = mapAreaSize.width || width;
  const effectiveMapHeight = mapAreaSize.height || 640;

  const regionIsActive = (country: string) => filterRegion === "all" || getRegion(country) === filterRegion;

  const isConnectionActive = (from: string, to: string) => {
    if (!selectedCode) return hoveredCountry === from || hoveredCountry === to || activeCode === from || activeCode === to;
    if (selectedCode === "pl") return true;
    return from === selectedCode || to === selectedCode;
  };

  const countryIsRelated = (country: string) => {
    if (!selectedCode) return true;
    if (country === selectedCode) return true;
    if (selectedCode === "pl") return coreCountries.includes(country);
    return country === "pl";
  };

  const visibleFeatureSet = new Set(visibleCountries);

  return (
    <div className="relative min-h-[70svh] overflow-hidden lg:min-h-[78svh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_50%,rgba(199,149,75,.18),transparent_30%),radial-gradient(circle_at_78%_62%,rgba(242,239,231,.075),transparent_22%)]" />

      <div className="absolute right-0 top-0 z-30 grid justify-items-end gap-3 text-right">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#c99a57]">{labels.region}</span>
        <div className="-mr-2 flex max-w-[calc(100vw-2.5rem)] gap-5 overflow-x-auto px-2 pb-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#f2efe7]/48">
          {(["all", "europe", "middle-east"] as Region[]).map((region) => (
            <button
              type="button"
              key={region}
              onClick={() => setRegion(region)}
              className={`relative inline-flex min-h-11 shrink-0 items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70 ${
                filterRegion === region ? "text-[#f2efe7]" : "hover:text-[#f2efe7]/78"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition ${filterRegion === region ? "bg-[#c99a57]" : "bg-[#f2efe7]/18"}`} />
              {labels[region]}
              <span className={`absolute bottom-1 left-3 h-px bg-[#c99a57] transition-all duration-300 ${filterRegion === region ? "w-[calc(100%-0.75rem)]" : "w-0"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 right-0 z-30 flex items-center gap-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/58 md:bottom-5">
        <button type="button" onClick={() => setCamera((currentCamera) => ({ ...currentCamera, userZoom: Math.min(currentCamera.userZoom + 0.12, maxUserZoom) }))} className="grid min-h-10 min-w-10 place-items-center transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.zoomIn")}>
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setCamera((currentCamera) => ({ ...currentCamera, userZoom: Math.max(currentCamera.userZoom - 0.12, minUserZoom) }))} className="grid min-h-10 min-w-10 place-items-center transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.zoomOut")}>
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-1 h-4 w-px bg-white/14" />
        <button type="button" onClick={() => setRegion("all")} className="min-h-10 px-2 transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.resetView")}>
          {labels.reset}
        </button>
        <button type="button" onClick={runTour} className="grid min-h-10 min-w-10 place-items-center transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.highlightTour")}>
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      <div className="relative min-h-[560px] pt-12 md:min-h-[640px] lg:min-h-[700px] lg:pt-0">
        <div
          ref={mapAreaRef}
          className="network-map-area absolute inset-0 overflow-hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) clearSelection();
          }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
          }}
          onPointerEnter={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
            setIsCursorVisible(true);
          }}
          onPointerLeave={() => {
            setHoveredCountry(null);
            setIsCursorVisible(false);
          }}
        >
          <motion.svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute left-1/2 top-1/2 h-[min(104%,720px)] w-[min(100%,1280px)] -translate-x-1/2 -translate-y-1/2 overflow-visible"
            style={{ width: effectiveMapWidth, height: effectiveMapHeight }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="img"
            aria-label={t("worldMap.header.title")}
          >
            <g>
              {mapFeatures.map((feature) => {
                const countryCode = feature.properties.iso2;
                const country = data.find((item) => item.country === countryCode);
                const isVisibleContext = visibleFeatureSet.has(countryCode);
                const isRegionActive = regionIsActive(countryCode);
                const countryIsInteractive = Boolean(country && isRegionActive);
                const isSelected = selectedCode === countryCode;
                const isHovered = hoveredCountry === countryCode;
                const isAnimated = animatedCountries.has(countryCode);
                const isRelated = countryIsRelated(countryCode);

                if (!isVisibleContext) return null;

                return (
                  <path
                    key={countryCode}
                    d={path(feature) ?? undefined}
                    fill={country ? (isSelected || isHovered || isAnimated ? "#d8b36f" : country.color) : "#25211c"}
                    stroke={country ? "rgba(242,239,231,.42)" : "#3a332b"}
                    strokeWidth={country && (isSelected || isHovered || isAnimated) ? 1.35 : 0.7}
                    opacity={country ? (isRegionActive ? (isRelated ? 1 : 0.34) : 0.12) : isRegionActive ? 0.48 : 0.12}
                    style={{
                      cursor: countryIsInteractive ? "pointer" : "default",
                      filter: isSelected || isAnimated ? "drop-shadow(0 0 5px rgba(201,154,87,.34))" : "none",
                      transition: "fill 180ms ease, opacity 240ms ease, stroke-width 180ms ease",
                    }}
                    onClick={(event) => {
                      if (!countryIsInteractive) return;
                      event.stopPropagation();
                      handleCountryClick(countryCode);
                    }}
                    onMouseEnter={() => countryIsInteractive && setHoveredCountry(countryCode)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })}
            </g>

            <g fill="none" aria-hidden="true">
              {networkConnections.map((connection) => {
                const connectionActive = isConnectionActive(connection.from, connection.to);
                const connectionDimmed = selectedCode && !connectionActive;

                return (
                  <motion.path
                    key={`${connection.from}-${connection.to}`}
                    d={connection.d}
                    stroke="#c99a57"
                    strokeWidth={connectionActive ? 2.3 : 1.25}
                    strokeLinecap="round"
                    pathLength="1"
                    initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                    animate={
                      hasDrawnConnection || reduced
                        ? { pathLength: 1, opacity: connectionActive ? 0.82 : connectionDimmed ? 0.12 : 0.3 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{ duration: reduced ? 0.01 : 1.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
            </g>

            <g>
              {activeProjectedLocations.map((location) => {
                const isNodeActive = selectedCode === location.countryCode || hoveredCountry === location.countryCode || animatedCountries.has(location.countryCode);
                const showDetailLabel = selectedCode === location.countryCode || hoveredCountry === location.countryCode;
                const isDimmed = !regionIsActive(location.countryCode);
                const isRelatedNode = countryIsRelated(location.countryCode);
                const label = labelOffset(location.labelAnchor);

                return (
                  <g key={location.countryCode} opacity={isDimmed ? 0.24 : isRelatedNode ? 1 : 0.34}>
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r={isNodeActive ? 12 : isRelatedNode ? 8.5 : 7}
                      fill="#c99a57"
                      stroke="rgba(242,239,231,.75)"
                      strokeWidth={isNodeActive ? 2 : 1.2}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r={animatedCountries.has(location.countryCode) ? 25 : 15}
                      fill="none"
                      stroke="rgba(201,154,87,.42)"
                      strokeWidth="1.2"
                      className={animatedCountries.has(location.countryCode) ? "network-node-pulse" : ""}
                    />
                    <text
                      x={location.x + label.x}
                      y={location.y + label.y}
                      textAnchor={label.textAnchor}
                      dominantBaseline={label.dominantBaseline}
                      className="pointer-events-none fill-[#d2ad6b] text-[0.68rem] font-semibold uppercase tracking-[0.2em]"
                    >
                      {location.country.name}
                    </text>
                    {showDetailLabel && (
                      <text
                        x={location.x + label.x}
                        y={location.y + label.y + (label.dominantBaseline === "hanging" ? 16 : 14)}
                        textAnchor={label.textAnchor}
                        dominantBaseline={label.dominantBaseline}
                        className="pointer-events-none fill-[#f2efe7] text-[0.54rem] font-semibold uppercase tracking-[0.18em] opacity-60"
                      >
                        {getRegion(location.countryCode) === "middle-east" ? labels.regionMiddleEast : labels.regionEurope} · {location.country.established}
                      </text>
                    )}
                    <foreignObject x={location.x - 22} y={location.y - 22} width="44" height="44">
                      <button
                        type="button"
                        aria-label={t("worldMap.accessibility.viewCountry", { country: location.country.name })}
                        className="h-11 w-11 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f2efe7]"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCountryClick(location.countryCode);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleCountryClick(location.countryCode);
                          }
                        }}
                        onMouseEnter={() => setHoveredCountry(location.countryCode)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onFocus={() => setHoveredCountry(location.countryCode)}
                        onBlur={() => setHoveredCountry(null)}
                      />
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          </motion.svg>

          {isFinePointer && isCursorVisible && cursorLocation && (
            <div
              className="pointer-events-none absolute z-50 hidden rounded-md border border-white/[0.08] bg-[#0d0d0c]/88 px-3 py-2 text-[0.58rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-[#f2efe7]/76 shadow-[0_14px_36px_rgba(0,0,0,.28)] backdrop-blur-lg lg:block"
              style={{ left: cursorPosition.x + 14, top: cursorPosition.y + 14 }}
            >
              <span className="block text-[#c99a57]">{cursorLocation.name}</span>
              <span className="block text-[#f2efe7]/52">
                {getRegion(cursorLocation.country) === "middle-east" ? labels.regionMiddleEast : labels.regionEurope} · {cursorLocation.established}
              </span>
              <span className="block">{labels.viewDetails} ↗</span>
            </div>
          )}
        </div>

        {panelAvailable &&
          createPortal(
            <AnimatePresence>
              {selectedCountry && (
                <motion.aside
                  role="region"
                  aria-label={t("worldMap.panel.ariaLabel", { country: selectedCountry.name })}
                  variants={panelVariants}
                  initial={reduced ? false : "hidden"}
                  animate="visible"
                  exit="exit"
                  transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-x-4 bottom-4 z-[80] max-h-[58svh] overflow-y-auto rounded-t-2xl border border-white/[0.08] bg-[#0d0d0c]/94 p-5 text-[#f2efe7] shadow-[0_24px_80px_rgba(0,0,0,.38)] backdrop-blur-[16px] gdpr-modal-scroll md:inset-x-8 lg:inset-x-auto lg:bottom-10 lg:right-[max(3rem,calc((100vw-1540px)/2+3rem))] lg:top-32 lg:w-[420px] lg:max-h-none lg:rounded-2xl lg:p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#c99a57]">
                        {selectedCountry.country.toUpperCase()} / {selectedPanelRegion}
                      </p>
                      <div className="mt-5 overflow-hidden">
                        <motion.h3
                          key={`${selectedCountry.country}-title`}
                          initial={reduced ? false : { y: "110%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: reduced ? 0.01 : 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                          className="whitespace-pre-line text-[clamp(2.3rem,4vw,3.4rem)] font-semibold uppercase leading-[0.92]"
                        >
                          {panelHeading}
                        </motion.h3>
                      </div>
                    </div>
                    <button type="button" onClick={clearSelection} className="grid min-h-10 min-w-10 shrink-0 place-items-center text-[#f2efe7]/58 transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.modal.closeModal")}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <motion.div
                    key={`${selectedCountry.country}-content`}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0.01 : 0.45, delay: 0.16 }}
                  >
                    <section className="mt-5 border-t border-white/[0.08] pt-5">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/48">
                        {t("worldMap.panel.dtoInCountry", { country: selectedCountry.name })}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#d7cec0]/82">{selectedCountry.description}</p>
                    </section>

                    {selectedCountry.services && selectedCountry.services.length > 0 && (
                      <section className="mt-6 border-t border-white/[0.08] pt-5">
                        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/48">
                          {t("worldMap.panel.whatWeDo")}
                        </p>
                        <div className="mt-4 grid gap-4">
                          {selectedCountry.services.map((service, index) => (
                            <div key={service.title} className="grid grid-cols-[1.8rem_1fr] gap-2">
                              <span className="font-mono text-xs text-[#c99a57]/78">{String(index + 1).padStart(2, "0")}</span>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f2efe7]">{service.title}</p>
                                <p className="mt-1 text-sm leading-5 text-[#d7cec0]/72">{service.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="mt-6 border-t border-white/[0.08] pt-5">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/48">
                        {t("worldMap.panel.sectors")}
                      </p>
                      <div className="mt-4 grid gap-2">
                        {selectedCountry.industries.map((industry, index) => (
                          <span key={industry} className="grid grid-cols-[1.6rem_1fr] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#f2efe7]/72">
                            <span className="font-mono text-[#c99a57]/78">{String(index + 1).padStart(2, "0")}</span>
                            {industry}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section className="mt-6 border-t border-white/[0.08] pt-5">
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/48">
                        {t("worldMap.panel.network")}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#d7cec0]/78">
                        {t("worldMap.panel.partnershipEstablished")} {selectedCountry.established}
                      </p>
                    </section>

                    <Link
                      to="Candidates & Employers"
                      smooth
                      duration={650}
                      offset={-80}
                      className="group mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#c99a57] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d0d0c] transition hover:bg-[#e0b66d] focus:outline-none focus:ring-2 focus:ring-[#f2efe7]"
                    >
                      {t("worldMap.panel.cta")}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                    </Link>
                  </motion.div>
                </motion.aside>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </div>
    </div>
  );
}
