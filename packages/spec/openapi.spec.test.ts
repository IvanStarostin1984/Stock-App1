import { describe, it } from 'vitest';
import { execSync } from 'node:child_process';

/** Ensure the OpenAPI definition passes linting. */
describe('OpenAPI spec', () => {
  it('lint passes with no errors', () => {
    execSync('npx openapi lint spec/openapi.yaml', { stdio: 'pipe' });
  });
});
