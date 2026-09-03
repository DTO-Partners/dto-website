import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import WorldMapComponent from "@/components/WorldMap";
import { useState } from "react";
// Optional: If using shadcn/ui for accordion & tooltip
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export default function InternationalReach() {
  const { t } = useTranslation();
  
  const countries = t("markets.countries.list", { returnObjects: true }) as Array<{
    code: string;
    name: string;
    type: string;
  }>;

  const industries = t("markets.industries.list", { returnObjects: true }) as Array<{
    title: string;
    countries: string[];
  }>;

  const [selectedCountry, setSelectedCountry] = useState<null | string>(null);

  // Function to get industry icon based on title (works for both English and Polish)
  const getIndustryIcon = (title: string): string => {
    // Check for English titles
    if (title === "Finance" || title === "Finanse") return "💰";
    if (title === "IT & Cybersecurity" || title === "IT i Cyberbezpieczeństwo") return "🖥️";
    if (title === "Healthcare" || title === "Opieka Zdrowotna") return "🩺";
    if (title === "Hospitality" || title === "Hotelarstwo") return "🏨";
    
    // Default fallback
    return "🌍";
  };

  return (
    <section
      id="Markets"
      className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#f5f7fa] to-[#fff7d4]/30 text-[#1a1a2e] py-32 px-4 sm:px-10 space-y-32 relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(218,165,32,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(253,246,227,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.04),transparent_70%)]" />
      
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(rgba(218,165,32,0.4) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(218,165,32,0.4) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#daa520]/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#fff7d4]/25 to-transparent rounded-full blur-3xl" />

      {/* Enhanced Section Heading */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fff7d4]/60 via-white/80 to-[#fff7d4]/60 backdrop-blur-md px-8 py-3 rounded-full border border-[#daa520]/30 shadow-lg mb-8">
            <span className="w-2 h-2 bg-[#daa520] rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[#1a1a2e] tracking-wider uppercase">{t("markets.header.badge")}</span>
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-light mb-8 tracking-tight leading-tight"
        >
          {t("markets.header.title")}{" "}
          <span className="block text-4xl md:text-5xl bg-gradient-to-r from-[#daa520] to-[#b8860b] bg-clip-text text-transparent font-normal mt-2">
            {t("markets.header.subtitle")}
          </span>
        </motion.h3>
        
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-[3px] w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent rounded-full" />
          <div className="w-3 h-3 bg-[#daa520] rounded-full animate-pulse" />
          <div className="h-[3px] w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <p className="text-lg sm:text-xl leading-relaxed text-[#1a1a2e]/85 max-w-4xl mx-auto font-light">
            {t("markets.header.description")}
          </p>
          <p className="text-base leading-relaxed text-[#708090] max-w-3xl mx-auto font-light">
            {t("markets.header.recruitment")}
          </p>
        </motion.div>
      </div>

      {/* Enhanced Countries Section */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fff7d4]/60 via-white/80 to-[#fff7d4]/60 backdrop-blur-md px-6 py-2 rounded-full border border-[#daa520]/30 shadow-lg mb-6">
            <span className="w-2 h-2 bg-[#daa520] rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[#1a1a2e] tracking-wider uppercase">{t("markets.countries.badge")}</span>
          </div>
          <h4 className="text-3xl md:text-4xl font-light text-[#1a1a2e] mb-4">
            {t("markets.countries.title")}
          </h4>
          <div className="w-16 h-1 bg-gradient-to-r from-[#daa520] to-[#b8860b] rounded-full mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-center">
          {countries.map((country, index) => (
            <TooltipProvider key={country.code}>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCountry(country.name)}
                    className="relative bg-gradient-to-br from-white/95 via-[#fdf6e3]/50 to-white/90 backdrop-blur-lg border-2 border-[#daa520]/20 hover:border-[#daa520]/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl flex flex-col items-center transition-all duration-500 cursor-pointer group overflow-hidden"
                  >
                    {/* Enhanced background elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/0 via-[#daa520]/3 to-[#fff7d4]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#daa520]/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-tr from-[#fff7d4]/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Enhanced flag container */}
                    <motion.div
                      whileHover={{ rotate: [0, -3, 3, 0] }}
                      transition={{ duration: 0.4 }}
                      className="relative mb-4 p-3 rounded-2xl bg-gradient-to-br from-[#fff7d4]/40 to-[#daa520]/15 border-2 border-[#daa520]/25 group-hover:border-[#daa520]/50 group-hover:shadow-lg transition-all duration-500"
                    >
                      <img
                        src={`/flags/${country.code}.${country.type}`}
                        alt={country.name}
                        className="w-12 h-8 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                      />
                      
                      {/* Enhanced shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
                    </motion.div>
                    
                    <span className="text-sm font-semibold text-[#1a1a2e] group-hover:text-[#daa520] transition-colors duration-300 text-center leading-tight relative z-10">
                      {country.name}
                    </span>
                    
                    {/* Enhanced hover indicator */}
                    <motion.div
                      className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#daa520] rounded-full shadow-sm" />
                    </motion.div>
                  </motion.div>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Enhanced Country Modal */}
      {selectedCountry && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 h-full z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-white/95 via-[#fdf6e3]/60 to-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-[#daa520]/30 max-w-lg w-full mx-4 overflow-hidden"
          >
            {/* Enhanced decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/5 via-transparent to-[#fff7d4]/10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#daa520]/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#fff7d4]/20 to-transparent rounded-tr-full" />
            
            {/* Enhanced close button */}
            <div className="w-full flex justify-end p-6 relative z-10">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group rounded-full p-3 bg-white/90 backdrop-blur-sm border-2 border-[#daa520]/50 shadow-lg hover:bg-[#daa520] hover:shadow-xl hover:border-[#daa520] transition-all duration-300 flex items-center justify-center"
                onClick={() => setSelectedCountry(null)}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#daa520" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"/>
                </svg>
              </motion.button>
            </div>
            
            <div className="relative px-10 pb-10 pt-4 flex flex-col items-center z-10">
              {/* Enhanced flag and title section */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center mb-8"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-16 rounded-3xl bg-gradient-to-br from-white to-[#fff7d4]/60 border-2 border-[#daa520]/60 shadow-xl flex items-center justify-center p-3">
                    <img
                      src={`/flags/${countries.find(c => c.name === selectedCountry)?.code}.${countries.find(c => c.name === selectedCountry)?.type}`}
                      alt={selectedCountry}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  {/* Enhanced decorative rings */}
                  <div className="absolute -inset-2 border-2 border-[#daa520]/30 rounded-3xl animate-pulse" />
                  <div className="absolute -inset-4 border border-[#daa520]/15 rounded-3xl" />
                </div>
                
                <h3 className="text-3xl font-light text-[#1a1a2e] mb-3 tracking-tight text-center">{selectedCountry}</h3>
                <div className="flex items-center space-x-3 text-[#daa520] text-lg font-semibold mb-6">
                  <span>{t("markets.modal.availableIndustries")}</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-xl"
                  >
                    ⚡
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#daa520]/40 to-transparent mb-8" />
              
              {/* Enhanced industries grid */}
              <div className="grid grid-cols-1 gap-4 w-full">
                {industries.filter(i => i.countries.includes(selectedCountry)).map((industry, index) => (
                  <motion.div 
                    key={industry.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-gradient-to-r from-white/90 to-[#fff7d4]/40 rounded-2xl px-6 py-5 border-2 border-[#daa520]/20 shadow-sm hover:shadow-lg hover:border-[#daa520]/50 transition-all duration-300 group backdrop-blur-sm"
                  >
                    <motion.span 
                      whileHover={{ scale: 1.3, rotate: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl group-hover:scale-110 transition-transform duration-300"
                    >
                      {getIndustryIcon(industry.title)}
                    </motion.span>
                    <span className="text-[#1a1a2e] font-semibold text-lg group-hover:text-[#daa520] transition-colors duration-300">{industry.title}</span>
                  </motion.div>
                ))}
                {industries.filter(i => i.countries.includes(selectedCountry)).length === 0 && (
                  <div className="text-[#708090] text-center py-6 italic bg-white/50 rounded-2xl border border-[#daa520]/20">
                    {t("markets.modal.noIndustries")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Map & Industries Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between max-w-8xl mx-auto gap-16 relative z-10">
        {/* Enhanced Map Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-2/3 relative group"
        >
          <div className="relative bg-gradient-to-br from-white/95 via-[#fdf6e3]/50 to-white/90 backdrop-blur-2xl border-2 border-[#daa520]/25 hover:border-[#daa520]/50 rounded-3xl shadow-2xl hover:shadow-3xl p-8 transition-all duration-700 overflow-hidden">
            {/* Enhanced background elements */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-bl from-[#daa520]/10 to-transparent rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-[#fff7d4]/20 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/0 via-[#daa520]/2 to-[#fff7d4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            
            {/* Corner accents */}
            <div className="absolute top-4 right-4 w-6 h-6 border-2 border-[#daa520]/40 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#daa520]/30 rounded-full group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fff7d4]/60 via-white/80 to-[#fff7d4]/60 backdrop-blur-md px-6 py-2 rounded-full border border-[#daa520]/30 shadow-lg mb-4">
                  <span className="w-2 h-2 bg-[#daa520] rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-[#1a1a2e] tracking-wider uppercase">{t("markets.map.badge")}</span>
                </div>
                <h5 className="text-2xl font-light text-[#1a1a2e] mb-2">{t("markets.map.title")}</h5>
                <p className="text-[#708090] text-sm">{t("markets.map.description")}</p>
              </div>
              <WorldMapComponent />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Industries Accordion */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/3 relative"
        >
          <div className="sticky top-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fff7d4]/60 via-white/80 to-[#fff7d4]/60 backdrop-blur-md px-6 py-2 rounded-full border border-[#daa520]/30 shadow-lg mb-6">
                <span className="w-2 h-2 bg-[#daa520] rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-[#1a1a2e] tracking-wider uppercase">{t("markets.industries.badge")}</span>
              </div>
              <h4 className="text-3xl md:text-4xl font-light text-[#1a1a2e] mb-4">
                {t("markets.industries.title")}
              </h4>
              <div className="w-16 h-1 bg-gradient-to-r from-[#daa520] to-[#b8860b] rounded-full mx-auto"></div>
            </motion.div>
            
            <Accordion type="multiple" className="space-y-6">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem value={industry.title}>
                    <AccordionTrigger value={industry.title}>
                      <div className="flex items-center gap-4 w-full group/trigger">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/90 to-[#fff7d4]/60 border-2 border-[#daa520]/30 group-hover/trigger:border-[#daa520]/60 flex items-center justify-center shadow-lg group-hover/trigger:shadow-xl transition-all duration-300"
                        >
                          <span className="text-3xl">
                            {getIndustryIcon(industry.title)}
                          </span>
                        </motion.div>
                        <div className="flex-1 text-left">
                          <motion.div 
                            className="text-xl font-semibold text-[#1a1a2e] group-hover/trigger:text-[#daa520] transition-colors duration-300"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {industry.title}
                          </motion.div>
                          <motion.div 
                            className="text-sm text-[#708090] font-medium mt-1"
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {industry.countries.length} {t("markets.accordion.exploreText")}
                          </motion.div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent value={industry.title}>
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 pt-4"
                      >
                        <motion.p 
                          className="text-[#708090] text-sm font-medium mb-6 bg-gradient-to-r from-[#fff7d4]/30 to-white/60 p-4 rounded-xl border border-[#daa520]/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {t("markets.accordion.partnershipText")}
                        </motion.p>
                        <div className="flex flex-wrap gap-3">
                          {industry.countries.map((country, countryIndex) => (
                            <motion.span
                              key={country}
                              initial={{ opacity: 0, scale: 0.8, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ 
                                duration: 0.4, 
                                delay: countryIndex * 0.1,
                                ease: "easeOut"
                              }}
                              whileHover={{ 
                                scale: 1.05, 
                                y: -2,
                              }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-gradient-to-r from-white/90 via-[#fff7d4]/60 to-white/80 text-sm text-[#1a1a2e] px-5 py-3 rounded-full border-2 border-[#daa520]/25 hover:border-[#daa520]/60 hover:shadow-lg hover:bg-gradient-to-r hover:from-[#fff7d4]/80 hover:to-[#daa520]/25 transition-all duration-300 cursor-pointer font-semibold relative overflow-hidden group backdrop-blur-sm"
                              onClick={() => setSelectedCountry(country)}
                            >
                              {/* Enhanced shimmer effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                              />
                              <span className="relative z-10">{country}</span>
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
