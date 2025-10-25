import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Base publique pour GitHub Pages (repo projet sous /PORTFOLIO/)
  // Cela garantit que les assets référencés depuis le bundle
  // pointent vers /PORTFOLIO/react/dist/...
  base: '/PORTFOLIO/react/dist/',
  plugins: [react()],
  publicDir: false,
  server: { port: 5173 },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        bar: resolve(__dirname, 'src/bar.jsx')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith('.css')) return 'assets/[name].css'
          return 'assets/[name][extname]'
        }
      }
    }
  }
})
