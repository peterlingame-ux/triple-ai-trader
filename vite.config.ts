import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build output
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          crypto: ['ethers', 'lightweight-charts'],
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    // Pre-bundle frequently used dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@tanstack/react-query',
    ],
  },
}));
