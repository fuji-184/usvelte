import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "./"), // ⬅️ root project jadi src/
  plugins: [svelte()],
  build: {
    outDir: path.resolve(__dirname, "build"), // ⬅️ hasil build tetap ke folder dist di root
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "./shared/index.html"), // ⬅️ entry HTML
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // opsional: import dari '@/entry-client.js'
  // "@": path.resolve(__dirname, "./"), // opsional: import dari '@/entry-client.js'
    },
  },
});
