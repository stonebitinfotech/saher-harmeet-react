import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The ported theme CSS (assets/css/styles.css + fonts.css) and every image /
// font / media file live under public/ untouched, so their relative paths
// resolve exactly as they did in the original static site.
export default defineConfig({
  plugins: [react()],
});
