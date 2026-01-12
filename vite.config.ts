import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Reemplaza 'NOMBRE_DE_TU_REPOSITORIO' por el nombre real de tu repo en GitHub
export default defineConfig({
  plugins: [react()],
  base: './', // Esto permite que funcione en cualquier subcarpeta de GitHub Pages
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
  }
});