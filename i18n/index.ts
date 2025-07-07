import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt';

// Define a recursive type that allows string indexing
export interface TranslationObject {
  [key: string]: string | TranslationObject;
}

// Define the structure of our translations
export const translations: Record<Language, TranslationObject> = {
  en,
  es,
  fr,
  de,
  pt
};