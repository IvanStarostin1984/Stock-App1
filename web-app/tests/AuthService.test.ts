import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../src/services/AuthService';

beforeEach(() => {
  localStorage.clear();
});

describe('AuthService', () => {
  it('register saves encrypted credential', () => {
    const svc = new AuthService();
    const cred = svc.register('a@b.com', 'pwd');
    expect(cred.email).toBe('a@b.com');
    expect(localStorage.getItem('user_cred')).not.toBeNull();
  });

  it('login succeeds with correct password', () => {
    const svc = new AuthService();
    svc.register('a@b.com', 'pwd');
    expect(svc.login('a@b.com', 'pwd')).toBe(true);
  });

  it('login fails with wrong password', () => {
    const svc = new AuthService();
    svc.register('a@b.com', 'pwd');
    expect(svc.login('a@b.com', 'bad')).toBe(false);
  });

  it('login fails with missing input', () => {
    const svc = new AuthService();
    expect(svc.login('', 'pwd')).toBe(false);
  });
});
