import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    tsconfig: './tsconfig.test.json',
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    deps: {
      inline: ['@testing-library/react'],
    },
  },
});
