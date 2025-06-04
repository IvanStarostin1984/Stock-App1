import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeadlineCard from '../src/components/HeadlineCard.vue';
import type { Quote } from '../src/services/MarketstackService';

const mockGetQuote = vi.fn();
vi.mock('../src/services/MarketstackService', () => ({
  MarketstackService: vi.fn().mockImplementation(() => ({
    getQuote: mockGetQuote
  }))
}));

const sampleQuote: Quote = {
  symbol: 'AAPL',
  date: '2024-01-01',
  open: 1,
  high: 2,
  low: 0.5,
  close: 1.5
};

describe('HeadlineCard', () => {
  beforeEach(() => {
    mockGetQuote.mockReset();
  });
  it('renders quote when service succeeds', async () => {
    mockGetQuote.mockResolvedValue(sampleQuote);
    const wrapper = mount(HeadlineCard);
    await new Promise(r => setTimeout(r, 0));
    expect(wrapper.text()).toContain('AAPL');
    expect(wrapper.text()).toContain('1.5');
  });

  it('shows loading when service returns null', async () => {
    mockGetQuote.mockResolvedValue(null);
    const wrapper = mount(HeadlineCard);
    await new Promise(r => setTimeout(r, 0));
    expect(wrapper.text()).toBe('Loading...');
  });
});
