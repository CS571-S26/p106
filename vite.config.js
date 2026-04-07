import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/p106',
  plugins: [react()],
  server: {
    proxy: {
      '/api/wynncraft': {
        target: 'https://api.wynncraft.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wynncraft/, ''),
      },
    },
  },
  build: {
    outDir: 'docs',
  },
})
