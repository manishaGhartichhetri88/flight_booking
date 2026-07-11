import { act, renderHook } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  it('returns the debounced value after the specified delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('second');

    vi.useRealTimers();
  });
});
