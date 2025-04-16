import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/buscar': 'http://127.0.0.1:5000',
      '/autocomplete': 'http://127.0.0.1:5000',
      '/heap': 'http://127.0.0.1:5000'
    }
  }
});
