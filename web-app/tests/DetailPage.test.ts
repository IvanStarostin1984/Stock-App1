import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

let mockSymbol: string | undefined;
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { symbol: mockSymbol } })
}));

import DetailPage from '../src/pages/DetailPage.vue';

describe('DetailPage', () => {
  beforeEach(() => {
    mockSymbol = 'AAA';
  });

  it('displays symbol from route params', () => {
    mockSymbol = 'XYZ';
    const wrapper = mount(DetailPage);
    expect(wrapper.text()).toContain('Symbol: XYZ');
  });

  it('does not display a different symbol', () => {
    mockSymbol = 'DEF';
    const wrapper = mount(DetailPage);
    expect(wrapper.text()).not.toContain('Symbol: XYZ');
  });
});
