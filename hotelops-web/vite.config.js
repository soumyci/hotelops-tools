
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // (optional) If you really want @pages, keep it and use it consistently:
      // "@pages": path.resolve(__dirname, "src/pages"),
      // "@routes": path.resolve(__dirname, "src/routes"),
    },
  },
  server: {
    proxy: {
      "/api": { target: "https://localhost:7212", changeOrigin: true, secure: false },
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { fileURLToPath, URL } from "node:url";
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: { 
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//       '@pages': path.resolve(__dirname, 'src/pages'),
//       '@routes': path.resolve(__dirname, 'src/routes')    
//     },
//   },
//   server: {
//     proxy: {
//       "/api": { target: "https://localhost:7212", changeOrigin: true, secure: false },
//     },
//   },
// });
