import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en.json';
import lvTranslation from '../locales/lv.json';
import ruTranslation from '../locales/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      lv: { translation: lvTranslation },
      ru: { translation: ruTranslation },
    },
    lng: 'lv', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
