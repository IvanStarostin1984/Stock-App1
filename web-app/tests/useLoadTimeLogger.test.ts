import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, it, expect, vi } from 'vitest';
import { useLoadTimeLogger } from '../src/utils/useLoadTimeLogger';

const Dummy = defineComponent({
  setup() {
    useLoadTimeLogger('X');
    return () => null;
  }
});

describe('useLoadTimeLogger', () => {
  it('logs load time in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mount(Dummy);
    await new Promise(r => setTimeout(r, 0));
    expect(spy).toHaveBeenCalled();
    vi.unstubAllEnvs();
    spy.mockRestore();
  });

  it('does not log in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mount(Dummy);
    await new Promise(r => setTimeout(r, 0));
    expect(spy).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
    spy.mockRestore();
  });
});
