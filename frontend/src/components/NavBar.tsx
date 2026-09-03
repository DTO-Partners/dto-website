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
    toggleLanguage,
    scrollToTop,
  } = useNavbar();

  const darkMode = isScrolled || isMobileMenuOpen;
  const barClass = darkMode
    ? "ml-auto w-fit max-w-[calc(100vw-2.5rem)] border border-white/[0.05] bg-[#0d0d0c]/30 text-[#f2efe7] shadow-[0_14px_44px_rgba(0,0,0,.12)] backdrop-blur-xl"
    : "bg-transparent text-white";

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-50 w-full px-5 pt-5 md:px-8 lg:px-12"
      aria-label="Primary navigation"
    >
      <div className={`relative z-50 mx-auto flex min-h-14 items-start justify-between transition-all duration-500 ${darkMode ? "mt-0 gap-8 px-4 py-2" : "max-w-[1500px] px-0 py-0"} ${barClass}`}>
        <button
          onClick={scrollToTop}
          className="min-h-11 whitespace-nowrap text-left focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
          aria-label="DTO Partners home"
        >
          <span className="block text-sm font-semibold uppercase tracking-[0.28em]">DTO Partners</span>
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em]">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.id}
                  smooth
                  duration={750}
                  offset={-80}
                  className={`group relative block cursor-pointer py-3 transition focus:outline-none focus:ring-2 focus:ring-[#c7954b] ${
                    activeSection === item.id ? "text-[#f2efe7]" : "text-current/72 hover:text-current"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#c7954b] transition-all duration-300 ${
                      activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em]">
            <LanguageToggle currentLang={currentLang} onToggle={toggleLanguage} isScrolled={darkMode} />
            <a className="whitespace-nowrap py-3 text-current/72 transition hover:text-current focus:outline-none focus:ring-2 focus:ring-[#c7954b]" href="/login">
              Log in
            </a>
            <Link
              to="Candidates & Employers"
              smooth
              duration={750}
              offset={-80}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap py-3 text-[#f2efe7] transition hover:text-[#c7954b] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
            >
              Register
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle currentLang={currentLang} onToggle={toggleLanguage} isScrolled={darkMode} />
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
          className="fixed inset-0 z-40 bg-[#0d0d0c]/94 px-5 pb-8 pt-28 text-[#f2efe7] backdrop-blur-2xl lg:hidden"
        >
          <div className="flex min-h-full flex-col justify-between">
            <div className="grid gap-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                smooth
                duration={650}
                offset={-80}
                onClick={closeMobileMenu}
                className="block min-h-16 cursor-pointer overflow-hidden text-[clamp(3.4rem,16vw,6.25rem)] font-semibold uppercase leading-[0.86]"
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
              <Link
                to="Candidates & Employers"
                smooth
                duration={650}
                offset={-80}
                onClick={closeMobileMenu}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 py-3 text-3xl font-semibold text-[#c7954b]"
              >
                Register
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a className="min-h-11 py-3" href="/login">
                Log in
              </a>
              <button onClick={toggleLanguage} className="min-h-11 w-fit py-3 text-left">
                {currentLang === "en" ? "PL" : "EN"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
