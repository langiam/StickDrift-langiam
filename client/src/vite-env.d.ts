/// <reference types="vite/client" />
// client/vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // your Express server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
