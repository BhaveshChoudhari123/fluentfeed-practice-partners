import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  preview: {
    host: "0.0.0.0",
    allowedHosts: [
      "glorious-kindness-production-6a9d.up.railway.app",
    ],
  },
});