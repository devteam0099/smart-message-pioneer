import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
const savedLanguage = localStorage.getItem("i18nextLng") || "en";
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: savedLanguage,
    debug: true,
    supportedLngs: ["en", "zh"], // Add supported languages
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      // Path where resources get loaded from
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });
export default i18n;
