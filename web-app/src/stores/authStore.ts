import { defineStore } from 'pinia';
import { AuthService, type UserCredential } from '@/services/AuthService';

export interface AuthDeps {
  authService?: AuthService;
}

export interface AuthState {
  user: UserCredential | null;
}

export function createAuthStore(deps: AuthDeps = {}) {
  return defineStore('auth', {
    state: (): AuthState => ({ user: null }),
    actions: {
      register(email: string, password: string) {
        const svc = deps.authService ?? new AuthService();
        this.user = svc.register(email, password);
      },
      login(email: string, password: string): boolean {
        const svc = deps.authService ?? new AuthService();
        const ok = svc.login(email, password);
        if (ok) this.user = svc.load();
        return ok;
      },
      logout() {
        this.user = null;
      }
    }
  });
}

export const useAuthStore = createAuthStore();
