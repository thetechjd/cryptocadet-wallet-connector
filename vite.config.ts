import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  optimizeDeps: {
    exclude: ["react", "react-dom"]
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WalletConnector',
      formats: ['es', 'umd'],
      fileName: (format) => `wallet-connector.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: [
      "react",
      "react-dom",
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          ethers: 'ethers',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return 'assets/[name][extname]';
        },
      },
    },
    // Copy assets to dist
    copyPublicDir: false,
  },
  assetsInclude: ['**/*.png', '**/*.svg', '**/*.jpg'],
});