interface LanguageToggleProps {
  currentLang: string;
  onToggle: () => void;
  isScrolled?: boolean;
}

export function LanguageToggle({ currentLang, onToggle, isScrolled = false }: LanguageToggleProps) {
  const nextLanguage = currentLang === "en" ? "Polish" : "English";

  return (
    <button
      onClick={onToggle}
      className={`min-h-11 px-2 text-xs font-semibold uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-[#b9823d] ${
        isScrolled
          ? "text-[#f2efe7]/78 hover:text-[#c7954b]"
          : "text-white/82 hover:text-white"
      }`}
      aria-label={`Switch to ${nextLanguage}`}
      title={`Switch to ${nextLanguage}`}
    >
      {currentLang === "en" ? "EN" : "PL"}
    </button>
  );
}
