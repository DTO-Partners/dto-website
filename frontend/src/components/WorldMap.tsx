import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { WorldMap } from "react-svg-worldmap";

type Region = "all" | "europe" | "middle-east";

type CountryData = {
  country: string;
  value: number;
  color: string;
  name: string;
  description: string;
  industries: string[];
  established: string;
};

type NetworkNode = {
  country: string;
  region: Region;
  x: number;
  y: number;
  labelOffset: string;
};

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
];

const europe = ["at", "be", "bg", "hr", "cy", "cz", "dk", "ee", "es", "fi", "fr", "gr", "hu", "it", "lt", "lv", "mt", "ro", "se", "si", "sk", "ch", "no", "is", "rs", "me", "mk", "ba", "al", "md", "ua", "by", "gb", "ie", "ge", "am", "az", "ru", "xk", "pl", "de", "lu"];
const middleEast = ["tr", "sy", "lb", "jo", "il", "ps", "iq", "ir", "kw", "bh", "qa", "ae", "om", "sa", "ye", "kz", "uz", "tm", "kg", "tj", "af", "pk"];
const coreCountries = ["pl", "de", "lu", "ie", "sa", "ae"];
const networkNodes: NetworkNode[] = [
  { country: "pl", region: "europe", x: 53.2, y: 44.6, labelOffset: "-translate-x-[92%] -translate-y-[122%] text-right" },
  { country: "ae", region: "middle-east", x: 59.4, y: 57.2, labelOffset: "translate-x-4 -translate-y-1/2 text-left" },
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
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: 22 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

function getRegion(country: string): Region {
  if (europe.includes(country)) return "europe";
  if (middleEast.includes(country)) return "middle-east";
  return "all";
}

export default function WorldMapComponent({ autoTour = false }: { autoTour?: boolean }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.18);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 64 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [animatedCountries, setAnimatedCountries] = useState<Set<string>>(new Set());
  const [hasDrawnConnection, setHasDrawnConnection] = useState(false);
  const [filterRegion, setFilterRegion] = useState<Region>("all");
  const hasAutoToured = useRef(false);
  const reduced = useReducedMotion();
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

  const setRegion = (region: Region) => {
    setFilterRegion(region);
    setSelectedCountry(null);
    if (region === "europe") {
      setZoomLevel(1.62);
      setPanPosition({ x: 116, y: 92 });
    } else if (region === "middle-east") {
      setZoomLevel(1.72);
      setPanPosition({ x: -112, y: 92 });
    } else {
      setZoomLevel(1.18);
      setPanPosition({ x: 0, y: 64 });
    }
  };

  const handleCountryClick = useCallback(
    (countryCode: string) => {
      const code = countryCode.toLowerCase();
      const country = data.find((item) => item.country === code);
      if (!country) return;
      setSelectedCountry(country);
      setAnimatedCountries(new Set([code]));
      window.setTimeout(() => setAnimatedCountries(new Set()), 900);
    },
    [data],
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
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearSelection]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setDragStart({ x: event.clientX - panPosition.x, y: event.clientY - panPosition.y });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    if (!isDragging) return;
    const maxPan = 220 * zoomLevel;
    setPanPosition({
      x: Math.max(-maxPan, Math.min(maxPan, event.clientX - dragStart.x)),
      y: Math.max(-maxPan, Math.min(maxPan, event.clientY - dragStart.y)),
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const regionIsActive = (country: string) => filterRegion === "all" || getRegion(country) === filterRegion;
  const selectedPanelRegion = selectedCountry ? (getRegion(selectedCountry.country) === "middle-east" ? labels.regionMiddleEast : labels.regionEurope) : "";
  const cursorCountry = hoveredCountry ? data.find((item) => item.country === hoveredCountry)?.name : null;

  return (
    <div className="relative min-h-[70svh] overflow-hidden lg:min-h-[78svh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_50%,rgba(199,149,75,.18),transparent_30%),radial-gradient(circle_at_78%_62%,rgba(242,239,231,.075),transparent_22%)]" />

      <div className="absolute right-0 top-0 z-30 grid justify-items-end gap-3 text-right">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#c99a57]">Region</span>
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
          <button type="button" onClick={() => setZoomLevel((value) => Math.min(value + 0.3, 4))} className="grid min-h-10 min-w-10 place-items-center transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.zoomIn")}>
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoomLevel((value) => Math.max(value - 0.3, 0.9))} className="grid min-h-10 min-w-10 place-items-center transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.zoomOut")}>
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
          className={`network-map-area absolute inset-0 overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) clearSelection();
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerEnter={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setCursorPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
            setIsCursorVisible(true);
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            setIsDragging(false);
            setHoveredCountry(null);
            setIsCursorVisible(false);
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[520px] w-[1040px] sm:h-[600px] sm:w-[1200px] lg:h-[650px] lg:w-[1300px]"
            style={{
              transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transition: isDragging || reduced ? "none" : "transform 520ms cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-100">
              <WorldMap
                title=""
                valueSuffix=""
                color="#c99a57"
                size={1000}
                data={data}
                frame={false}
                richInteraction
                tooltipBgColor="#171410"
                tooltipTextColor="#f2efe7"
                tooltipTextFunction={(context) => {
                  const country = data.find((item) => item.country === context.countryCode?.toLowerCase());
                  if (!country) return t("worldMap.tooltips.exploreOpportunities");
                  const region = getRegion(country.country) === "middle-east" ? "MIDDLE EAST" : "EUROPE";
                  return `${country.name} · ${region} · ${country.established}`;
                }}
                onClickFunction={(context) => handleCountryClick(context.countryCode)}
                styleFunction={(context) => {
                  const currentCountry = context.countryCode?.toLowerCase() || "";
                  const country = data.find((item) => item.country === currentCountry);
                  const isVisibleContext = visibleCountries.includes(currentCountry);
                  const isRegionActive = regionIsActive(currentCountry);
                  const isSelected = selectedCode === currentCountry;
                  const isHovered = hoveredCountry === currentCountry;
                  const isAnimated = animatedCountries.has(currentCountry);

                  if (!isVisibleContext) {
                    return { fill: "#151411", stroke: "#29241e", strokeWidth: 0.4, opacity: 0.36, pointerEvents: "none" };
                  }

                  return {
                    fill: country ? (isSelected || isHovered || isAnimated ? "#d8b36f" : country.color) : "#25211c",
                    stroke: country ? "rgba(242,239,231,.42)" : "#3a332b",
                    strokeWidth: country && (isSelected || isHovered || isAnimated) ? 1.45 : 0.65,
                    cursor: country ? "pointer" : "default",
                    opacity: country ? (isRegionActive ? (selectedCode && !isSelected ? 0.54 : 1) : 0.2) : isRegionActive ? 0.58 : 0.2,
                    transition: "fill 180ms ease, opacity 240ms ease, stroke-width 180ms ease",
                    filter: isSelected || isAnimated ? "drop-shadow(0 0 7px rgba(201,154,87,.42))" : "none",
                  };
                }}
              />
            </div>

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M53.2 44.6 C 55.2 46.8, 57.4 52, 59.4 57.2"
                fill="none"
                stroke="#c99a57"
                strokeWidth="0.15"
                strokeLinecap="round"
                pathLength="1"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={hasDrawnConnection || reduced ? { pathLength: 1, opacity: activeCode === "pl" || activeCode === "ae" ? 0.84 : 0.42 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0.01 : 1.05, ease: [0.22, 1, 0.36, 1] }}
              />
              {!reduced && hasDrawnConnection && (
                <circle r="0.34" fill="#d6b16d" opacity="0.72">
                  <animateMotion dur="8s" repeatCount="indefinite" path="M53.2 44.6 C 55.2 46.8, 57.4 52, 59.4 57.2" />
                </circle>
              )}
            </svg>

            {networkNodes.map((node) => {
              const country = data.find((item) => item.country === node.country);
              if (!country) return null;
              const isNodeActive = selectedCode === node.country || hoveredCountry === node.country || animatedCountries.has(node.country);
              const isDimmed = !regionIsActive(node.country);

              return (
                <div key={node.country} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                  <button
                    type="button"
                    aria-label={`View ${country.name} network information`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCountryClick(node.country);
                    }}
                    onMouseEnter={() => setHoveredCountry(node.country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onFocus={() => setHoveredCountry(node.country)}
                    onBlur={() => setHoveredCountry(null)}
                    className={`network-node relative grid place-items-center rounded-full bg-[#c99a57] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#f2efe7] ${
                      isNodeActive ? "h-4 w-4" : "h-3 w-3"
                    } ${isDimmed ? "opacity-25" : "opacity-100"}`}
                  >
                    <span className={`absolute rounded-full border border-[#c99a57]/55 ${animatedCountries.has(node.country) ? "network-node-pulse h-8 w-8" : "h-5 w-5 opacity-30"}`} />
                  </button>
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: isDimmed ? 0.18 : isNodeActive || node.country === "pl" || node.country === "ae" ? 1 : 0.55, y: 0 }}
                    className={`pointer-events-none absolute top-0 min-w-28 text-[0.52rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-[#d2ad6b] ${
                      node.country === "ae" ? "max-sm:-translate-x-[96%] max-sm:-translate-y-[118%] max-sm:text-right" : ""
                    } ${node.labelOffset}`}
                  >
                    <span className="block">{country.name}</span>
                    <span className="block text-[#f2efe7]/42">{getRegion(node.country) === "middle-east" ? labels.regionMiddleEast : labels.regionEurope} · {country.established}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {isFinePointer && isCursorVisible && (isDragging || cursorCountry) && (
            <div
              className="pointer-events-none absolute z-50 hidden px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/76 lg:block"
              style={{ left: cursorPosition.x + 14, top: cursorPosition.y + 14 }}
            >
              {isDragging ? labels.exploring : `${labels.view} ${cursorCountry} ↗`}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedCountry && (
            <motion.aside
              key={selectedCountry.country}
              variants={panelVariants}
              initial={reduced ? false : "hidden"}
              animate="visible"
              exit="exit"
              transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-30 mt-[560px] max-w-[330px] border-l border-[#c99a57]/42 bg-[#0d0d0c]/72 py-4 pl-5 pr-4 text-[#f2efe7] shadow-[0_24px_80px_rgba(0,0,0,.26)] backdrop-blur-xl md:mt-[660px] lg:absolute lg:bottom-20 lg:left-0 lg:mt-0"
            >
              <div className="flex items-start justify-between gap-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#c99a57]">
                  {selectedCountry.country} / {selectedPanelRegion}
                </p>
                <button type="button" onClick={clearSelection} className="grid min-h-10 min-w-10 place-items-center text-[#f2efe7]/58 transition hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.modal.closeModal")}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 overflow-hidden">
                <motion.h3
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduced ? 0.01 : 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(2.2rem,4vw,3.2rem)] font-semibold uppercase leading-none"
                >
                  {selectedCountry.name}
                </motion.h3>
              </div>
              <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.01 : 0.45, delay: 0.16 }}>
                <p className="mt-4 text-xs leading-relaxed text-[#d7cec0]/78">{selectedCountry.description}</p>
                <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/54">
                  Partnership · {selectedCountry.established}
                </p>
                <div className="mt-5 grid gap-2">
                  {selectedCountry.industries.map((industry, index) => (
                    <span key={industry} className="grid grid-cols-[1.6rem_1fr] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#f2efe7]/72">
                      <span className="font-mono text-[#c99a57]/78">{String(index + 1).padStart(2, "0")}</span>
                      {industry}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
