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

  it('parses optional symbol param', () => {
    const match = router.resolve('/detail/ABC');
    expect(match.name).toBe('detail');
    expect(match.params.symbol).toBe('ABC');
  });

  it('resolves login route', () => {
    const match = router.resolve('/login');
    expect(match.name).toBe('login');
  });
});
