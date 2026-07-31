import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['maplibre-gl'],
  },
  server: {
    port: 5174,
  },
  server: {
    port: 5174,
    strictPort: true,
    fs: {
      allow: ['..'],
    },
  },
})
