import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // تأكد إن base مظبوط
  build: {
    target: 'esnext',
    polyfillModulePreload: false,
    rollupOptions: {
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
