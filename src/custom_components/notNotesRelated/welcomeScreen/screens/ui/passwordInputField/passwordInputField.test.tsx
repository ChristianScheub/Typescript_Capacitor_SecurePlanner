import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './passwordInputField';

it('renders and can change value', () => {
  const onChangeMock = vi.fn();
  render(<PasswordInput onChange={onChangeMock} />);

  const inputElement = screen.getByTestId("welcome-screen-password-input").querySelector('input');
  if(inputElement) {
    fireEvent.change(inputElement, { target: { value: 'password123' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  } else {
    throw new Error('input element not found');
  }
});
