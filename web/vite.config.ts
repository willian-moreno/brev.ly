import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(react|react-dom|react-router-dom)/,
            },
            { name: 'query-vendor', test: /node_modules\/@tanstack\// },
            { name: 'radix-vendor', test: /node_modules\/@radix-ui\// },
            { name: 'icons-vendor', test: /node_modules\/@phosphor-icons\// },
            {
              name: 'form-vendor',
              test: /node_modules\/(react-hook-form|@hookform|zod)/,
            },
            { name: 'vendor', test: /node_modules\// },
          ],
        },
      },
    },
  },
})
