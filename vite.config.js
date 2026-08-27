import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
        projects: resolve(__dirname, 'src/projects.html'),
        contact: resolve(__dirname, 'src/contact.html')
      }
    }
  },
  server: { open: true }
});