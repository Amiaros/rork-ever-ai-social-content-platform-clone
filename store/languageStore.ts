import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations, TranslationObject } from '@/i18n';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language: Language) => {
        set({ language });
      },
      t: (key: string) => {
        const { language } = get();
        const keys = key.split('.');
        
        let translation: TranslationObject | string = translations[language] || translations.en;
        
        for (const k of keys) {
          if (typeof translation === 'string' || translation === undefined) {
            // We've reached a string value or undefined, can't go deeper
            return typeof translation === 'string' ? translation : key;
          }
          
          // Safe access with type checking
          const nextLevel = translation[k as keyof typeof translation];
          if (nextLevel === undefined) {
            // Key not found, try fallback to English
            let fallbackTranslation: TranslationObject | string = translations.en;
            
            // Try to navigate to the same path in English translations
            for (const fallbackKey of keys) {
              if (typeof fallbackTranslation === 'string' || fallbackTranslation === undefined) {
                return typeof fallbackTranslation === 'string' ? fallbackTranslation : key;
              }
              
              fallbackTranslation = fallbackTranslation[fallbackKey as keyof typeof fallbackTranslation];
              if (fallbackTranslation === undefined) {
                // If we can't find it in English either, return the key
                return key;
              }
            }
            
            return typeof fallbackTranslation === 'string' ? fallbackTranslation : key;
          }
          
          translation = nextLevel as TranslationObject | string;
        }
        
        return typeof translation === 'string' ? translation : key;
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);