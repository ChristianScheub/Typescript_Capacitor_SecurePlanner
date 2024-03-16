import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StringRadioOption from './string-radioBtn';

describe('StringRadioOption', () => {
  it('renders option and can be selected', () => {
    const onChangeMock = jest.fn();
    render(<StringRadioOption label="Option A" value="A" selectedValue="" onChange={onChangeMock} />);

    fireEvent.click(screen.getByText(/Option A/i));
    expect(onChangeMock).toHaveBeenCalledWith('A');
  });

  it('shows as selected when value matches selectedValue', () => {
    const { container } = render(
      <StringRadioOption
        label="Medium Security"
        value="Medium"
        selectedValue="Medium"
        onChange={() => {}}
      />
    );

    expect(container.firstChild).toHaveClass('selected');
  });
});