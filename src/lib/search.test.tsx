import React from 'react';
import { render } from '@testing-library/react';
import { createFuse, highlightMatch } from './search';

const flights = [
  {
    id: 'f1',
    airline: 'Skyway Airlines',
    from: 'New York',
    to: 'Los Angeles',
    description: 'Fast coast-to-coast service',
  },
  {
    id: 'f2',
    airline: 'Oceanic Air',
    from: 'London',
    to: 'Dubai',
    description: 'Premium route',
  },
];

describe('search utilities', () => {
  it('creates a Fuse instance that can find matching flights', () => {
    const fuse = createFuse(flights as any);
    const results = fuse.search('oceanic');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.airline).toBe('Oceanic Air');
  });

  it('highlights a matching substring in text', () => {
    const { container } = render(React.createElement(React.Fragment, null, highlightMatch('Skyway Airlines', 'way')));
    expect(container.querySelector('mark')?.textContent).toBe('way');
  });

  it('returns original text when no query is provided', () => {
    const { container } = render(React.createElement(React.Fragment, null, highlightMatch('Skyway Airlines', '')));
    expect(container.textContent).toBe('Skyway Airlines');
  });
});
