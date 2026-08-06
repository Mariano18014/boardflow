import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [react(), tailwindcss(), metaImagesPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@ux": path.resolve(import.meta.dirname, "UX_Library"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    watch: {
      usePolling: true,
    },
    // Filesystem strictness
    fs: {
      strict: true,
      allow: [".."],
      deny: ["**/.*"],
    },
  },
});
