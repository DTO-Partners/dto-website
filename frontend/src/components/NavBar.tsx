import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useNavbar } from "@/hooks/useNavbar";
import { LanguageToggle } from "./navbar/LanguageToggle";

export default function Navbar() {
  const {
    isScrolled,
    isMobileMenuOpen,
    currentLang,
    navItems,
    activeSection,
    toggleMobileMenu,
    closeMobileMenu,
    changeLanguage,
    scrollToTop,
  } = useNavbar();

  const darkMode = isScrolled || isMobileMenuOpen;
  const surfaceClass = darkMode
    ? "border-b border-white/[0.06] bg-[#0d0d0c]/72 text-[#f2efe7] shadow-[0_14px_44px_rgba(0,0,0,.12)] backdrop-blur-[18px]"
    : "border-b border-transparent bg-transparent text-white";

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 top-0 z-[100] w-full transition-all duration-500 ${surfaceClass}`}
      aria-label="Primary navigation"
    >
      <div className="relative z-50 mx-auto h-20 w-full px-5 md:px-8 lg:h-[84px] lg:px-12 xl:px-[72px]">
        <button
          onClick={scrollToTop}
          className="absolute left-5 top-1/2 min-h-11 -translate-y-1/2 whitespace-nowrap text-left transition hover:text-[#f2efe7] focus:outline-none focus:ring-2 focus:ring-[#c7954b] md:left-8 lg:left-12 xl:left-[72px]"
          aria-label="DTO Partners home"
        >
          <span className="block text-sm font-semibold uppercase tracking-[0.28em]">DTO Partners</span>
        </button>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <ul className="flex items-center gap-10 text-xs font-semibold uppercase tracking-[0.2em] xl:gap-12">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.id}
                  smooth
                  duration={750}
                  offset={-80}
                  className={`group relative block cursor-pointer py-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#c7954b] ${
                    activeSection === item.id ? "text-[#f2efe7]" : "text-current/68 hover:-translate-y-px hover:text-current"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-[#c7954b] transition-all duration-300 ${
                      activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-5 text-xs font-semibold uppercase tracking-[0.18em] md:right-8 lg:right-12 lg:flex xl:right-[72px]">
          <LanguageToggle currentLang={currentLang} onLanguageChange={changeLanguage} isScrolled={darkMode} />
          <a
            className="whitespace-nowrap py-3 text-current/70 underline decoration-transparent underline-offset-8 transition hover:text-current hover:decoration-[#c7954b] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
            href="/login"
          >
            Log in
          </a>
          <Link
            to="Candidates & Employers"
            smooth
            duration={750}
            offset={-80}
            className="group inline-flex min-h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-[#c7954b] px-4 py-2.5 text-[#0d0d0c] shadow-[0_10px_28px_rgba(199,149,75,.22)] transition hover:bg-[#e0b66d] focus:outline-none focus:ring-2 focus:ring-[#f2efe7]"
          >
            Register
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-3 md:right-8 lg:hidden">
          <LanguageToggle currentLang={currentLang} onLanguageChange={changeLanguage} isScrolled={darkMode} variant="mobile-inline" />
          <button
            onClick={toggleMobileMenu}
            className="inline-flex min-h-11 items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] transition hover:text-[#c7954b] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <><span>Menu</span><Menu className="ml-2 h-4 w-4" /></>}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 top-0 z-40 h-dvh min-h-screen w-screen overflow-y-auto bg-[#0d0d0c] px-5 pb-36 pt-24 text-[#f2efe7] md:px-8 lg:hidden"
        >
          <div className="flex min-h-full flex-col justify-start gap-9">
            <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                smooth
                duration={650}
                offset={-80}
                onClick={closeMobileMenu}
                className="block cursor-pointer overflow-hidden text-[clamp(2.75rem,13vw,5.25rem)] font-semibold uppercase leading-[0.9]"
              >
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
            </div>
            <div className="grid gap-5 text-sm uppercase tracking-[0.18em]">
              <LanguageToggle currentLang={currentLang} onLanguageChange={changeLanguage} isScrolled={true} variant="mobile-list" />
              <Link
                to="Candidates & Employers"
                smooth
                duration={650}
                offset={-80}
                onClick={closeMobileMenu}
                className="group inline-flex min-h-12 w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#c7954b] px-4 py-3 text-sm font-semibold text-[#0d0d0c] shadow-[0_12px_30px_rgba(199,149,75,.22)] transition hover:bg-[#e0b66d] focus:outline-none focus:ring-2 focus:ring-[#f2efe7]"
              >
                Register
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <a className="min-h-11 w-fit py-3 text-[#f2efe7]/78 transition hover:text-[#f2efe7] focus:outline-none focus:ring-2 focus:ring-[#c7954b]" href="/login">
                Log in
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
