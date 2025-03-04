import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    https: false,
    hmr: true,
    middleware: [
      history({}) // 添加路由回退中间件
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: './index.html'
      }
    }
  }
});