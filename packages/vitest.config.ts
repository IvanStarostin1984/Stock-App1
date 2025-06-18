import { defineConfig } from 'vitest/config';

export default defineConfig({
  coverage: {
    provider: 'v8',
    exclude: ['**/generated-ts/**', '**/generated-dart/**'],
  },
});
