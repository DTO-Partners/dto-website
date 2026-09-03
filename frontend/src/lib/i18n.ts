import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@locals/en.json";
import pl from "@locals/pl.json";
import { CookieManager } from "./cookieManager";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    fallbackLng: "en",
    lng: CookieManager.getStoredLanguage() ?? undefined,
    detection: {
      order: ["querystring", "navigator"],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
