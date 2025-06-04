import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SearchPage from '../src/pages/SearchPage.vue';

describe('SearchPage', () => {
  it('renders search heading', () => {
    const wrapper = mount(SearchPage);
    expect(wrapper.find('h1').text()).toBe('Search Page');
  });

  it('does not contain main text', () => {
    const wrapper = mount(SearchPage);
    expect(wrapper.text()).not.toContain('Main Page');
  });
});
