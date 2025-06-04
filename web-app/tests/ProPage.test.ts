import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ProPage from '../src/pages/ProPage.vue';

describe('ProPage', () => {
  it('renders pro heading', () => {
    const wrapper = mount(ProPage);
    expect(wrapper.find('h1').text()).toBe('Pro Page');
  });

  it('does not contain main text', () => {
    const wrapper = mount(ProPage);
    expect(wrapper.text()).not.toContain('Main Page');
  });
});
