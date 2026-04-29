import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT || 8080),
    allowedHosts: ["insighta-webportal-production.up.railway.app"],
    // or use allowedHosts: true for quick unblock
  },
});
