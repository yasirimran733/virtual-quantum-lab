import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",

    plugins: [react()],

    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api/qrng": {
          target: "https://qrng.anu.edu.au",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/qrng/, "/API/jsonI.php"),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              const apiKey = env.VITE_ANU_QRNG_API_KEY;
              if (apiKey) {
                proxyReq.setHeader("x-api-key", apiKey);
              }
            });
          },
        },
      },
    },
  };
});
