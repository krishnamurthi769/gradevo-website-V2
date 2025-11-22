import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': './'
      }
    },
    build: {
      outDir: 'dist', // ❗ This is required for Render static hosting
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Keep @react-three with React in the main vendor chunk to avoid context issues
              if (id.includes('@react-three')) {
                return 'vendor';
              }
              // Split the heavy 'three' library
              if (id.includes('three')) {
                return 'three-vendor';
              }
              if (id.includes('gsap') || id.includes('framer-motion')) {
                return 'animation-vendor';
              }
              return 'vendor';
            }
          }
        }
      }
    }
  };
});
