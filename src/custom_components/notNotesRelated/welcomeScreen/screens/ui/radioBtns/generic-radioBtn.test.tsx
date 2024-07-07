import { render, fireEvent } from '@testing-library/react';
import SecurityOption from './generic-radioBtn';
import SecurityLevel from '../../../../../enums/SecurityLevel.enum';

describe('SecurityOption', () => {
  it('displays the label correctly and can be selected', () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <SecurityOption
        label="High Security"
        value={SecurityLevel.High}
        selectedValue={SecurityLevel.Medium}
        onChange={onChangeMock}
      />
    );

    expect(getByText('High Security')).toBeInTheDocument();
    
    fireEvent.click(getByText('High Security'));
    expect(onChangeMock).toHaveBeenCalledWith(SecurityLevel.High);
  });

  it('shows as selected when value matches selectedValue', () => {
    const { container } = render(
      <SecurityOption
        label="Medium Security"
        value={SecurityLevel.Medium}
        selectedValue={SecurityLevel.Medium}
        onChange={() => {}}
      />
    );

    expect(container.firstChild).toHaveClass('selected');
  });
});
