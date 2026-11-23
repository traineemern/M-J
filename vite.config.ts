/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const sampleDataPath = mode === 'production' && env.VITE_SHOW_SAMPLE_DATA !== 'true'
    ? './src/data/about.sample.production.ts'
    : './src/data/about.sample.ts'

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: [
        { find: '@/data/about.sample', replacement: path.resolve(__dirname, sampleDataPath) },
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('/node_modules/three/') ||
              id.includes('/node_modules/@react-three/') ||
              id.includes('/node_modules/three-stdlib/') ||
              id.includes('/node_modules/maath/') ||
              id.includes('/node_modules/suspend-react/')
            ) return 'diorama-runtime'
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/react-router-dom/')
            ) return 'vendor'
            if (id.includes('/node_modules/motion/')) return 'motion'
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: false,
    },
  }
})
