import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // تأكد من أنها esnext
    polyfillModulePreload: false, // تعطيل الـ polyfill لتجنب الأخطاء
  },
  server: {
    historyApiFallback: true, // حل مشكلة الريفريش وإعادة التوجيه للـ index.html
  },
  preview: {
    historyApiFallback: true, // يضمن نفس السلوك عند تشغيل preview
  }
});
