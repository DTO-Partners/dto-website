import { useCallback, useEffect, useState } from "react";
import {
  CookieManager,
  type CookieConsent,
  type CookiePreferences,
  defaultCookiePreferences,
} from "@/lib/cookieManager";

export interface UseGDPRReturn {
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  preferences: CookiePreferences;
  consent: CookieConsent | null;
  hasConsented: boolean;
  updatePreference: (key: keyof CookiePreferences, value: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: () => void;
  showPreferences: () => void;
  closePreferences: () => void;
  resetConsent: () => void;
}

export function useGDPR(): UseGDPRReturn {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultCookiePreferences);
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const hasConsented = consent !== null;

  const syncFromStorage = useCallback(() => {
    const storedConsent = CookieManager.getConsent();
    setConsent(storedConsent);

    if (storedConsent) {
      setPreferences({
        essential: true,
        functional: storedConsent.functional,
      });
      setIsBannerVisible(false);
      CookieManager.applyPreferences({
        essential: true,
        functional: storedConsent.functional,
      });
      return;
    }

    setPreferences(defaultCookiePreferences);
    setIsBannerVisible(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
    if (!CookieManager.hasConsent()) {
      setIsBannerVisible(true);
    }
  }, []);

  useEffect(() => {
    syncFromStorage();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "dto-cookie-consent") {
        syncFromStorage();
      }
    };

    const handleConsentUpdate = () => syncFromStorage();
    const handleOpenPreferences = () => {
      syncFromStorage();
      setIsBannerVisible(false);
      setIsPreferencesOpen(true);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("dto-cookie-consent-updated", handleConsentUpdate);
    window.addEventListener("dto-open-cookie-settings", handleOpenPreferences);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("dto-cookie-consent-updated", handleConsentUpdate);
      window.removeEventListener("dto-open-cookie-settings", handleOpenPreferences);
    };
  }, [syncFromStorage]);

  const persistConsent = useCallback((nextPreferences: CookiePreferences) => {
    const savedConsent = CookieManager.savePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setConsent(savedConsent);
    setIsBannerVisible(false);
    setIsPreferencesOpen(false);
  }, []);

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return;

    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: value,
    }));
  };

  const acceptAll = () => {
    persistConsent({
      essential: true,
      functional: true,
    });
  };

  const rejectOptional = () => {
    persistConsent({
      essential: true,
      functional: false,
    });
  };

  const savePreferences = () => {
    persistConsent({
      essential: true,
      functional: preferences.functional,
    });
  };

  const showPreferences = () => {
    setIsBannerVisible(false);
    setIsPreferencesOpen(true);
  };

  const resetConsent = () => {
    CookieManager.clearPreferences();
    setConsent(null);
    setPreferences(defaultCookiePreferences);
    setIsPreferencesOpen(true);
    setIsBannerVisible(false);
  };

  return {
    isBannerVisible,
    isPreferencesOpen,
    preferences,
    consent,
    hasConsented,
    updatePreference,
    acceptAll,
    rejectOptional,
    savePreferences,
    showPreferences,
    closePreferences,
    resetConsent,
  };
}
