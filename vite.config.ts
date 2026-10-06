import { defineConfig, loadEnv } from "vite";
import { seoAssets } from "./build/seoAssets";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), seoAssets(loadEnv(mode, ".", "VITE_").VITE_SITE_URL)],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
}));
