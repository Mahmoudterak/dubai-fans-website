import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // ── Vendored workspace packages ─────────────────────────────────────
      // CSS entry must come before the bare package alias so Vite matches the
      // more-specific path first.
      '@workspace/dubai-fans-ds/styles.css': path.resolve(
        import.meta.dirname,
        'src/vendor/dubai-fans-ds/index.css',
      ),
      '@workspace/dubai-fans-ds/components': path.resolve(
        import.meta.dirname,
        'src/vendor/dubai-fans-ds/components',
      ),
      '@workspace/dubai-fans-ds/lib': path.resolve(
        import.meta.dirname,
        'src/vendor/dubai-fans-ds/lib',
      ),
      '@workspace/dubai-fans-ds/hooks': path.resolve(
        import.meta.dirname,
        'src/vendor/dubai-fans-ds/hooks',
      ),
      '@workspace/dubai-fans-ds/tokens': path.resolve(
        import.meta.dirname,
        'src/vendor/dubai-fans-ds/generated/tokens.tsx',
      ),
      '@workspace/dubai-fans-ds': path.resolve(
        import.meta.dirname,
        'src/vendor/dubai-fans-ds/generated/tokens.tsx',
      ),
      '@workspace/blog-data': path.resolve(
        import.meta.dirname,
        'src/vendor/blog-data/index.ts',
      ),
      '@workspace/api-client-react': path.resolve(
        import.meta.dirname,
        'src/vendor/api-client-react/index.ts',
      ),
      // ── App aliases ──────────────────────────────────────────────────────
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'public/assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    // Raise the warning threshold — charts / framer-motion are legitimately large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react:   ['react', 'react-dom'],
          router:  ['wouter'],
          motion:  ['framer-motion'],
          query:   ['@tanstack/react-query'],
          recharts: ['recharts'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
