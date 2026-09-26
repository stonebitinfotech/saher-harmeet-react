import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The ported theme CSS (assets/css/styles.css + fonts.css) and every image /
// font / media file live under public/ untouched, so their relative paths
// resolve exactly as they did in the original static site.
export default defineConfig({
  plugins: [react()],
  // Local dev only: in production nginx forwards /api/link-config to the
  // link-config service (deploy/link-config-api in the templates repo) and adds
  // this header itself. To try saving locally, run that service on port 3900.
  server: {
    proxy: {
      "/api/link-config": {
        target: "http://127.0.0.1:3900",
        headers: { "X-Site": "saher-harmeet" },
      },
    },
  },
});
