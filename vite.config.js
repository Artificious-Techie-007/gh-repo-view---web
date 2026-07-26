import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev: Vite runs on :5173 and proxies /api calls to `vercel dev` on :3000
// (run `vercel dev` in a second terminal, see README).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
