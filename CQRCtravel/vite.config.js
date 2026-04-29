import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// 👇 这两句是 ESM 里获取 __dirname 的标准写法
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 配置 @ 指向 src 目录
      '@': path.resolve(__dirname, './src'),
    },
  },
})
