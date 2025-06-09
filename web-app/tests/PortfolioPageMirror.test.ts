import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PortfolioPage from '../src/pages/PortfolioPage.vue';
import { createPinia, setActivePinia } from 'pinia';

describe('PortfolioPage mirror', () => {
  setActivePinia(createPinia());
  it('shows expected text', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.text()).toContain('Portfolio Page');
  });

  it('does not show wrong text', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.text()).not.toContain('Wrong');
  });
});
