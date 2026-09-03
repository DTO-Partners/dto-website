import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGDPR } from "@/hooks/useGDPR";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function GDPRModal() {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);
  const {
    isBannerVisible,
    isPreferencesOpen,
    preferences,
    updatePreference,
    acceptAll,
    rejectOptional,
    savePreferences,
    showPreferences,
    closePreferences,
  } = useGDPR();

  useEffect(() => {
    if (!isPreferencesOpen) return;

    lastActiveElement.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusDrawer = window.setTimeout(() => {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    }, 120);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreferences();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => element.offsetParent !== null);

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusDrawer);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      lastActiveElement.current?.focus();
    };
  }, [closePreferences, isPreferencesOpen]);

  return (
    <>
      <AnimatePresence>
        {isBannerVisible && (
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 text-[#f4efe6] sm:px-6 sm:pb-6"
            aria-label={t("gdpr.banner.title")}
          >
            <div className="mx-auto max-w-[860px] border border-white/[0.08] bg-[#0f0e0c]/94 p-5 shadow-[0_24px_70px_rgba(0,0,0,.38)] backdrop-blur-[16px] sm:rounded-2xl sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c7954b]">
                    {t("gdpr.banner.title")}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d8d0c3]">
                    {t("gdpr.banner.description")}
                  </p>
                  <a
                    href="/privacy-policy"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4efe6]/72 transition hover:text-[#c7954b] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
                  >
                    {t("gdpr.privacyPolicy")}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                  <button
                    type="button"
                    onClick={rejectOptional}
                    className="min-h-11 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6]/72 transition hover:text-[#f4efe6] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
                  >
                    {t("gdpr.buttons.rejectOptional")}
                  </button>
                  <button
                    type="button"
                    onClick={showPreferences}
                    className="min-h-11 whitespace-nowrap border border-white/[0.12] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6] transition hover:border-[#c7954b]/70 hover:text-[#c7954b] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
                  >
                    {t("gdpr.buttons.preferences")}
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#c7954b] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f0e0c] shadow-[0_14px_32px_rgba(199,149,75,.18)] transition hover:bg-[#e0b66d] focus:outline-none focus:ring-2 focus:ring-[#f4efe6]"
                  >
                    {t("gdpr.buttons.acceptAll")}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreferencesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[120] bg-black/58 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePreferences();
            }}
          >
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-full flex-col border-l border-white/[0.08] bg-[#0f0e0c]/96 text-[#f4efe6] shadow-[0_0_80px_rgba(0,0,0,.45)] backdrop-blur-[16px] sm:max-w-[500px]"
            >
              <header className="border-b border-white/[0.08] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c7954b]">
                      {t("gdpr.panel.eyebrow")}
                    </p>
                    <h2 id={titleId} className="mt-3 text-2xl font-semibold uppercase tracking-[0.08em]">
                      {t("gdpr.panel.title")}
                    </h2>
                    <p id={descriptionId} className="mt-3 text-sm leading-6 text-[#d8d0c3]">
                      {t("gdpr.panel.description")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePreferences}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#f4efe6]/72 transition hover:text-[#c7954b] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
                    aria-label={t("gdpr.panel.close")}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-2 sm:px-7 gdpr-modal-scroll">
                <section className="border-b border-white/[0.08] py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4efe6]">
                        {t("gdpr.categories.essential.title")}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#bdb3a6]">
                        {t("gdpr.categories.essential.description")}
                      </p>
                    </div>
                    <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border border-[#c7954b]/30 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#c7954b]">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {t("gdpr.labels.alwaysOn")}
                    </span>
                  </div>
                </section>

                <section className="border-b border-white/[0.08] py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4efe6]">
                        {t("gdpr.categories.functional.title")}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#bdb3a6]">
                        {t("gdpr.categories.functional.description")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updatePreference("functional", !preferences.functional)}
                      className={`relative h-11 w-[70px] shrink-0 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#c7954b] ${
                        preferences.functional
                          ? "border-[#c7954b] bg-[#c7954b]"
                          : "border-white/[0.14] bg-white/[0.05]"
                      }`}
                      role="switch"
                      aria-checked={preferences.functional}
                      aria-label={t("gdpr.categories.functional.toggleLabel")}
                    >
                      <span
                        className={`absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#f4efe6] shadow-[0_8px_20px_rgba(0,0,0,.24)] transition-transform ${
                          preferences.functional ? "translate-x-[32px]" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <details className="group mt-5">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6]/68 transition hover:text-[#c7954b]">
                      {t("gdpr.panel.viewDetails")}
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <dl className="mt-3 grid gap-3 border-l border-[#c7954b]/30 pl-4 text-sm text-[#bdb3a6]">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6]/54">
                          {t("gdpr.details.provider")}
                        </dt>
                        <dd className="mt-1">{t("gdpr.categories.functional.details.provider")}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6]/54">
                          {t("gdpr.details.purpose")}
                        </dt>
                        <dd className="mt-1">{t("gdpr.categories.functional.details.purpose")}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6]/54">
                          {t("gdpr.details.storage")}
                        </dt>
                        <dd className="mt-1">localStorage: dto-language</dd>
                      </div>
                    </dl>
                  </details>
                </section>
              </div>

              <footer className="border-t border-white/[0.08] px-5 py-5 sm:px-7">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={rejectOptional}
                    className="min-h-11 text-xs font-semibold uppercase tracking-[0.16em] text-[#f4efe6]/70 transition hover:text-[#f4efe6] focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
                  >
                    {t("gdpr.buttons.rejectOptional")}
                  </button>
                  <button
                    type="button"
                    onClick={savePreferences}
                    className="min-h-12 rounded-lg bg-[#f4efe6] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f0e0c] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c7954b]"
                  >
                    {t("gdpr.buttons.savePreferences")}
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c7954b] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f0e0c] transition hover:bg-[#e0b66d] focus:outline-none focus:ring-2 focus:ring-[#f4efe6]"
                  >
                    {t("gdpr.buttons.acceptAll")}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </button>
                </div>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
