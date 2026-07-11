import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from './index';

describe('Avatar', () => {
  it('renders initials from name when photo is missing', () => {
    render(React.createElement(Avatar, { name: 'Alice Brown' }));
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Profile: Alice Brown/ })).toHaveAttribute('href', '/profile');
  });

  it('falls back to email initials when name is missing', () => {
    render(React.createElement(Avatar, { email: 'jdoe@example.com' }));
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders image element when photo is provided', () => {
    render(React.createElement(Avatar, { photo: 'https://example.com/avatar.png', name: 'Jane Doe' }));
    expect(screen.getByRole('img', { name: /Jane Doe/ })).toBeInTheDocument();
  });
});
