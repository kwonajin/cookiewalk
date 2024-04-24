import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets', // 정적 자산(static assets)이 생성될 디렉토리를 지정합니다.
  }
})
