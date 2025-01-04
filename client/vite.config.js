import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    // proxy: {
    //   "/api": {
    //     target: "https://ooa-testing.onrender.com",
    //     changeOrigin: true,
    //   },
    //   "/socket.io": {
    //     target: "https://ooa-testing.onrender.com",
    //     ws: true,
    //   },
    // },
  },
});
