import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// @ts-ignore
// import postcssPxToViewport from 'postcss-px-to-viewport'

// https://vite.dev/config/
export default defineConfig({
  base: '/wxwork/',
  plugins: [
    vue(),
    vueDevTools(), 
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    postcss: {
        plugins: [
            // postcssPxToViewport({
            //     viewportWidth: 375
            // })
        ] 
    }
  },
  build: {
    outDir: 'dist', // 构建输出目录
  },
  server: {
    proxy: {
      '/appl': {
        target: 'https://appl.chuangliniot.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/appl/, ''),
      },
      '/loca': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/loca/, ''),
      },
    },
  },
})
