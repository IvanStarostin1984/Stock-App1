import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MainPage from '../src/pages/MainPage.vue';

describe('MainPage', () => {
  it('shows main heading', () => {
    const wrapper = mount(MainPage);
    expect(wrapper.find('h1').text()).toBe('Main Page');
  });

  it('does not contain search text', () => {
    const wrapper = mount(MainPage);
    expect(wrapper.text()).not.toContain('Search Page');
  });
});
