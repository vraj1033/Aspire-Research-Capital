import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the project at https://vraj1033.github.io/Aspire-Research-Capital/
  // so every asset URL has to be prefixed with the repository name. Override
  // with VITE_BASE=/ when deploying to a custom domain or root host.
  base: process.env.VITE_BASE ?? '/Aspire-Research-Capital/',
})
