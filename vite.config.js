import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/qrng': {
          target: 'https://qrng.anu.edu.au',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/qrng/, '/API/jsonI.php'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add API key from environment variable
              const apiKey = env.VITE_ANU_QRNG_API_KEY
              if (apiKey) {
                // ANU QRNG API uses API key in headers
                proxyReq.setHeader('x-api-key', apiKey)
                // Alternative: if API key should be in query params, uncomment below:
                // const url = new URL(proxyReq.path, 'https://qrng.anu.edu.au')
                // url.searchParams.set('apiKey', apiKey)
                // proxyReq.path = url.pathname + url.search
              }
            })
          },
        },
      },
    },
  }
})

