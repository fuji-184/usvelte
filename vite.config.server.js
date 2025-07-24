import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  build: {
    ssr: true,
    outDir: "dist/server",
    rollupOptions: {
      input: "./src/entry-server.js",
    },
    ssrOutput: "stream",
  },
});
