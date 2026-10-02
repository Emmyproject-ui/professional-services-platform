import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // In local dev: proxy /api to your local PHP server (XAMPP on port 80)
      // In Docker production: Apache serves /api directly — no proxy needed
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/project/backend/api')
      }
    }
  }
})

