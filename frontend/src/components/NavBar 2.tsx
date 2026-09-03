import { motion } from "framer-motion";
import { useNavbar } from "@/hooks/useNavbar";
import { NavbarLogo } from "./navbar/NavbarLogo";
import { NavbarMenu } from "./navbar/NavbarMenu";
import { LanguageToggle } from "./navbar/LanguageToggle";
import { MobileMenuButton } from "./navbar/MobileMenuButton";
import { MobileMenu } from "./navbar/MobileMenu";
import { ScrollProgressBar } from "./navbar/ScrollProgressBar";

export default function Navbar() {
  const {
    isScrolled,
    isMobileMenuOpen,
    currentLang,
    navItems,
    isVisible,
    toggleMobileMenu,
    closeMobileMenu,
    toggleLanguage,
    scrollToTop
  } = useNavbar();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: 1  // Always keep navbar visible when it's shown
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? "navbar-glass navbar-glow border-white/10"
          : "border-transparent"
      } border-b`}
      style={{
        background: isScrolled || isMobileMenuOpen ? undefined : 'transparent'
      }}
    >
      {/* Enhanced background pattern for scrolled state - only visible when scrolled */}
      {(isScrolled || isMobileMenuOpen) && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#243046]/90 to-[#1a1a2e]/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Ambient light effect - only show when scrolled */}
      {(isScrolled || isMobileMenuOpen) && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-[#daa520]/30 to-transparent" />
      )}
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10 min-h-[80px]">
        {/* Logo */}
        <NavbarLogo 
          isScrolled={isScrolled}
          onLogoClick={scrollToTop}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavbarMenu 
            navItems={navItems}
            isScrolled={isScrolled}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <LanguageToggle 
            currentLang={currentLang}
            onToggle={toggleLanguage}
            isScrolled={isScrolled}
          />

          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen}
            onToggle={toggleMobileMenu}
            isScrolled={isScrolled}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        currentLang={currentLang}
        onItemClick={closeMobileMenu}
        onLanguageToggle={toggleLanguage}
      />

      {/* Scroll Progress Bar */}
      {isScrolled && <ScrollProgressBar />}
    </motion.nav>
  );
}