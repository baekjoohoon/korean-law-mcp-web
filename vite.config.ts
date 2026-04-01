import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Plugin to copy Cloudflare Functions to dist
function copyFunctions() {
  return {
    name: 'copy-functions',
    closeBundle() {
      const srcFunctions = path.resolve(__dirname, 'src/functions')
      const distFunctions = path.resolve(__dirname, 'dist/functions')

      if (existsSync(srcFunctions)) {
        // Create dist/functions directory
        if (!existsSync(distFunctions)) {
          mkdirSync(distFunctions, { recursive: true })
        }

        // Copy all function files recursively
        const copyRecursive = (src: string, dest: string) => {
          if (existsSync(src)) {
            const stats = require('fs').statSync(src)
            if (stats.isDirectory()) {
              if (!existsSync(dest)) {
                mkdirSync(dest, { recursive: true })
              }
              const files = require('fs').readdirSync(src)
              for (const file of files) {
                copyRecursive(path.join(src, file), path.join(dest, file))
              }
            } else {
              copyFileSync(src, dest)
            }
          }
        }

        copyRecursive(srcFunctions, distFunctions)
        console.log('✅ Cloudflare Functions copied to dist/functions')
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyFunctions()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
      '@server': path.resolve(__dirname, './src/server'),
      '@functions': path.resolve(__dirname, './src/functions'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      },
    },
  },
})
