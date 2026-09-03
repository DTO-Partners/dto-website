import { motion, AnimatePresence } from 'framer-motion';
import flagEN from "@/assets/flag-en.svg";
import flagPL from "@/assets/flag-pl.png";

interface LanguageToggleProps {
  currentLang: string;
  onToggle: () => void;
  isScrolled?: boolean;
}

export function LanguageToggle({ currentLang, onToggle }: LanguageToggleProps) {
  return (
    <motion.div className="relative">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative group focus:outline-none"
        title={`Switch to ${currentLang === "en" ? "Polish" : "English"}`}
      >
        {/* Main button container */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[#daa520]/60 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#daa520]/20 backdrop-blur-sm bg-white/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentLang}
              src={currentLang === "en" ? flagEN : flagPL}
              alt={`Current language: ${currentLang === "en" ? "English" : "Polish"}`}
              className="w-full h-full object-cover"
              initial={{ scale: 0.8, opacity: 0, rotate: 180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: -180 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </AnimatePresence>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
        </div>
        
        {/* Glow effects */}
        <div className="absolute inset-0 bg-[#daa520]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        
        {/* Language indicator badge */}
        <motion.div 
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#daa520] to-[#b8860b] rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-xs font-bold text-white drop-shadow-sm">
            {currentLang.toUpperCase()}
          </span>
        </motion.div>
        
        {/* Pulse effect on language change */}
        <motion.div
          className="absolute inset-0 bg-[#daa520]/30 rounded-full"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          key={currentLang}
        />
      </motion.button>
      
      {/* Tooltip */}
      <motion.div
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        Switch to {currentLang === "en" ? "Polish" : "English"}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-l border-t border-white/10" />
      </motion.div>
    </motion.div>
  );
}
