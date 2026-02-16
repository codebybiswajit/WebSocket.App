// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load only VITE_ variables (optional)
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Backend is HTTPS on 7130, and it already includes /api in the route.
  const backendOrigin =
    mode === 'development'
      ? (env.VITE_DEV_PROXY_TARGET || 'https://localhost:7130') // <-- NO /api here
      : (env.VITE_API_URL || 'https://localhost:7130');

  const serverPort = parseInt(env.VITE_PORT || '5173', 10);

  return {
    plugins: [react()],

    define: {
      __APP_URL__: JSON.stringify(env.VITE_APP_URL || `http://localhost:${serverPort}`),
      __API_URL__: JSON.stringify(env.VITE_API_URL || backendOrigin),
    },

  "compilerOptions": {
    "types": ["vite/client"]
  },


    server: {
      port: serverPort,
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      // allowedHosts: ["websocket-app-codebybiswajit.onended.com", "localhost:5173",]
      allowedHosts: ["websocket-app-codebybiswajit.onrender.com", "localhost:5173",]
    },
    // base: mode === 'production' ? '/app/' : '/',
  };
});