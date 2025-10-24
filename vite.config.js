import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
  },
  plugins: [
    svelte(),
    viteSingleFile(),
  ],
});
