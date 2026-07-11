import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from './index';

describe('Pagination', () => {
  it('renders current page and total pages', () => {
    render(React.createElement(Pagination, { currentPage: 2, totalPages: 5, onPageChange: vi.fn() }));
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('disables the Prev button on the first page', () => {
    render(React.createElement(Pagination, { currentPage: 1, totalPages: 3, onPageChange: vi.fn() }));
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('calls onPageChange when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(React.createElement(Pagination, { currentPage: 1, totalPages: 3, onPageChange }));

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
