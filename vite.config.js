import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
})
