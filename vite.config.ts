import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: 10011,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:1002',
          changeOrigin: true,
        },
      },
    },
  }
})
