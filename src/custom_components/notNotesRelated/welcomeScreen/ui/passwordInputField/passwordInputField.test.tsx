import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from './passwordInputField';

describe('PasswordInput', () => {
  it('renders and can change value', () => {
    const onChangeMock = jest.fn();
    render(<PasswordInput onChange={onChangeMock} />);

    fireEvent.change(screen.getByLabelText(/Enter your new Password/i), { target: { value: 'password123' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});