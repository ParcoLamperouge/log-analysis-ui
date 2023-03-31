import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pkg from './package.json'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  // base: `/${pkg.name}/`,
  base: './${pkg.name}/',
  server: {
    host: "0.0.0.0"
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: "@import 'src/assets/styles/colors.scss';"
      }
    }
  }
})
