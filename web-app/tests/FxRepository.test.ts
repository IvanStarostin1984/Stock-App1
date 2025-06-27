import { describe, it, expect, vi } from 'vitest';
import { FxRepository } from '../src/repositories/FxRepository';

describe('FxRepository', () => {
  it('caches rates from service', async () => {
    const getRate = vi.fn().mockResolvedValue(1.1);
    const repo = new FxRepository({ getRate } as any);
    const first = await repo.rate('USD', 'EUR');
    const second = await repo.rate('USD', 'EUR');
    expect(first).toBe(1.1);
    expect(second).toBe(1.1);
    expect(getRate).toHaveBeenCalledTimes(1);
  });

  it('returns null on quota denial', async () => {
    const getRate = vi.fn().mockResolvedValue(null);
    const repo = new FxRepository({ getRate } as any);
    const res = await repo.rate('USD', 'EUR');
    expect(res).toBeNull();
    expect(getRate).toHaveBeenCalled();
  });
});

