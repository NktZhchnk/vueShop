import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    hmr: {
      overlay: false, // Отключение сообщений об ошибках поверх приложения
    },
    host: '0.0.0.0', // Здесь устанавливаем host
    // другие настройки сервера
  },
  optimizeDeps: {
    dynamicImportTargets: ['node_modules'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
