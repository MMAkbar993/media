import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    host: "0.0.0.0",
    proxy: {
      '/api': 'http://localhost:5000', // or your backend port
    }
  }
  })
