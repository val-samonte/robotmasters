import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   host: 'rmdev.local',
  //   port: 3000,
  //   https: {
  //     key: fs.readFileSync('./certs/key.pem'),
  //     cert: fs.readFileSync('./certs/cert.pem'),
  //   },
  // },
})
