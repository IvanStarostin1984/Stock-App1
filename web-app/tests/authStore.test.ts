import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAuthStore } from '../src/stores/authStore';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('authStore', () => {
  it('register sets user', () => {
    const register = vi.fn().mockReturnValue({
      email: 'a@b.com',
      hash: '',
      salt: '',
      isPro: false,
      created: ''
    });
    const store = createAuthStore({ authService: { register } as any })();
    store.register('a@b.com', 'pwd');
    expect(store.user?.email).toBe('a@b.com');
    expect(register).toHaveBeenCalled();
  });

  it('login updates user on success', () => {
    const login = vi.fn().mockReturnValue(true);
    const load = vi.fn().mockReturnValue({
      email: 'a@b.com',
      hash: '',
      salt: '',
      isPro: false,
      created: ''
    });
    const store = createAuthStore({ authService: { login, load } as any })();
    const ok = store.login('a@b.com', 'pwd');
    expect(ok).toBe(true);
    expect(store.user?.email).toBe('a@b.com');
  });

  it('login leaves user null on failure', () => {
    const login = vi.fn().mockReturnValue(false);
    const store = createAuthStore({ authService: { login } as any })();
    const ok = store.login('a@b.com', 'pwd');
    expect(ok).toBe(false);
    expect(store.user).toBeNull();
  });
});
