import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` keeps every asset path relative, so the same build works on
// Vercel (served at /), GitHub Pages (served at /<repo>/) and a Tailscale
// share (served from `vite preview` behind `tailscale serve`).
//
// `allowedHosts` lets MagicDNS names like `laptop.tailnet-1234.ts.net` reach
// the dev/preview server; Vite blocks unknown Host headers by default.
const tailnetHosts = ['.ts.net']

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: tailnetHosts,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: tailnetHosts,
  },
})
