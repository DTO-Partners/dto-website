export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_STORAGE_KEY = "dto-cookie-consent";
const LANGUAGE_STORAGE_KEY = "dto-language";

export interface CookiePreferences {
  essential: true;
  functional: boolean;
}

export interface CookieConsent {
  version: number;
  essential: true;
  functional: boolean;
  consentedAt: string;
}

export const defaultCookiePreferences: CookiePreferences = {
  essential: true,
  functional: false,
};

function isConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== "object") return false;

  const consent = value as Partial<CookieConsent>;

  return (
    consent.version === COOKIE_CONSENT_VERSION &&
    consent.essential === true &&
    typeof consent.functional === "boolean" &&
    typeof consent.consentedAt === "string" &&
    !Number.isNaN(Date.parse(consent.consentedAt))
  );
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export class CookieManager {
  static getConsent(): CookieConsent | null {
    if (!canUseStorage()) return null;

    try {
      const rawConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!rawConsent) return null;

      const parsedConsent = JSON.parse(rawConsent);
      return isConsent(parsedConsent) ? parsedConsent : null;
    } catch (error) {
      console.error("Error reading cookie consent:", error);
      return null;
    }
  }

  static getPreferences(): CookiePreferences | null {
    const consent = this.getConsent();
    if (!consent) return null;

    return {
      essential: true,
      functional: consent.functional,
    };
  }

  static hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  static savePreferences(preferences: CookiePreferences): CookieConsent | null {
    if (!canUseStorage()) return null;

    const consent: CookieConsent = {
      version: COOKIE_CONSENT_VERSION,
      essential: true,
      functional: preferences.functional,
      consentedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
      this.applyPreferences(preferences);
      window.dispatchEvent(new CustomEvent("dto-cookie-consent-updated", { detail: consent }));
      return consent;
    } catch (error) {
      console.error("Error saving cookie consent:", error);
      return null;
    }
  }

  static clearPreferences(): void {
    if (!canUseStorage()) return;

    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("dto-cookie-consent-updated"));
  }

  static applyPreferences(preferences: CookiePreferences): void {
    if (!preferences.functional) {
      this.clearStoredLanguage();
    }
  }

  static initialize(): void {
    const preferences = this.getPreferences();
    if (preferences) {
      this.applyPreferences(preferences);
    }
  }

  static canUseFunctionalStorage(): boolean {
    return this.getConsent()?.functional === true;
  }

  static getStoredLanguage(): string | null {
    if (!canUseStorage() || !this.canUseFunctionalStorage()) return null;

    const language = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return language === "pl" || language === "en" ? language : null;
  }

  static saveLanguage(language: string): void {
    if (!canUseStorage() || !this.canUseFunctionalStorage()) return;

    if (language === "pl" || language === "en") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  static clearStoredLanguage(): void {
    if (!canUseStorage()) return;

    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  }
}

declare global {
  interface Window {
    resetCookieConsent?: () => void;
  }
}

if (typeof window !== "undefined" && import.meta.env.DEV) {
  window.resetCookieConsent = () => CookieManager.clearPreferences();
}
