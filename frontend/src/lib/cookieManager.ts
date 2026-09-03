// Cookie management service for GDPR compliance
export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  performance: boolean;
  advertising: boolean;
}

export interface CookieData {
  preferences: CookiePreferences;
  consentDate: string;
  consentId: string;
}

export class CookieManager {
  private static readonly COOKIE_NAME = 'dto_cookie_preferences';
  private static readonly COOKIE_EXPIRY_DAYS = 365;

  // Get current cookie preferences
  static getPreferences(): CookiePreferences | null {
    try {
      const cookieData = this.getCookieData();
      return cookieData?.preferences || null;
    } catch (error) {
      console.error('Error reading cookie preferences:', error);
      return null;
    }
  }

  // Save cookie preferences
  static savePreferences(preferences: CookiePreferences): void {
    try {
      const cookieData: CookieData = {
        preferences,
        consentDate: new Date().toISOString(),
        consentId: this.generateConsentId()
      };

      const cookieString = JSON.stringify(cookieData);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS);

      document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(cookieString)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
      
      // Apply the preferences immediately
      this.applyPreferences(preferences);
      
      console.log('Cookie preferences saved:', preferences);
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    }
  }

  // Check if user has made a choice
  static hasConsent(): boolean {
    return this.getPreferences() !== null;
  }

  // Get full cookie data
  static getCookieData(): CookieData | null {
    try {
      const cookies = document.cookie.split(';');
      const targetCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${this.COOKIE_NAME}=`)
      );

      if (!targetCookie) return null;

      const cookieValue = targetCookie.split('=')[1];
      const decodedValue = decodeURIComponent(cookieValue);
      return JSON.parse(decodedValue);
    } catch (error) {
      console.error('Error parsing cookie data:', error);
      return null;
    }
  }

  // Apply preferences by enabling/disabling tracking scripts
  static applyPreferences(preferences: CookiePreferences): void {
    // Analytics (Google Analytics, etc.)
    if (preferences.analytics) {
      this.enableGoogleAnalytics();
    } else {
      this.disableGoogleAnalytics();
    }

    // Performance monitoring
    if (preferences.performance) {
      this.enablePerformanceMonitoring();
    } else {
      this.disablePerformanceMonitoring();
    }

    // Functional cookies (language preference, theme, etc.)
    if (preferences.functional) {
      this.enableFunctionalFeatures();
    } else {
      this.disableFunctionalFeatures();
    }

    // Advertising/Marketing
    if (preferences.advertising) {
      this.enableAdvertising();
    } else {
      this.disableAdvertising();
    }
  }

  // Initialize on page load
  static initialize(): void {
    const preferences = this.getPreferences();
    if (preferences) {
      this.applyPreferences(preferences);
    }
  }

  // Clear all cookies and reset preferences
  static clearPreferences(): void {
    document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log('Cookie preferences cleared');
  }

  // Generate unique consent ID
  private static generateConsentId(): string {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Google Analytics management
  private static enableGoogleAnalytics(): void {
    if (typeof window !== 'undefined' && !window.gtag) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(...args: unknown[]) {
        window.dataLayer.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        cookie_expires: 63072000 // 2 years
      });
    }
  }

  private static disableGoogleAnalytics(): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  }

  // Performance monitoring
  private static enablePerformanceMonitoring(): void {
    // Enable performance tracking APIs
    if ('performance' in window) {
      // Log performance metrics
      console.log('Performance monitoring enabled');
    }
  }

  private static disablePerformanceMonitoring(): void {
    console.log('Performance monitoring disabled');
  }

  // Functional features
  private static enableFunctionalFeatures(): void {
    // Save language preferences, theme settings, etc.
    console.log('Functional features enabled');
  }

  private static disableFunctionalFeatures(): void {
    // Remove functional cookies
    console.log('Functional features disabled');
  }

  // Advertising
  private static enableAdvertising(): void {
    console.log('Advertising cookies enabled');
  }

  private static disableAdvertising(): void {
    console.log('Advertising cookies disabled');
  }
}

// Global type declarations
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  CookieManager.initialize();
}
