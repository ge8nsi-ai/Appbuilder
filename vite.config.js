import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic'
  })],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"development"'
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'WHOP_'],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  },
  resolve: {
    alias: {
      'react/jsx-runtime': 'react/cjs/react-jsx-runtime.development.js',
      'react/jsx-dev-runtime': 'react/cjs/react-jsx-dev-runtime.development.js'
    }
  }
})