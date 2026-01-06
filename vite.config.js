export default {
  server: {
    port: 10000,
  },
  build: {
    esbuild: {
      logOverride: { 'css-syntax-error': 'silent' },
    },
    outDir: 'build',
    sourcemap: 'hidden',
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      }
    }
  }
};
