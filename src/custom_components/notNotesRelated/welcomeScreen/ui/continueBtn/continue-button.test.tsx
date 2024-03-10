import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContinueButton from './continue-button';

describe('ContinueButton', () => {
  it('renders button and responds to click', () => {
    const onClickMock = jest.fn();
    render(<ContinueButton onClick={onClickMock} textBtn="Click Me" />);

    fireEvent.click(screen.getByText(/Click Me/i));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});