export type Locale = 'en' | 'tr';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  tr: () => import('./tr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.tr();
};
