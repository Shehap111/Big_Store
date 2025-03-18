import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // استخدم "/" عشان يضبط المسارات بشكل صحيح بعد الرفع على Vercel
  build: {
    target: 'esnext',
    polyfillModulePreload: false
  },
  server: {
    historyApiFallback: true
  },
  preview: {
    historyApiFallback: true
  },
  assetsInclude: ['**/*.js', '**/*.css', '**/*.html'] // يضمن تحميل الملفات بدون مشاكل MIME
});
