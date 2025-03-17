import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // تأكد من أنها esnext
    polyfillModulePreload: false, // تعطيل الـ polyfill لتجنب الأخطاء
  }
});
