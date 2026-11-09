import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site (kushalranaai.github.io) is served from the domain root, so base stays "/".
export default defineConfig({
  plugins: [react()],
  build: { target: "es2022", chunkSizeWarningLimit: 700 },
});
