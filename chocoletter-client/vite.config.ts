import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer(), sentryVitePlugin({
    org: "ssafy-05",
    project: "javascript-react-5r"
  })],

  build: {
    sourcemap: true
  }
})