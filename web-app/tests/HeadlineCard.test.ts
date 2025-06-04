import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

let mockGetQuote: any;
vi.mock('../src/services/MarketstackService', () => ({
  MarketstackService: class {
    getQuote(symbol: string) {
      return mockGetQuote(symbol);
    }
  }
}));

import HeadlineCard from '../src/components/HeadlineCard.vue';

const sampleQuote = { symbol: 'AAPL', date: '2024-01-01', close: 1.5 } as const;

describe('HeadlineCard', () => {
  beforeEach(() => {
    mockGetQuote = vi.fn();
  });

  it('renders quote when service succeeds', async () => {
    mockGetQuote.mockResolvedValue(sampleQuote);
    const wrapper = mount(HeadlineCard);
    await flushPromises();
    expect(wrapper.text()).toContain('AAPL 1.5');
    expect(wrapper.text()).not.toContain('Loading...');
  });

  it('shows placeholder when service fails', async () => {
    mockGetQuote.mockResolvedValue(null);
    const wrapper = mount(HeadlineCard);
    await flushPromises();
    expect(wrapper.text()).toContain('Loading...');
    expect(wrapper.find('.headline-card').exists()).toBe(false);
  });
});
