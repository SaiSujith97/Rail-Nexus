import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { translations } from '../translations';

type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml';
type TranslationKey = keyof typeof translations.en;

interface LocalizationContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  availableLanguages: Record<LanguageCode, string>;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const availableLanguages: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let translationSet = translations[language] || translations.en;
    let translation = translationSet[key] || translations.en[key] || String(key);
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`{${paramKey}}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }
    return translation;
  };

  const contextValue = useMemo(() => ({
    language,
    setLanguage: (lang) => setLanguage(lang as LanguageCode),
    t,
    availableLanguages
  }), [language]);

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
