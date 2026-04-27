import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    noDiscovery: true,
    include: [
      '@hugeicons/core-free-icons',
      '@hugeicons/react',
      'clsx',
      'framer-motion',
      'react',
      'react-dom',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
    ],
  },
})
