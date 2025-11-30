import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel deployment serve from root
  base: '/',
  build: {
    // Improve chunking for large bundles (split major libraries)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts']
        }
      }
    }
  }
})
