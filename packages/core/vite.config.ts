import { defineConfig } from 'vite';
import { resolve } from 'path';

const config = () => {
  return {
    base: './',
    build: {
      lib: {
        entry: resolve(__dirname, './index.ts'),
        name: 'Kuaitu',
        fileName: 'index',
      },
      outDir: resolve(__dirname, '../../dist'),
    },
  };
};

export default defineConfig(config);
