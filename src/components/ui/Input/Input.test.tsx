import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './index';

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(React.createElement(Input, { placeholder: 'Enter text' }));
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts a default value and renders it', () => {
    render(React.createElement(Input, { defaultValue: 'hello' }));
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });
});
