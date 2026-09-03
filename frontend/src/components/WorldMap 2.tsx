import { useState, useEffect } from "react";
import { WorldMap } from "react-svg-worldmap";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';

export default function WorldMapComponent() {
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2.2);
  const [panPosition, setPanPosition] = useState({ x: -50, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animatedCountries, setAnimatedCountries] = useState<Set<string>>(new Set());
  const [filterRegion, setFilterRegion] = useState<'all' | 'europe' | 'middle-east'>('all');
  const { t } = useTranslation();

  // Get countries data from translations
  const getCountryData = (countryCode: string) => {
    const countryData = t(`worldMap.countries.${countryCode}`, { returnObjects: true }) as any;
    const colors = {
      pl: "#daa520",
      de: "#3e5c76", 
      lu: "#008080",
      ie: "#ffd700",
      sa: "#708090",
      ae: "#333333"
    };
    
    return {
      country: countryCode,
      value: 1,
      color: colors[countryCode as keyof typeof colors] || "#daa520",
      name: countryData.name,
      description: countryData.description,
      industries: countryData.industries,
      established: countryData.established
    };
  };

  const data = ['pl', 'de', 'lu', 'ie', 'sa', 'ae'].map(getCountryData);

  // Handle keyboard events for better accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedCountry) {
        setSelectedCountry(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCountry]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      setAnimatedCountries(new Set());
    };
  }, []);

  const handleCountryClick = (countryCode: string) => {
    try {
      const country = data.find(d => d.country.toLowerCase() === countryCode.toLowerCase());
      if (country) {
        setSelectedCountry(country);
        // Add pulse animation to clicked country with error handling
        setAnimatedCountries(prev => new Set([...prev, countryCode.toLowerCase()]));
        const animationTimer = setTimeout(() => {
          setAnimatedCountries(prev => {
            const newSet = new Set(prev);
            newSet.delete(countryCode.toLowerCase());
            return newSet;
          });
        }, 2000);

        // Store timer for cleanup if needed
        return () => clearTimeout(animationTimer);
      } else {
        // Handle non-partner country clicks with simple, reliable notification
        const countryNames: { [key: string]: string } = {
          'fr': 'France', 'it': 'Italy', 'es': 'Spain', 'nl': 'Netherlands',
          'be': 'Belgium', 'at': 'Austria', 'ch': 'Switzerland', 'se': 'Sweden', 'no': 'Norway',
          'dk': 'Denmark', 'fi': 'Finland', 'gb': 'United Kingdom', 'pt': 'Portugal',
          'gr': 'Greece', 'hu': 'Hungary', 'cz': 'Czech Republic', 'sk': 'Slovakia',
          'tr': 'Turkey'
        };
        
        const countryName = countryNames[countryCode.toLowerCase()] || 'this country';
        
        // Simple, reliable alert for partnership inquiries
        alert(t("worldMap.modal.partnershipInquiry", { country: countryName }));
        
        // Add subtle animation effect with error handling
        setAnimatedCountries(prev => new Set([...prev, countryCode.toLowerCase()]));
        const animationTimer = setTimeout(() => {
          setAnimatedCountries(prev => {
            const newSet = new Set(prev);
            newSet.delete(countryCode.toLowerCase());
            return newSet;
          });
        }, 1000);

        return () => clearTimeout(animationTimer);
      }
    } catch (error) {
      console.error('Error handling country click:', error);
      // Fallback behavior
      alert('Thank you for your interest! Please contact us at partnerships@dtopartners.com');
    }
  };

  const handleCountryHover = (countryCode: string | null) => {
    setHoveredCountry(countryCode);
  };

  // Zoom and pan handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.3, 0.8));
  };

  const handleResetView = () => {
    setZoomLevel(2.2);
    setPanPosition({ x: -50, y: 20 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Add some bounds to prevent dragging too far
      const maxPan = 200 * zoomLevel;
      setPanPosition({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    // Disable mouse wheel zooming - zoom level is controlled only by buttons
    return;
  };

  return (
    <div className="w-full">
      {/* Mobile Message - Show only on small screens */}
      <div className="block lg:hidden">
        <div className="relative bg-gradient-to-br from-white via-[#fdf6e3]/30 to-white backdrop-blur-lg border-2 border-[#daa520]/20 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 transition-all duration-300">
          {/* Mobile Header */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#daa520] to-[#b8860b] flex items-center justify-center shadow-lg mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
              {t("worldMap.header.title")}
            </h3>
            <p className="text-sm text-[#708090] font-medium leading-relaxed mb-6">
              {t("worldMap.header.description")}
            </p>
          </div>

          {/* Countries Grid for Mobile */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {data.map((country, index) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white/80 border border-[#daa520]/20 rounded-lg p-3 text-center hover:bg-[#daa520]/5 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedCountry(country)}
              >
                <div className="text-lg mb-1">{country.country === 'pl' ? '🇵🇱' : country.country === 'de' ? '🇩🇪' : country.country === 'lu' ? '🇱🇺' : country.country === 'ie' ? '🇮🇪' : country.country === 'sa' ? '🇸🇦' : '🇦🇪'}</div>
                <div className="text-sm font-semibold text-[#1a1a2e]">{country.name}</div>
                <div className="text-xs text-[#708090] mt-1">{country.industries.length} {country.industries.length === 1 ? 'industry' : 'industries'}</div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Statistics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-lg font-bold text-[#daa520]">{data.length}</div>
              <div className="text-xs text-[#708090]">{t("worldMap.statistics.activePartnerships")}</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-lg font-bold text-[#daa520]">2</div>
              <div className="text-xs text-[#708090]">{t("worldMap.statistics.emeaRegion")}</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-lg font-bold text-[#daa520]">5</div>
              <div className="text-xs text-[#708090]">{t("worldMap.statistics.sectors")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Map - Hidden on mobile */}
      <div className="hidden lg:block">
        <div 
          className="relative bg-gradient-to-br from-white via-[#fdf6e3]/30 to-white backdrop-blur-lg border-2 border-[#daa520]/20 hover:border-[#daa520]/40 rounded-3xl shadow-xl px-6 lg:px-8 py-8 lg:py-10 transition-all hover:shadow-2xl duration-300 overflow-hidden"
        >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#daa520]/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#fff7d4]/40 to-transparent rounded-full blur-xl" />
        
        {/* Interactive Controls Panel */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 relative z-10">
          {/* Region Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-semibold text-[#1a1a2e]">{t("worldMap.controls.focusRegion")}</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: t("worldMap.controls.regions.all"), emoji: '🌍' },
                { key: 'europe', label: t("worldMap.controls.regions.europe"), emoji: '🇪🇺' },
                { key: 'middle-east', label: t("worldMap.controls.regions.middleEast"), emoji: '🕌' }
              ].map((region) => (
                <button
                  key={region.key}
                  onClick={() => {
                    setFilterRegion(region.key as any);
                    // Smooth animated zoom to region with improved positioning
                    if (region.key === 'europe') {
                      setZoomLevel(2.6);
                      setPanPosition({ x: -20, y: 30 });
                    } else if (region.key === 'middle-east') {
                      setZoomLevel(2.8);
                      setPanPosition({ x: -100, y: 10 });
                    } else {
                      setZoomLevel(2.2);
                      setPanPosition({ x: -50, y: 20 });
                    }
                  }}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-medium transition-all duration-300 ${
                    filterRegion === region.key
                      ? 'bg-[#daa520] text-white shadow-lg'
                      : 'bg-white/80 text-[#1a1a2e] hover:bg-[#daa520]/10 border border-[#daa520]/20'
                  }`}
                >
                  <span className="hidden sm:inline">{region.emoji} </span>{region.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Toggles */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                // Clear any existing animations first
                setAnimatedCountries(new Set());
                
                // Simple highlight tour of partner countries with better timing
                const countries = data.map(d => d.country);
                let animationTimeout: NodeJS.Timeout;
                
                countries.forEach((country, index) => {
                  animationTimeout = setTimeout(() => {
                    setAnimatedCountries(new Set([country]));
                    setTimeout(() => {
                      setAnimatedCountries(new Set());
                    }, 700);
                  }, index * 500);
                });
                
                // Clear animations after tour completes
                setTimeout(() => {
                  setAnimatedCountries(new Set());
                  clearTimeout(animationTimeout);
                }, countries.length * 500 + 1000);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/80 text-[#1a1a2e] hover:bg-[#daa520]/10 border border-[#daa520]/20 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t("worldMap.controls.highlightTour")}
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div 
          className="text-left mb-8 relative z-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#daa520] to-[#b8860b] flex items-center justify-center shadow-lg">
              <span className="text-xl">🌍</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1a1a2e]">
                {t("worldMap.header.title")}
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-[#daa520] to-[#b8860b] rounded-full mt-1" />
            </div>
          </div>
          <p className="text-[#708090] font-medium leading-relaxed">
            {t("worldMap.header.description")}
          </p>
        </div>

        {/* Global Partnership Visualization */}
        <div 
          className="relative flex items-center justify-center w-full h-[500px] lg:h-[700px] overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#f8fafc] via-[#fdf6e3]/40 to-[#f0f9ff] border-2 border-[#daa520]/30 p-3 sm:p-6 shadow-inner"
        >
          {/* Zoom Controls */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2 z-20">
            <button
              onClick={handleZoomIn}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-white/90 hover:bg-white border border-[#daa520]/30 hover:border-[#daa520] rounded-md sm:rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              title={t("worldMap.controls.zoomIn")}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-white/90 hover:bg-white border border-[#daa520]/30 hover:border-[#daa520] rounded-md sm:rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              title={t("worldMap.controls.zoomOut")}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
            <button
              onClick={handleResetView}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-white/90 hover:bg-white border border-[#daa520]/30 hover:border-[#daa520] rounded-md sm:rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              title={t("worldMap.controls.resetView")}
            >
              <svg className="w-4 h-4 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Map Container with zoom and pan */}
          <div 
            className="w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center min-h-[600px]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            <div className="flex items-center justify-center w-full h-full relative">
              <WorldMap
                title=""
                valueSuffix=""
                color="#daa520"
                size={900}
                data={data}
                frame={false}
                richInteraction
                tooltipTextFunction={(context) => {
                  const countryCode = context.countryCode;
                  const country = data.find(d => d.country.toLowerCase() === countryCode?.toLowerCase());
                  
                  if (country) {
                    return `🤝 ${country.name} - ${t("worldMap.tooltips.partnershipActive")}`;
                  } else {
                    return `💼 ${t("worldMap.tooltips.exploreOpportunities")}`;
                  }
                }}
                onClickFunction={(context) => handleCountryClick(context.countryCode)}
                styleFunction={(context) => {
                  const countryCode = context.countryCode;
                  const country = data.find(
                    (d) => d.country.toLowerCase() === countryCode?.toLowerCase()
                  );
                  
                  // Expanded regional coverage - Europe and Middle East
                  const visibleCountries = [
                    // Our partner countries
                    ...data.map((d) => d.country),
                    // All European Union countries
                    "at", "be", "bg", "hr", "cy", "cz", "dk", "ee", "es", "fi", 
                    "fr", "gr", "hu", "it", "lt", "lv", "mt", "nl", "pt", "ro", 
                    "se", "si", "sk",
                    // Additional European countries
                    "ch", "no", "is", "rs", "me", "mk", "ba", "al", "md", "ua", "by",
                    // UK and surrounding
                    "gb", "ie",
                    // Eastern Europe and Caucasus
                    "ge", "am", "az", "ru",
                    // Balkans expansion
                    "xk", // Kosovo
                    // Middle East and Gulf region (comprehensive)
                    "tr", "sy", "lb", "jo", "il", "ps", "iq", "ir", "kw", "bh", 
                    "qa", "ae", "om", "sa", "ye",
                    // Central Asia (around region)
                    "kz", "uz", "tm", "kg", "tj", "af", "pk"
                  ];
                  
                  const isHovered = hoveredCountry === countryCode?.toLowerCase();
                  const isPartner = !!country;
                  const isAnimated = animatedCountries.has(countryCode?.toLowerCase() || '');
                  
                  // Define region groups
                  const europeanCountries = ['at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'es', 'fi', 'fr', 'gr', 'hu', 'it', 'lt', 'lv', 'mt', 'nl', 'pt', 'ro', 'se', 'si', 'sk', 'ch', 'no', 'is', 'rs', 'me', 'mk', 'ba', 'al', 'md', 'ua', 'by', 'gb', 'ie', 'ge', 'am', 'az', 'ru', 'xk', 'pl', 'de', 'lu'];
                  const middleEastCountries = ['tr', 'sy', 'lb', 'jo', 'il', 'ps', 'iq', 'ir', 'kw', 'bh', 'qa', 'ae', 'om', 'sa', 'ye', 'kz', 'uz', 'tm', 'kg', 'tj', 'af', 'pk'];
                  
                  const currentCountry = countryCode?.toLowerCase() || '';
                  
                  // Check if country should be visible based on filter
                  let isInFilteredRegion = true;
                  if (filterRegion === 'europe') {
                    isInFilteredRegion = europeanCountries.includes(currentCountry);
                  } else if (filterRegion === 'middle-east') {
                    isInFilteredRegion = middleEastCountries.includes(currentCountry);
                  }
                  
                  if (!visibleCountries.includes(currentCountry) || !isInFilteredRegion) {
                    return {
                      display: "none",
                      cursor: "default",
                      pointerEvents: "none",
                    };
                  }
                  
                  // Simplified styling for stable performance and reduced glitches
                  if (isPartner) {
                    return {
                      fill: isAnimated 
                        ? '#ffd700'
                        : isHovered 
                          ? country.color 
                          : country.color,
                      stroke: isAnimated ? "#ffd700" : "#1a1a2e",
                      strokeWidth: isAnimated ? 3 : isHovered ? 2.5 : 2,
                      cursor: "pointer",
                      filter: isAnimated
                        ? "brightness(1.2) drop-shadow(0px 0px 8px rgba(255,215,0,0.6))"
                        : isHovered 
                          ? "brightness(1.1) drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" 
                          : "drop-shadow(0px 1px 2px rgba(0,0,0,0.1))",
                      transition: "all 0.15s ease-out",
                      transformOrigin: "center",
                    };
                  } else {
                    return {
                      fill: isAnimated 
                        ? '#e2e8f0' 
                        : isHovered ? "#e2e8f0" : "#f1f5f9",
                      stroke: "#cbd5e1",
                      strokeWidth: isAnimated ? 2 : isHovered ? 1.5 : 1,
                      cursor: "pointer",
                      transition: "all 0.15s ease-out",
                      filter: isAnimated 
                        ? "brightness(0.95) drop-shadow(0px 1px 2px rgba(0,0,0,0.15))"
                        : isHovered ? "brightness(0.98)" : "none",
                    };
                  }
                }}
              />
            </div>
          </div>
          
          {/* Regional Statistics */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border-2 border-[#daa520]/30 rounded-2xl px-5 py-4 shadow-xl z-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#daa520] mb-1">{data.length}</div>
              <div className="text-xs text-[#708090] font-semibold">{t("worldMap.statistics.activePartnerships")}</div>
              <div className="text-xs text-[#1a1a2e] mt-1 font-medium">{t("worldMap.statistics.emeaRegion")}</div>
            </div>
          </div>

          {/* Zoom level indicator */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-[#daa520]/20 rounded-xl px-3 py-2 shadow-lg z-10">
            <div className="text-xs text-[#708090] font-medium">
              {t("worldMap.statistics.zoom")}: {Math.round(zoomLevel * 100)}%
            </div>
          </div>
        </div>

        {/* Partnership Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6 lg:mt-8 relative z-10">
          {data.map((country) => (
            <button
              key={country.country}
              onClick={() => setSelectedCountry(country)}
              onMouseEnter={() => handleCountryHover(country.country)}
              onMouseLeave={() => handleCountryHover(null)}
              className="group bg-gradient-to-br from-white via-[#fdf6e3]/30 to-white border-2 border-[#daa520]/20 hover:border-[#daa520]/50 rounded-xl lg:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="w-5 h-5 rounded-full shadow-lg border-2 border-white"
                  style={{ backgroundColor: country.color }}
                />
                <div className="text-center">
                  <div className="font-bold text-[#1a1a2e] group-hover:text-[#daa520] transition-colors text-xs sm:text-sm leading-tight">
                    {country.name}
                  </div>
                  <div className="text-xs text-[#708090] mt-1 font-medium">
                    {country.industries.length} {t("worldMap.statistics.sectors")}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Regional Legend */}
        <div className="flex items-center justify-center gap-8 mt-6 text-sm text-[#708090] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#daa520] rounded-full shadow-md"></div>
            <span className="font-medium">{t("worldMap.legend.activePartnerships")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#f1f5f9] border-2 border-[#cbd5e1] rounded-full"></div>
            <span className="font-medium">{t("worldMap.legend.europeMiddleEast")}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-r from-[#daa520] to-[#b8860b] rounded-full shadow-md"></div>
            <span className="font-medium">{t("worldMap.legend.headquarters")}</span>
          </div>
        </div>
        </div>
      </div>

      {/* Modal for both mobile and desktop */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCountry(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSelectedCountry(null);
              }
            }}
            tabIndex={0}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border-2 border-[#daa520]/30"
              role="dialog"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              {/* Close button with improved accessibility */}
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 hover:border-[#daa520] flex items-center justify-center transition-all duration-200 z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] focus:ring-offset-2"
                aria-label={t("worldMap.modal.closeModal")}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content with improved structure */}
              <div className="p-10">
                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-xl border-2"
                    style={{ 
                      backgroundColor: `${selectedCountry.color}15`, 
                      borderColor: `${selectedCountry.color}40`,
                      color: selectedCountry.color 
                    }}
                  >
                    🏛️
                  </div>
                  <div>
                    <h3 id="modal-title" className="text-3xl font-bold text-gray-900 mb-2">{selectedCountry.name}</h3>
                    <p className="text-gray-600 font-semibold text-lg">Partnership established {selectedCountry.established}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Partnership Overview</h4>
                  <p id="modal-description" className="text-gray-700 leading-relaxed text-base">{selectedCountry.description}</p>
                </div>

                {/* Industries */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Key Industry Sectors</h4>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {selectedCountry.industries.map((industry: any, index: any) => (
                      <div
                        key={`${industry}-${index}`}
                        className="px-4 py-3 bg-gradient-to-r from-[#daa520]/10 via-[#daa520]/15 to-[#daa520]/10 border-2 border-[#daa520]/25 rounded-xl text-sm font-semibold text-gray-800 text-center shadow-sm"
                      >
                        {industry}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="w-full bg-gradient-to-r from-[#daa520] to-[#b8860b] hover:from-[#b8860b] hover:to-[#daa520] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl text-lg focus:outline-none focus:ring-2 focus:ring-[#daa520] focus:ring-offset-2"
                  onClick={() => {
                    // Add contact functionality here if needed
                    alert(`🤝 Thank you for your interest in ${selectedCountry.name}!\n\n📧 Please contact us at partnerships@dtopartners.com for more details about opportunities in ${selectedCountry.name}.`);
                  }}
                >
                  Explore Opportunities in {selectedCountry.name}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
