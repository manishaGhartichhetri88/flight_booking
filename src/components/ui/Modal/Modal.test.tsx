import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Modal from './index';

describe('Modal', () => {
  it('does not render when open is false', () => {
    render(React.createElement(Modal, { title: 'Test', open: false, onClose: vi.fn() }, 'Content'));
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renders title and children when open', () => {
    render(React.createElement(Modal, { title: 'Test modal', open: true, onClose: vi.fn() }, 'Body content'));
    expect(screen.getByText('Test modal')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', () => {
    const onClose = vi.fn();
    render(React.createElement(Modal, { title: 'Close modal', open: true, onClose }, 'Body'));

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
