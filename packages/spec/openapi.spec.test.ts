import { execSync } from 'node:child_process';
import { it } from 'vitest';

it('lints OpenAPI spec without errors', () => {
  execSync('npm run lint:spec', { stdio: 'inherit' });
});
