import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const isDebug = process.env.DEBUG === 'true' || process.env.TAURI_DEBUG === 'true'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: isDebug ? false : 'esbuild',
    sourcemap: isDebug ? 'inline' : false,
  },
  define: {
    __DEV__: JSON.stringify(isDebug),
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG || 'false'),
  },
  logLevel: isDebug ? 'info' : 'warn',
})
