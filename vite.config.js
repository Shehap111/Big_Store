import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // مهم عشان يحل مشكلة المسارات بعد الرفع
  build: {
    target: 'esnext',
    polyfillModulePreload: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]"
      }
    }
  },
  server: {
    historyApiFallback: true
  },
  preview: {
    historyApiFallback: true
  }
});
