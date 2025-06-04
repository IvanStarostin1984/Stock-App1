import router from '../src/router';
import { describe, it, expect } from 'vitest';

describe('router', () => {
  it('resolves search route', () => {
    const match = router.resolve('/search');
    expect(match.name).toBe('search');
  });

  it('returns undefined for unknown route', () => {
    const match = router.resolve('/no-route');
    expect(match.name).toBeUndefined();
  });
});
