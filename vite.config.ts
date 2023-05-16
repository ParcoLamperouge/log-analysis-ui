
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
const { resolve } = require("path");

const serverConfig:any = {
  logServer: {
    protocol: "http",
    hostname: "127.0.0.1",
    prefix: "/",
    port: "8848",
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: './',
  server: {
    proxy: {
      "/logServer": {
        target: `${serverConfig.logServer.protocol}://${serverConfig.logServer.hostname}:${serverConfig.logServer.port}`,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/logServer/, "")
      }
    }
  },
  // set path alias
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src")
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: "@import 'src/assets/styles/colors.scss';"
      }
    }
  }
})
