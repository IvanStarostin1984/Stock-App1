import { defineConfig } from 'vitest/config';

export default defineConfig({
  coverage: {
    provider: 'v8',
    include: ['core/net.ts'],
    exclude: ['**/generated-ts/**', '**/generated-dart/**', '**/core/src/**'],
    all: false,
  },
});
