import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PortfolioPage from '../src/pages/PortfolioPage.vue';

describe('PortfolioPage', () => {
  it('renders portfolio heading', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.find('h1').text()).toBe('Portfolio Page');
  });

  it('does not contain pro text', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.text()).not.toContain('Pro Page');
  });
});
