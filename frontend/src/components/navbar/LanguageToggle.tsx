import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import flagEn from "@/assets/flag-en.svg";
import flagPl from "@/assets/flag-pl.png";

type LanguageCode = "en" | "pl";

interface LanguageOption {
  code: LanguageCode;
  shortLabel: string;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: "en", shortLabel: "EN", label: "English", flag: flagEn },
  { code: "pl", shortLabel: "PL", label: "Polski", flag: flagPl },
];

interface LanguageToggleProps {
  currentLang: string;
  onLanguageChange: (language: string) => void;
  isScrolled?: boolean;
  variant?: "desktop" | "mobile-inline" | "mobile-list";
}

function normalizeLanguage(language: string): LanguageCode {
  return language.toLowerCase().startsWith("pl") ? "pl" : "en";
}

export function LanguageToggle({
  currentLang,
  onLanguageChange,
  isScrolled = false,
  variant = "desktop",
}: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeCode = normalizeLanguage(currentLang);
  const activeLanguage = languages.find((language) => language.code === activeCode) ?? languages[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (language: LanguageCode) => {
    onLanguageChange(language);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
      window.requestAnimationFrame(() => focusOption(0));
    }
  };

  const handleOptionKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption((index + 1) % languages.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption((index - 1 + languages.length) % languages.length);
    }
  };

  if (variant === "mobile-list") {
    return (
      <div className="grid gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/46">Language</p>
        <div className="grid gap-2">
          {languages.map((language) => {
            const isActive = language.code === activeCode;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => selectLanguage(language.code)}
                className={`flex min-h-11 w-full items-center gap-3 text-left text-sm font-semibold uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 focus:ring-[#c7954b] ${
                  isActive ? "text-[#c7954b]" : "text-[#f2efe7]/76 hover:text-[#f2efe7]"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <img src={language.flag} alt="" className="h-4 w-6 rounded-[2px] object-cover" />
                <span>{language.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const triggerTone = isScrolled
    ? "text-[#f2efe7]/82 hover:text-[#f2efe7]"
    : "text-white/86 hover:text-white";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
        className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap px-2 text-xs font-semibold uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 focus:ring-[#c7954b] ${triggerTone}`}
        aria-label={`Select language. Current language is ${activeLanguage.label}.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <img src={activeLanguage.flag} alt="" className="h-4 w-6 rounded-[2px] object-cover" />
        <span>{activeLanguage.shortLabel}</span>
        {variant === "desktop" && (
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Language options"
          className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-40 overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0c]/86 p-1.5 text-[#f2efe7] shadow-[0_18px_48px_rgba(0,0,0,.28)] backdrop-blur-xl ${
            variant === "mobile-inline" ? "right-0" : ""
          }`}
        >
          {languages.map((language, index) => {
            const isActive = language.code === activeCode;

            return (
              <button
                key={language.code}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => selectLanguage(language.code)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[#c7954b] ${
                  isActive ? "bg-[#c7954b]/14 text-[#c7954b]" : "text-[#f2efe7]/82 hover:bg-white/[0.06] hover:text-[#f2efe7]"
                }`}
              >
                <img src={language.flag} alt="" className="h-4 w-6 rounded-[2px] object-cover" />
                <span>{language.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
