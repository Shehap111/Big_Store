import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2022", "chrome100", "safari15"], // تحديث لدعم top-level await
  },
});
