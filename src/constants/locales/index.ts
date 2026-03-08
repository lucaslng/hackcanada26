import { ar } from './ar';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { hi } from './hi';
import { it } from './it';
import { tl } from './tl';
import type { Language, LocalePack, UIStrings } from './types';
import { ur } from './ur';
import { zhHans } from './zhHans';
import { zhHant } from './zhHant';

export type { Language, LocalePack, UIStrings } from './types';

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'zh-Hans', label: '简体中文' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'tl', label: 'Tagalog' },
  { value: 'zh-Hant', label: '繁體中文' },
  { value: 'it', label: 'Italiano' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ur', label: 'اردو' },
];

const LOCALES: Record<Language, LocalePack> = {
  en,
  fr,
  es,
  'zh-Hans': zhHans,
  ar,
  hi,
  tl,
  'zh-Hant': zhHant,
  it,
  de,
  ur,
};

export const getLocale = (language: Language): LocalePack => LOCALES[language];

export const getUIStrings = (language: Language): UIStrings => getLocale(language).ui;

export const getServiceText = (serviceId: string, language: Language) =>
  getLocale(language).serviceText[serviceId] ?? LOCALES.en.serviceText[serviceId] ?? null;

export const getServiceDetailsText = (serviceId: string, language: Language) =>
  getLocale(language).serviceDetails[serviceId] ?? LOCALES.en.serviceDetails[serviceId] ?? null;

export const getProvinceName = (code: string, language: Language) =>
  getLocale(language).provinces[code] ?? LOCALES.en.provinces[code] ?? code;
