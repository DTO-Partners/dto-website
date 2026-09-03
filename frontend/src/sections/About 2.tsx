import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { AboutVideo } from "@/components/about/AboutVideo";

export default function About() {
  const [activeTab, setActiveTab] = useState<"industries" | "languages">(
    "industries"
  );
  const [copied, setCopied] = useState<string | null>(null);
  const { t } = useTranslation();

  const industries = (t("about.industries", { returnObjects: true }) as Array<{
    label: string;
    description: string;
  }>).map((industry, index) => ({
    ...industry,
    icon: ["💼", "🩺", "🖥️", "🏨", "🍽️"][index],
    color: ["#2563eb", "#dc2626", "#7c3aed", "#059669", "#ea580c"][index]
  }));

  const languages = (t("about.languages", { returnObjects: true }) as Array<{
    label: string;
  }>).map((language, index) => ({
    ...language,
    icon: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇵🇱", "🇮🇹", "🇩🇪", "🇷🇺"][index],
    color: ["#1e40af", "#dc2626", "#059669", "#7c2d12", "#7c3aed"][index]
  }));

  const factChips = (t("about.factChips", { returnObjects: true }) as string[]).map((text, index) => ({
    text,
    icon: ["🇵🇱", "🌍", "✅"][index],
    color: ["#dc2626", "#059669", "#2563eb"][index]
  }));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      id="AboutUs"
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdf6e3] via-[#f5f7fa] to-[#fff7d4]/30 text-[#1a1a2e] relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(218,165,32,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(253,246,227,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.04),transparent_70%)]" />

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(218,165,32,0.4) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(218,165,32,0.4) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#daa520]/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#fff7d4]/25 to-transparent rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row min-h-[60vh] lg:h-1/2 relative z-10">
        {/* Enhanced Text Block */}
        <div className="w-full lg:w-1/2 px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-24 space-y-6 lg:space-y-8 flex flex-col justify-center relative group">
          {/* Enhanced decorative side accent with animation */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
            <div className="w-3 h-32 bg-gradient-to-b from-transparent via-[#daa520] to-transparent rounded-r-full shadow-2xl group-hover:w-4 group-hover:h-40 transition-all duration-700"></div>
            <div className="absolute left-3 top-4 w-1 h-24 bg-gradient-to-b from-transparent via-[#b8860b]/60 to-transparent rounded-r-full group-hover:w-2 transition-all duration-500"></div>
          </div>

          {/* Floating background orbs */}
          <div className="absolute top-10 md:top-20 right-10 md:right-20 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-[#fff7d4]/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-16 md:bottom-32 right-16 md:right-32 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-tr from-[#daa520]/20 to-transparent rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>

          <div className="space-y-4 relative z-10">
            <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#daa520] via-[#b8860b] to-[#daa520] flex items-center justify-center shadow-2xl shadow-[#daa520]/40 mb-4 md:mb-6 relative overflow-hidden group/icon mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl md:rounded-3xl group-hover/icon:border-white/40 transition-all duration-300"></div>
              <span className="text-2xl md:text-3xl relative z-10 group-hover/icon:scale-110 transition-transform duration-300">
                🏢
              </span>

              {/* Icon decorative particles */}
              <div className="absolute -top-1 -right-1 w-2 md:w-3 h-2 md:h-3 bg-[#fff7d4] rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 md:w-2 h-1.5 md:h-2 bg-white/60 rounded-full animate-pulse"></div>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1a1a2e] tracking-tight leading-none mb-4 group-hover:text-[#1a1a2e] transition-colors duration-500">
                {t("about.title")}{" "}
                <span className="block text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-[#daa520] to-[#b8860b] bg-clip-text text-transparent font-normal mt-2 tracking-wide">
                  {t("about.subtitle")}
                </span>
              </h2>
            </div>

            <div className="relative flex justify-center lg:justify-start">
              <div className="h-[3px] w-32 md:w-40 bg-gradient-to-r from-[#daa520] via-[#b8860b] to-[#daa520] rounded-full shadow-lg mb-6 md:mb-8 relative group-hover:w-40 md:group-hover:w-48 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-[#daa520] via-white to-[#daa520] rounded-full animate-pulse opacity-50"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-bounce"></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-3 uppercase text-xs md:text-sm tracking-widest text-[#1a1a2e] font-semibold bg-gradient-to-r from-[#fff7d4]/80 via-white/70 to-[#fff7d4]/80 backdrop-blur-md px-6 md:px-10 py-4 md:py-5 rounded-full border-2 border-[#daa520]/40 shadow-xl hover:shadow-2xl hover:border-[#daa520]/60 transition-all duration-500 transform hover:scale-105 relative overflow-hidden group/badge">
              <div className="absolute inset-0 bg-gradient-to-r from-[#daa520]/5 via-transparent to-[#daa520]/5 rounded-full"></div>
              <div className="absolute inset-0 border border-white/30 rounded-full group-hover/badge:border-white/50 transition-all duration-300"></div>
              <span className="w-2 md:w-3 h-2 md:h-3 bg-[#daa520] rounded-full shadow-md animate-pulse relative z-10" />
              <span className="relative z-10 text-center">
                {t("about.badge")}
              </span>

              {/* Badge hover effect */}
              <div className="absolute top-0 left-0 w-0 group-hover/badge:w-full h-full bg-gradient-to-r from-[#daa520]/10 to-[#daa520]/5 rounded-full transition-all duration-700"></div>
            </span>
          </div>

          <div className="space-y-4 md:space-y-6 relative z-10 text-center lg:text-left">
            <p className="text-base md:text-lg leading-relaxed text-[#1a1a2e]/85 font-light group-hover:text-[#1a1a2e]/95 transition-colors duration-500">
              {t("about.description1")}
            </p>

            <p className="text-sm md:text-base leading-relaxed text-[#708090] font-light group-hover:text-[#708090]/95 transition-colors duration-500">
              {t("about.description2")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-5 mt-8 md:mt-10">
            {factChips.map((item, index) => (
              <button
                key={item.text}
                onClick={() => handleCopy(item.text)}
                className="group relative bg-gradient-to-r from-white/90 via-[#fdf6e3]/60 to-white/90 backdrop-blur-md border-l-4 border-[#daa520] hover:border-l-6 md:hover:border-l-8 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-medium cursor-pointer transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 hover:-translate-x-1 md:hover:-translate-x-2"
                aria-label={`Copy fact: ${item.text}`}
                title="Click to copy"
                style={{
                  animationDelay: `${index * 150}ms`,
                  borderLeftColor: item.color,
                }}
              >
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-white to-[#fdf6e3] flex items-center justify-center border-2 border-[#daa520]/20 group-hover:border-[#daa520]/50 transition-all duration-300 shadow-md">
                    <span className="text-lg md:text-xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm md:text-base text-[#1a1a2e] group-hover:text-[#daa520] transition-colors duration-300 tracking-wide font-semibold block">
                      {item.text}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-[#daa520]/0 via-[#daa520]/5 to-[#fff7d4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#daa520]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {copied === item.text && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#daa520] text-white px-3 py-1 rounded-lg shadow-xl text-xs font-semibold tracking-wide animate-bounce">
                    Copied! ✨
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Video Section */}
        <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-full flex relative overflow-hidden group mt-8 lg:mt-0">
          {/* Enhanced background with multiple layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/10 via-transparent to-[#daa520]/15 z-5"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#daa520]/8 via-transparent to-[#1a1a2e]/12 z-5"></div>

          {/* Animated floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-[#daa520]/20 to-transparent rounded-full blur-3xl animate-pulse z-5"></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-tl from-[#fff7d4]/40 to-transparent rounded-full blur-2xl animate-pulse z-5"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-2/3 left-1/6 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r from-[#b8860b]/30 to-transparent rounded-full blur-xl animate-pulse z-5"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Modern geometric frame */}
          <div className="absolute inset-4 md:inset-6 border-2 border-[#daa520]/30 rounded-2xl md:rounded-3xl z-10 group-hover:border-[#daa520]/50 transition-all duration-700">
            {/* Corner accent triangles */}
            <div className="absolute -top-2 md:-top-3 -left-2 md:-left-3 w-6 md:w-8 h-6 md:h-8 bg-[#daa520] rotate-45 rounded-sm shadow-lg"></div>
            <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-6 md:w-8 h-6 md:h-8 bg-[#b8860b] rotate-45 rounded-sm shadow-lg"></div>
            <div className="absolute -bottom-2 md:-bottom-3 -left-2 md:-left-3 w-6 md:w-8 h-6 md:h-8 bg-[#b8860b] rotate-45 rounded-sm shadow-lg"></div>
            <div className="absolute -bottom-2 md:-bottom-3 -right-2 md:-right-3 w-6 md:w-8 h-6 md:h-8 bg-[#daa520] rotate-45 rounded-sm shadow-lg"></div>
          </div>

          {/* Layered border effects */}
          <div className="absolute inset-6 md:inset-8 border border-white/50 rounded-xl md:rounded-2xl z-10 group-hover:border-white/70 transition-all duration-700"></div>
          <div className="absolute inset-8 md:inset-10 border border-[#daa520]/20 rounded-lg md:rounded-xl z-10 group-hover:border-[#daa520]/40 transition-all duration-700"></div>

          {/* Animated side accents */}
          <div className="absolute left-0 top-1/4 w-0.5 md:w-1 h-1/2 bg-gradient-to-b from-transparent via-[#daa520] to-transparent z-15 group-hover:w-1 md:group-hover:w-2 transition-all duration-500"></div>
          <div className="absolute right-0 top-1/3 w-0.5 md:w-1 h-1/3 bg-gradient-to-b from-transparent via-[#b8860b] to-transparent z-15 group-hover:w-1 md:group-hover:w-2 transition-all duration-500"></div>
          <div className="absolute top-0 left-1/4 h-0.5 md:h-1 w-1/2 bg-gradient-to-r from-transparent via-[#daa520] to-transparent z-15 group-hover:h-1 md:group-hover:h-2 transition-all duration-500"></div>
          <div className="absolute bottom-0 left-1/3 h-0.5 md:h-1 w-1/3 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent z-15 group-hover:h-1 md:group-hover:h-2 transition-all duration-500"></div>

          {/* Enhanced floating indicators */}
          <div className="absolute top-4 md:top-8 left-4 md:left-8 z-20">
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="w-2 md:w-3 h-2 md:h-3 bg-[#daa520] rounded-full animate-ping"></div>
              <div
                className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#b8860b] rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-1 h-1 bg-[#daa520] rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          <div className="absolute top-4 md:top-8 right-4 md:right-8 z-20">
            <div className="w-8 md:w-12 h-8 md:h-12 border-2 border-[#daa520]/50 rounded-full relative group-hover:border-[#daa520]/80 transition-all duration-500">
              <div className="absolute inset-1 border border-[#daa520]/30 rounded-full group-hover:border-[#daa520]/60 transition-all duration-500"></div>
              <div className="absolute inset-2 md:inset-3 bg-[#daa520]/20 rounded-full group-hover:bg-[#daa520]/40 transition-all duration-500"></div>
            </div>
          </div>

          <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20">
            <div className="flex gap-1">
              <div className="w-0.5 md:w-1 h-6 md:h-8 bg-[#daa520]/60 rounded-full animate-pulse"></div>
              <div
                className="w-0.5 md:w-1 h-4 md:h-6 bg-[#b8860b]/60 rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="w-0.5 md:w-1 h-3 md:h-4 bg-[#daa520]/60 rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>
          </div>

          {/* Enhanced floating info card with glassmorphism */}
          <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 bg-white/10 backdrop-blur-2xl rounded-2xl md:rounded-3xl px-4 md:px-8 py-3 md:py-6 shadow-2xl border border-white/20 z-20 transform hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 group-hover:bg-white/20">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br from-[#daa520] via-[#b8860b] to-[#daa520] rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-sm md:text-lg">🎬</span>
                </div>
                <div className="absolute -top-0.5 md:-top-1 -right-0.5 md:-right-1 w-3 md:w-4 h-3 md:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-white mb-1 tracking-wide">
                  {t("about.videoCard.title")}
                </p>
                <p className="text-xs text-white/80 leading-relaxed hidden md:block">
                  {t("about.videoCard.description")}
                </p>
                <p className="text-xs text-white/80 leading-relaxed md:hidden">
                  Auto-switches
                </p>
              </div>
            </div>

            {/* Card decorative elements */}
            <div className="absolute -top-1 md:-top-2 -left-1 md:-left-2 w-4 md:w-6 h-4 md:h-6 border-2 border-[#daa520]/50 rotate-45 rounded-sm"></div>
            <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-3 md:w-4 h-3 md:h-4 bg-[#daa520]/30 rotate-45 rounded-sm"></div>
          </div>

          {/* Video container with enhanced styling */}
          <div className="absolute inset-8 md:inset-12 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl z-0 group-hover:inset-7 md:group-hover:inset-11 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/20 via-transparent to-[#daa520]/20 z-10 group-hover:opacity-50 transition-opacity duration-700"></div>
            <AboutVideo className="w-full h-full rounded-xl md:rounded-2xl" />
          </div>

          {/* Interactive hover effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/0 via-[#daa520]/0 to-[#daa520]/0 group-hover:from-[#daa520]/5 group-hover:via-[#daa520]/2 group-hover:to-[#daa520]/5 transition-all duration-700 z-5 pointer-events-none rounded-3xl"></div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="min-h-[50vh] px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32 flex items-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fdf6e3]/20 to-transparent"></div>
        <div className="absolute top-8 md:top-16 left-1/4 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-[#daa520]/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 md:bottom-16 right-1/4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-tl from-[#fff7d4]/30 to-transparent rounded-full blur-2xl"></div>

        <div className="max-w-7xl lg:max-w-8xl mx-auto w-full relative z-10">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#fff7d4]/60 via-white/80 to-[#fff7d4]/60 backdrop-blur-md px-6 md:px-8 py-2 md:py-3 rounded-full border border-[#daa520]/30 shadow-lg mb-4 md:mb-6">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#daa520] rounded-full animate-pulse"></span>
              <span className="text-xs md:text-sm font-semibold text-[#1a1a2e] tracking-wider uppercase">
                {t("about.expertise.badge")}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1a1a2e] mb-3 md:mb-4">
              {t("about.expertise.title")}
            </h3>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-[#daa520] to-[#b8860b] rounded-full mx-auto"></div>
          </div>

          {/* Mobile tab buttons */}
          <div className="flex lg:hidden mb-8 md:mb-12 justify-center gap-2 md:gap-3 px-4">
            <button
              onClick={() => setActiveTab("industries")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold border-2 transition-all duration-500 transform text-sm md:text-base ${
                activeTab === "industries"
                  ? "bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white border-[#daa520] shadow-2xl shadow-[#daa520]/40 scale-105"
                  : "bg-white/90 text-[#1a1a2e] border-[#daa520]/30 hover:border-[#daa520]/60 backdrop-blur-sm hover:scale-105 shadow-lg"
              }`}
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-sm md:text-base">💼</span>
                <span className="hidden sm:inline">{t("about.expertise.tabIndustries")}</span>
                <span className="sm:hidden">{t("about.expertise.tabIndustriesShort")}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("languages")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold border-2 transition-all duration-500 transform text-sm md:text-base ${
                activeTab === "languages"
                  ? "bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white border-[#daa520] shadow-2xl shadow-[#daa520]/40 scale-105"
                  : "bg-white/90 text-[#1a1a2e] border-[#daa520]/30 hover:border-[#daa520]/60 backdrop-blur-sm hover:scale-105 shadow-lg"
              }`}
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-sm md:text-base">🌍</span>
                <span className="hidden sm:inline">{t("about.expertise.tabLanguages")}</span>
                <span className="sm:hidden">{t("about.expertise.tabLanguagesShort")}</span>
              </div>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {/* Industries Card */}
            {(activeTab === "industries" || window.innerWidth >= 1024) && (
              <div className="relative bg-gradient-to-br from-white/95 via-[#fdf6e3]/50 to-white/90 backdrop-blur-2xl border-2 border-[#daa520]/25 hover:border-[#daa520]/50 rounded-3xl md:rounded-4xl p-6 md:p-8 lg:p-10 xl:p-12 shadow-2xl hover:shadow-3xl overflow-hidden group transition-all duration-700 transform hover:scale-[1.02] lg:hover:scale-[1.03] hover:-translate-y-1 lg:hover:-translate-y-2">
                {/* Enhanced background elements */}
                <div className="absolute -top-6 md:-top-8 -right-6 md:-right-8 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-bl from-[#daa520]/15 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700" />
                <div className="absolute -bottom-6 md:-bottom-8 -left-6 md:-left-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tr from-[#fff7d4]/60 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/0 via-[#daa520]/3 to-[#fff7d4]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Animated corner accents */}
                <div className="absolute top-3 md:top-4 right-3 md:right-4 w-4 md:w-6 h-4 md:h-6 border-2 border-[#daa520]/40 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 w-3 md:w-4 h-3 md:h-4 bg-[#daa520]/30 rounded-full group-hover:scale-150 transition-transform duration-500" />

                <div className="relative mb-8 md:mb-10 flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                  <div className="w-14 md:w-16 lg:w-18 h-14 md:h-16 lg:h-18 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#daa520] via-[#b8860b] to-[#daa520] flex items-center justify-center shadow-2xl shadow-[#daa520]/40 group-hover:shadow-3xl group-hover:shadow-[#daa520]/60 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 mx-auto sm:mx-0">
                    <span className="text-2xl md:text-3xl">💼</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1a1a2e] group-hover:text-[#daa520] transition-colors duration-700 leading-tight tracking-wide mb-2 md:mb-3">
                      {t("about.expertise.industriesTitle")}
                    </h3>
                    <div className="h-0.5 md:h-1 w-0 group-hover:w-24 md:group-hover:w-32 bg-gradient-to-r from-[#daa520] to-[#b8860b] rounded-full transition-all duration-700 mx-auto sm:mx-0" />
                    <p className="text-[#708090] font-light text-sm md:text-base leading-relaxed mt-3 md:mt-4">
                      {t("about.expertise.industriesDescription")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:gap-4 relative z-10">
                  {industries.map((item, index) => (
                    <div
                      key={item.label}
                      className="group/item relative bg-gradient-to-r from-white/90 to-[#fdf6e3]/70 border border-[#daa520]/20 hover:border-[#daa520]/50 rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-xl backdrop-blur-sm transform hover:scale-[1.02] hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#daa520]/0 via-[#daa520]/5 to-[#fff7d4]/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl" />
                      <div className="absolute left-0 top-0 w-0 group-hover/item:w-0.5 md:group-hover/item:w-1 h-full bg-gradient-to-b from-[#daa520] to-[#b8860b] transition-all duration-500 rounded-r-full" />

                      <div className="relative flex items-center gap-4 md:gap-6">
                        <div
                          className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 backdrop-blur-sm group-hover/item:scale-110"
                          style={{
                            backgroundColor: `${item.color}20`,
                            border: `2px solid ${item.color}40`,
                            boxShadow: `0 8px 32px ${item.color}20`,
                          }}
                        >
                          <span className="text-xl md:text-2xl group-hover/item:scale-110 transition-transform duration-300">
                            {item.icon}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1a1a2e] group-hover/item:text-[#daa520] transition-colors duration-500 text-lg md:text-xl tracking-wide mb-1 md:mb-2">
                            {item.label}
                          </h4>
                          <p className="text-xs md:text-sm text-[#708090] leading-relaxed font-light">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Card */}
            {(activeTab === "languages" || window.innerWidth >= 1024) && (
              <div className="relative bg-gradient-to-br from-white/95 via-[#fdf6e3]/50 to-white/90 backdrop-blur-2xl border-2 border-[#daa520]/25 hover:border-[#daa520]/50 rounded-3xl md:rounded-4xl p-6 md:p-8 lg:p-10 xl:p-12 shadow-2xl hover:shadow-3xl overflow-hidden group transition-all duration-700 transform hover:scale-[1.02] lg:hover:scale-[1.03] hover:-translate-y-1 lg:hover:-translate-y-2">
                {/* Enhanced background elements */}
                <div className="absolute -top-6 md:-top-8 -left-6 md:-left-8 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-[#daa520]/15 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700" />
                <div className="absolute -bottom-6 md:-bottom-8 -right-6 md:-right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tl from-[#fff7d4]/60 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#daa520]/0 via-[#daa520]/3 to-[#fff7d4]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Animated corner accents */}
                <div className="absolute top-3 md:top-4 left-3 md:left-4 w-4 md:w-6 h-4 md:h-6 border-2 border-[#1a1a2e]/40 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 w-3 md:w-4 h-3 md:h-4 bg-[#1a1a2e]/30 rounded-full group-hover:scale-150 transition-transform duration-500" />

                <div className="relative mb-8 md:mb-10 flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                  <div className="w-14 md:w-16 lg:w-18 h-14 md:h-16 lg:h-18 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#1a1a2e] via-[#3a3a5e] to-[#1a1a2e] flex items-center justify-center shadow-2xl shadow-[#1a1a2e]/40 group-hover:shadow-3xl group-hover:shadow-[#1a1a2e]/60 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 mx-auto sm:mx-0">
                    <span className="text-2xl md:text-3xl">🌍</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1a1a2e] group-hover:text-[#daa520] transition-colors duration-700 leading-tight tracking-wide mb-2 md:mb-3">
                      {t("about.expertise.languagesTitle")}
                    </h3>
                    <div className="h-0.5 md:h-1 w-0 group-hover:w-24 md:group-hover:w-32 bg-gradient-to-r from-[#1a1a2e] to-[#daa520] rounded-full transition-all duration-700 mx-auto sm:mx-0" />
                    <p className="text-[#708090] font-light text-sm md:text-base leading-relaxed mt-3 md:mt-4">
                      {t("about.expertise.languagesDescription")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:gap-4 relative z-10">
                  {languages.map((lang, index) => (
                    <div
                      key={lang.label}
                      className="group/lang relative bg-gradient-to-l from-white/90 to-[#fdf6e3]/70 border border-[#daa520]/20 hover:border-[#daa520]/50 rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-xl backdrop-blur-sm transform hover:scale-[1.02] hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-[#daa520]/0 via-[#daa520]/5 to-[#fff7d4]/10 opacity-0 group-hover/lang:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl" />
                      <div className="absolute right-0 top-0 w-0 group-hover/lang:w-0.5 md:group-hover/lang:w-1 h-full bg-gradient-to-b from-[#1a1a2e] to-[#daa520] transition-all duration-500 rounded-l-full" />

                      <div className="relative flex items-center gap-4 md:gap-6">
                        <div
                          className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 backdrop-blur-sm group-hover/lang:scale-110"
                          style={{
                            backgroundColor: `${lang.color}20`,
                            border: `2px solid ${lang.color}40`,
                            boxShadow: `0 8px 32px ${lang.color}20`,
                          }}
                        >
                          <span className="text-xl md:text-2xl group-hover/lang:scale-110 transition-transform duration-300">
                            {lang.icon}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1a1a2e] group-hover/lang:text-[#daa520] transition-colors duration-500 text-lg md:text-xl tracking-wide mb-1 md:mb-2">
                            {lang.label}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
