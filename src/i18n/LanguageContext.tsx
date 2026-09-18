import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { en } from './en';
import { ar } from './ar';

export type Language = 'en' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isArabic: boolean;
  isRTL: boolean;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatDate: (date: string | Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (timeStr: string) => string;
  translateStatus: (status: string) => string;
  translateSpecialty: (specialty: string) => string;
  translateLocation: (location: string) => string;
}

const STORAGE_KEY = 'meetadr_language';

const dictionaries: Record<Language, typeof en> = {
  en,
  ar,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to safely resolve nested keys with dot notation
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || !path) return undefined;
  const keys = path.split('.');
  let current: any = obj;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore localStorage issues
    }
    return 'en';
  });

  const isArabic = language === 'ar';
  const isRTL = language === 'ar';

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore localStorage issues
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  // Synchronize document direction and lang attributes globally
  useEffect(() => {
    const dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Add or remove an rtl class on the html body for convenience in custom styling if needed
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  // Translate function with fallback and parameter interpolation
  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      // 1. Try active language dictionary
      let val = getNestedValue(dictionaries[language], path);

      // 2. Fallback to English if missing or empty
      if (!val && language !== 'en') {
        val = getNestedValue(dictionaries.en, path);
      }

      // 3. Fallback to clean human-readable text if missing
      if (!val) {
        if (path && path.includes('.')) {
          const parts = path.split('.');
          const lastPart = parts[parts.length - 1];
          val = lastPart
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase())
            .replace(/\bBtn\b/i, '')
            .trim();
        } else {
          val = path;
        }
      }

      // 4. Interpolate parameters like {count}, {name}
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          val = val!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
        });
      }

      return val;
    },
    [language]
  );

  // Locale-aware date formatting
  const formatDate = useCallback(
    (dateInput: string | Date | number, options?: Intl.DateTimeFormatOptions): string => {
      if (!dateInput) return '';
      try {
        const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
        if (isNaN(d.getTime())) return String(dateInput);

        const defaultOptions: Intl.DateTimeFormatOptions = options || {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };

        const locale = language === 'ar' ? 'ar-AE' : 'en-US';
        return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
      } catch {
        return String(dateInput);
      }
    },
    [language]
  );

  // Localized time formatting (e.g., "10:30 AM" -> "10:30 ص" or localized time)
  const formatTime = useCallback(
    (timeStr: string): string => {
      if (!timeStr) return '';
      if (language !== 'ar') return timeStr;

      // Translate standard AM / PM
      return timeStr
        .replace(/AM/gi, 'ص')
        .replace(/PM/gi, 'م')
        .replace(/\bMorning\b/gi, 'الصباح')
        .replace(/\bAfternoon\b/gi, 'الظهيرة')
        .replace(/\bEvening\b/gi, 'المساء');
    },
    [language]
  );

  // Translate appointment status values safely
  const translateStatus = useCallback(
    (status: string): string => {
      if (!status) return '';
      const s = status.toLowerCase();
      const translated = getNestedValue(dictionaries[language], `status.${s}`);
      return translated || status;
    },
    [language]
  );

  // Translate specialty names
  const translateSpecialty = useCallback(
    (specialty: string): string => {
      if (!specialty) return '';
      const translated = getNestedValue(dictionaries[language], `specialties.${specialty}`);
      return translated || specialty;
    },
    [language]
  );

  // Translate UAE city / location names
  const translateLocation = useCallback(
    (location: string): string => {
      if (!location) return '';
      const direct = getNestedValue(dictionaries[language], `locations.${location}`);
      if (direct) return direct;

      // If location contains hyphen separator (e.g. "Dubai - Downtown"), translate each part
      if (location.includes(' - ')) {
        const parts = location.split(' - ').map((part) => {
          const trimmed = part.trim();
          const translatedPart = getNestedValue(dictionaries[language], `locations.${trimmed}`);
          return translatedPart || trimmed;
        });
        return parts.join(' - ');
      }

      return location;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isArabic,
      isRTL,
      t,
      formatDate,
      formatTime,
      translateStatus,
      translateSpecialty,
      translateLocation,
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      isArabic,
      isRTL,
      t,
      formatDate,
      formatTime,
      translateStatus,
      translateSpecialty,
      translateLocation,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// Also export useLanguage alias
export const useLanguage = useTranslation;
