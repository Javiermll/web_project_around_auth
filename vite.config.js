import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/web_project_around_auth/",
  plugins: [react()],
  assetsInclude: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg"],
  server: {
    port: 3000,
  },
});
