import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import NewsPricesPage from '../src/pages/NewsPricesPage.vue';

describe('NewsPricesPage', () => {
  it('renders news & prices heading', () => {
    const wrapper = mount(NewsPricesPage);
    expect(wrapper.find('h1').text()).toBe('News & Prices');
  });

  it('does not contain portfolio text', () => {
    const wrapper = mount(NewsPricesPage);
    expect(wrapper.text()).not.toContain('Portfolio Page');
  });
});
