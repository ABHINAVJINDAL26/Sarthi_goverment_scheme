import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: false,
    // Send /api/* to the Express backend (backend/, port 5000) during development.
    proxy: {
      '/api': {
        target: process.env.SARTHI_API_TARGET || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
