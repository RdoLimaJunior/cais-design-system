import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const designSystemDirectory = path.resolve(import.meta.dirname, '__DS_PATH__')
const designSystemSourceDirectory = path.join(designSystemDirectory, 'src')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // O design system importa os próprios arquivos pelo alias "@".
    alias: { '@': designSystemSourceDirectory },
    // Evita duas cópias do React (a do sistema e a do pacote linkado).
    dedupe: ['react', 'react-dom'],
  },
  server: {
    // O Vite só serve arquivos da pasta do sistema e da pasta do design system.
    fs: { allow: [import.meta.dirname, designSystemDirectory] },
  },
})
