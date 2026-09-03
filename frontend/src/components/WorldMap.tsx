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
  { country: "pl", region: "europe", x: 55.4, y: 27.3, labelOffset: "-translate-x-[92%] -translate-y-[122%] text-right" },
  { country: "ae", region: "middle-east", x: 65.1, y: 36.6, labelOffset: "translate-x-4 -translate-y-1/2 text-left" },
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
  },
  pl: {
    all: "Cała sieć",
    europe: "Europa",
    "middle-east": "Bliski Wschód",
    drag: "Przeciągnij mapę",
    exploring: "Eksploracja",
    reset: "Reset",
    view: "Zobacz",
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
    setCursorPosition({ x: event.clientX, y: event.clientY });
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
  const selectedPanelRegion = selectedCountry ? (getRegion(selectedCountry.country) === "middle-east" ? "Middle East" : "Europe") : "";
  const cursorCountry = hoveredCountry ? data.find((item) => item.country === hoveredCountry)?.name : null;

  return (
    <div className="relative min-h-[68svh] overflow-hidden lg:min-h-[76svh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_50%,rgba(199,149,75,.14),transparent_26%),radial-gradient(circle_at_78%_62%,rgba(242,239,231,.06),transparent_22%)]" />

      <div className="relative z-20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-5 flex gap-7 overflow-x-auto px-5 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#f2efe7]/48 md:mx-0 md:px-0">
          {(["all", "europe", "middle-east"] as Region[]).map((region) => (
            <button
              type="button"
              key={region}
              onClick={() => setRegion(region)}
              className={`relative min-h-11 shrink-0 transition focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70 ${
                filterRegion === region ? "text-[#f2efe7]" : "hover:text-[#f2efe7]/78"
              }`}
            >
              {labels[region]}
              <span className={`absolute -bottom-1 left-0 h-px bg-[#c99a57] transition-all duration-300 ${filterRegion === region ? "w-full" : "w-0"}`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/62">
          <button type="button" onClick={() => setZoomLevel((value) => Math.min(value + 0.3, 4))} className="grid min-h-10 min-w-10 place-items-center border border-white/8 bg-white/[0.03] transition hover:border-[#c99a57]/40 hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.zoomIn")}>
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoomLevel((value) => Math.max(value - 0.3, 0.9))} className="grid min-h-10 min-w-10 place-items-center border border-white/8 bg-white/[0.03] transition hover:border-[#c99a57]/40 hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.zoomOut")}>
            <Minus className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setRegion("all")} className="min-h-10 border border-white/8 bg-white/[0.03] px-3 transition hover:border-[#c99a57]/40 hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.resetView")}>
            {labels.reset}
          </button>
          <button type="button" onClick={runTour} className="grid min-h-10 min-w-10 place-items-center border border-white/8 bg-white/[0.03] transition hover:border-[#c99a57]/40 hover:text-[#c99a57] focus:outline-none focus:ring-2 focus:ring-[#c99a57]/70" aria-label={t("worldMap.controls.highlightTour")}>
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative mt-5 min-h-[520px] md:min-h-[600px] lg:mt-0 lg:min-h-[650px]">
        <div
          className={`network-map-area absolute inset-0 overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) clearSelection();
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            setIsDragging(false);
            setHoveredCountry(null);
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[520px] w-[1040px] -translate-x-1/2 -translate-y-1/2 sm:h-[600px] sm:w-[1200px] lg:h-[650px] lg:w-[1300px]"
            style={{
              transform: `translate(-50%, -50%) scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transition: isDragging || reduced ? "none" : "transform 520ms cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-90">
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
                    return { fill: "#131211", stroke: "#1f1d1a", strokeWidth: 0.35, opacity: 0.3, pointerEvents: "none" };
                  }

                  return {
                    fill: country ? (isSelected || isHovered || isAnimated ? "#c99a57" : country.color) : "#1c1a17",
                    stroke: country ? "rgba(242,239,231,.28)" : "#28241f",
                    strokeWidth: country && (isSelected || isHovered || isAnimated) ? 1.4 : 0.55,
                    cursor: country ? "pointer" : "default",
                    opacity: country ? (isRegionActive ? (selectedCode && !isSelected ? 0.46 : 0.9) : 0.16) : isRegionActive ? 0.44 : 0.16,
                    transition: "fill 180ms ease, opacity 240ms ease, stroke-width 180ms ease",
                    filter: isSelected || isAnimated ? "drop-shadow(0 0 5px rgba(201,154,87,.34))" : "none",
                  };
                }}
              />
            </div>

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M55.4 27.3 C 58.8 28.1, 62.4 32.4, 65.1 36.6"
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
                  <animateMotion dur="8s" repeatCount="indefinite" path="M55.4 27.3 C 58.8 28.1, 62.4 32.4, 65.1 36.6" />
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
                    className={`pointer-events-none absolute top-0 min-w-28 text-[0.52rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-[#d2ad6b] ${node.labelOffset}`}
                  >
                    <span className="block">{country.name}</span>
                    <span className="block text-[#f2efe7]/42">{getRegion(node.country) === "middle-east" ? "Middle East" : "Europe"} · {country.established}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {isFinePointer && (
            <div
              className="pointer-events-none fixed z-50 hidden border border-[#c99a57]/25 bg-[#0d0d0c]/80 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/76 backdrop-blur-md lg:block"
              style={{ left: cursorPosition.x + 14, top: cursorPosition.y + 14 }}
            >
              {isDragging ? labels.exploring : cursorCountry ? `${labels.view} ${cursorCountry} ↗` : labels.drag}
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
              className="relative z-30 mt-[540px] border border-white/10 bg-[#14120f]/88 p-5 text-[#f2efe7] shadow-[0_28px_90px_rgba(0,0,0,.34)] backdrop-blur-2xl md:mt-[640px] md:max-w-[390px] lg:absolute lg:bottom-8 lg:right-0 lg:mt-0"
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
                  className="text-4xl font-semibold uppercase leading-none"
                >
                  {selectedCountry.name}
                </motion.h3>
              </div>
              <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.01 : 0.45, delay: 0.16 }}>
                <p className="mt-4 text-sm leading-relaxed text-[#d7cec0]">{selectedCountry.description}</p>
                <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/54">
                  Partnership · {selectedCountry.established}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedCountry.industries.map((industry) => (
                    <span key={industry} className="border border-white/8 bg-white/[0.04] px-3 py-2 text-xs text-[#f2efe7]/76">
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
