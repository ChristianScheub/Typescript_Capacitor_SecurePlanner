import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressCircle from './progressCircle';

describe('ProgressCircle Component', () => {
  it('renders the correct progress color based on progress level', () => {
    const { rerender, container } = render(<ProgressCircle title="Progress" progress={30} />);
    let circle = container.querySelector('circle:nth-of-type(2)');
    expect(circle).toHaveAttribute('stroke', '#e55039');

    rerender(<ProgressCircle title="Progress" progress={45} />);
    circle = container.querySelector('circle:nth-of-type(2)');
    expect(circle).toHaveAttribute('stroke', '#e58e26');

    rerender(<ProgressCircle title="Progress" progress={75} />);
    circle = container.querySelector('circle:nth-of-type(2)');
    expect(circle).toHaveAttribute('stroke', '#27ae60');
  });
});
