import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Set the test environment to Node.js
    environment: 'node',

    // Enable global test APIs (describe, it, expect)
    globals: true,

    // Coverage configuration
    coverage: {
      enabled: true,
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    },

    // Test file patterns
    include: [
      '**/test/**/*.test.ts',
      '**/test/**/*.spec.ts',
      '**/?(*.)+(spec|test).ts',
    ],

    // Ignore patterns
    exclude: ['node_modules', 'dist', 'coverage'],

    // Clear mocks automatically
    clearMocks: true,

    // Verbose output
    reporters: ['verbose'],
  },

  resolve: {
    // Module resolution
    extensions: ['.ts', '.js', '.json'],
  },
});
