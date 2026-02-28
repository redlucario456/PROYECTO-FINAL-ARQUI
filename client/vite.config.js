import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Esto obliga a Vite a quedarse en esta carpeta y no mirar hacia afuera
  root: process.cwd(), 
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})