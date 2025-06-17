import { execSync } from 'node:child_process';
import { it } from 'vitest';

it('lints OpenAPI spec without errors', () => {
  execSync('npx openapi lint ../spec/openapi.yaml', { stdio: 'inherit' });
});
