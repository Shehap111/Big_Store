import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import de from './locales/de.json';  // إضافة اللغة الألمانية
import fr from './locales/fr.json';  // إضافة اللغة الفرنسية

// استرجاع اللغة من Local Storage إذا كانت موجودة
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
      de: {
        translation: de,  // إضافة اللغة الألمانية
      },
      fr: {
        translation: fr,  // إضافة اللغة الفرنسية
      },
    },
    lng: savedLanguage, // تعيين اللغة الافتراضية من Local Storage
    fallbackLng: 'en', // اللغة الاحتياطية في حالة وجود خطأ
    interpolation: {
      escapeValue: false, // React بالفعل تقوم بالتهرب من الحروف
    },
  });

// تغيير الـ direction بناءً على اللغة
i18n.on('languageChanged', (lng) => {
  const direction = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;

  // حفظ اللغة المختارة في Local Storage
  localStorage.setItem('language', lng);
});

export default i18n;
