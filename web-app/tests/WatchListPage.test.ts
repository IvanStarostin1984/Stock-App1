import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import WatchListPage from '../src/pages/WatchListPage.vue';
import 'fake-indexeddb/auto';

beforeEach(() => {
  localStorage.clear();
});

describe('WatchListPage', () => {
  it('renders saved symbols', async () => {
    localStorage.setItem('watch_list', JSON.stringify(['AAPL', 'GOOG']));
    const wrapper = mount(WatchListPage);
    await new Promise(r => setTimeout(r, 0));
    expect(wrapper.text()).toContain('AAPL');
    expect(wrapper.text()).toContain('GOOG');
  });

  it('renders empty list when none saved', async () => {
    const wrapper = mount(WatchListPage);
    await new Promise(r => setTimeout(r, 0));
    expect(wrapper.findAll('li').length).toBe(0);
  });
});
