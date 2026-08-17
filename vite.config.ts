import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['dssm.up.railway.app', '.up.railway.app', '.railway.app', 'localhost', '127.0.0.1'],
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: '0.0.0.0',
    allowedHosts: ['dssm.up.railway.app', '.up.railway.app', '.railway.app', 'localhost', '127.0.0.1'],
  },
});
