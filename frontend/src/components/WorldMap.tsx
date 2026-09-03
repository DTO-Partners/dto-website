import { useCallback, useEffect, useRef, useState } from "react";
import { WorldMap } from "react-svg-worldmap";
import { Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

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

const visibleCountries = [
  "pl", "de", "lu", "ie", "sa", "ae",
  "at", "be", "bg", "hr", "cy", "cz", "dk", "ee", "es", "fi", "fr", "gr", "hu", "it", "lt", "lv", "mt", "nl", "pt", "ro", "se", "si", "sk", "ch", "no", "is", "rs", "me", "mk", "ba", "al", "md", "ua", "by", "gb", "ge", "am", "az", "ru", "xk",
  "tr", "sy", "lb", "jo", "il", "ps", "iq", "ir", "kw", "bh", "qa", "om", "ye", "kz", "uz", "tm", "kg", "tj", "af", "pk",
];

const europe = ["at", "be", "bg", "hr", "cy", "cz", "dk", "ee", "es", "fi", "fr", "gr", "hu", "it", "lt", "lv", "mt", "nl", "pt", "ro", "se", "si", "sk", "ch", "no", "is", "rs", "me", "mk", "ba", "al", "md", "ua", "by", "gb", "ie", "ge", "am", "az", "ru", "xk", "pl", "de", "lu"];
const middleEast = ["tr", "sy", "lb", "jo", "il", "ps", "iq", "ir", "kw", "bh", "qa", "ae", "om", "sa", "ye", "kz", "uz", "tm", "kg", "tj", "af", "pk"];

export default function WorldMapComponent({ autoTour = false }: { autoTour?: boolean }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2.15);
  const [panPosition, setPanPosition] = useState({ x: -50, y: 18 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animatedCountries, setAnimatedCountries] = useState<Set<string>>(new Set());
  const [filterRegion, setFilterRegion] = useState<Region>("all");
  const hasAutoToured = useRef(false);
  const { t } = useTranslation();

  const getCountryData = (countryCode: string): CountryData => {
    const countryData = t(`worldMap.countries.${countryCode}`, { returnObjects: true }) as Omit<CountryData, "country" | "value" | "color">;
    const colors = {
      pl: "#c99a57",
      de: "#b8aa96",
      lu: "#e0c28a",
      ie: "#9db5aa",
      sa: "#b7a07a",
      ae: "#d7cec0",
    };

    return {
      country: countryCode,
      value: 1,
      color: colors[countryCode as keyof typeof colors] || "#c99a57",
      ...countryData,
    };
  };

  const data = ["pl", "de", "lu", "ie", "sa", "ae"].map(getCountryData);
  const activeCountry = selectedCountry ?? data[0];

  const setRegion = (region: Region) => {
    setFilterRegion(region);
    if (region === "europe") {
      setZoomLevel(2.55);
      setPanPosition({ x: -22, y: 30 });
    } else if (region === "middle-east") {
      setZoomLevel(2.8);
      setPanPosition({ x: -105, y: 10 });
    } else {
      setZoomLevel(2.15);
      setPanPosition({ x: -50, y: 18 });
    }
  };

  const handleCountryClick = (countryCode: string) => {
    const code = countryCode.toLowerCase();
    const country = data.find((item) => item.country === code);
    setAnimatedCountries(new Set([code]));
    window.setTimeout(() => setAnimatedCountries(new Set()), 900);
    if (country) setSelectedCountry(country);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    setIsDragging(true);
    setDragStart({ x: event.clientX - panPosition.x, y: event.clientY - panPosition.y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    event.preventDefault();
    const maxPan = 200 * zoomLevel;
    setPanPosition({
      x: Math.max(-maxPan, Math.min(maxPan, event.clientX - dragStart.x)),
      y: Math.max(-maxPan, Math.min(maxPan, event.clientY - dragStart.y)),
    });
  };

  const runTour = useCallback(() => {
    data.forEach((country, index) => {
      window.setTimeout(() => {
        setSelectedCountry(country);
        setAnimatedCountries(new Set([country.country]));
      }, index * 420);
    });
    window.setTimeout(() => setAnimatedCountries(new Set()), data.length * 420 + 500);
  }, [data]);

  useEffect(() => {
    if (!autoTour || hasAutoToured.current) return;
    hasAutoToured.current = true;
    const timer = window.setTimeout(runTour, 450);
    return () => window.clearTimeout(timer);
  }, [autoTour, runTour]);

  return (
    <div className="relative min-h-[76svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_40%,rgba(199,149,75,.16),transparent_28%),linear-gradient(180deg,rgba(242,239,231,.04),transparent_28%)]" />
      <div className="absolute left-4 right-4 top-4 z-20 flex flex-wrap items-center justify-between gap-3 md:left-6 md:right-6 md:top-6 lg:top-32">
        <div className="flex flex-wrap gap-2 rounded-full bg-[#0d0d0c]/42 p-1 text-xs shadow-[0_18px_50px_rgba(0,0,0,.24)] backdrop-blur-xl">
            {[
              ["all", t("worldMap.controls.regions.all")],
              ["europe", t("worldMap.controls.regions.europe")],
              ["middle-east", t("worldMap.controls.regions.middleEast")],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRegion(key as Region)}
                className={`min-h-10 rounded-full px-4 transition focus:outline-none focus:ring-2 focus:ring-[#c99a57] ${
                  filterRegion === key ? "bg-[#c99a57] text-[#161410]" : "text-[#f4efe6] hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 rounded-full bg-[#0d0d0c]/42 p-1 shadow-[0_18px_50px_rgba(0,0,0,.24)] backdrop-blur-xl">
            <button onClick={() => setZoomLevel((value) => Math.min(value + 0.3, 4))} className="grid min-h-10 min-w-10 place-items-center rounded-full text-[#f4efe6] transition hover:bg-white/10" aria-label={t("worldMap.controls.zoomIn")}>
              <Plus className="h-4 w-4" />
            </button>
            <button onClick={() => setZoomLevel((value) => Math.max(value - 0.3, 0.9))} className="grid min-h-10 min-w-10 place-items-center rounded-full text-[#f4efe6] transition hover:bg-white/10" aria-label={t("worldMap.controls.zoomOut")}>
              <Minus className="h-4 w-4" />
            </button>
            <button onClick={() => setRegion("all")} className="grid min-h-10 min-w-10 place-items-center rounded-full text-[#f4efe6] transition hover:bg-white/10" aria-label={t("worldMap.controls.resetView")}>
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={runTour} className="grid min-h-10 min-w-10 place-items-center rounded-full text-[#f4efe6] transition hover:bg-white/10" aria-label={t("worldMap.controls.highlightTour")}>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

      <div
        className="relative hidden min-h-[76svh] cursor-grab select-none overflow-hidden lg:flex lg:items-center lg:justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transition: isDragging ? "none" : "transform 300ms ease-out",
            }}
          >
            <WorldMap
              title=""
              valueSuffix=""
              color="#c99a57"
              size={920}
              data={data}
              frame={false}
              richInteraction
              tooltipTextFunction={(context) => {
                const country = data.find((item) => item.country === context.countryCode?.toLowerCase());
                return country ? `${country.name} - ${t("worldMap.tooltips.partnershipActive")}` : t("worldMap.tooltips.exploreOpportunities");
              }}
              onClickFunction={(context) => handleCountryClick(context.countryCode)}
              styleFunction={(context) => {
                const currentCountry = context.countryCode?.toLowerCase() || "";
                const country = data.find((item) => item.country === currentCountry);
                const regionMatch = filterRegion === "all" || (filterRegion === "europe" && europe.includes(currentCountry)) || (filterRegion === "middle-east" && middleEast.includes(currentCountry));
                if (!visibleCountries.includes(currentCountry) || !regionMatch) return { display: "none", pointerEvents: "none" };

                const isActive = activeCountry.country === currentCountry;
                const isAnimated = animatedCountries.has(currentCountry);
                const isHovered = false;

                return {
                  fill: country ? (isActive || isAnimated || isHovered ? "#c99a57" : country.color) : "#24221e",
                  stroke: country ? "rgba(242,239,231,.7)" : "#3c3831",
                  strokeWidth: country && (isActive || isHovered) ? 2.1 : 0.8,
                  cursor: country ? "pointer" : "default",
                  opacity: selectedCountry && country && !isActive ? 0.42 : country ? 0.92 : 0.62,
                  transition: "all 160ms ease-out",
                  filter: isActive || isAnimated ? "drop-shadow(0 0 8px rgba(201,154,87,.52))" : "none",
                };
              }}
            />
          </div>
        </div>

        <div className="grid gap-3 pt-24 lg:hidden">
          {data.map((country) => (
            <button
              key={country.country}
              onClick={() => setSelectedCountry(country)}
              className={`flex min-h-14 items-center justify-between px-1 text-left text-[#f4efe6] transition ${
                activeCountry.country === country.country ? "text-[#c99a57]" : "text-[#d7cec0]"
              }`}
            >
              <span>{country.name}</span>
              <span className="text-sm text-[#c99a57]">{country.industries.length} {t("worldMap.statistics.sectors")}</span>
            </button>
          ))}
        </div>

      <aside className="bottom-6 right-6 z-20 mt-8 max-w-[390px] bg-[#f2efe7]/92 p-6 text-[#161410] shadow-[0_28px_90px_rgba(0,0,0,.34)] backdrop-blur-2xl lg:absolute lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6a3b]">{activeCountry.country}</p>
        <h3 className="mt-6 text-5xl font-semibold leading-none">{activeCountry.name}</h3>
        <p className="mt-5 text-base leading-relaxed text-[#5a5147]">{activeCountry.description}</p>
        <p className="mt-5 text-sm text-[#6f675e]">
          {t("worldMap.modal.partnershipEstablished")} {activeCountry.established}
        </p>
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {activeCountry.industries.map((industry) => (
              <span key={industry} className="bg-[#161410]/8 px-3 py-2 text-sm">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
