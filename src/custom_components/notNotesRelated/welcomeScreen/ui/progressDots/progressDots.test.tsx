import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressDots from './progressDots';

describe('ProgressDots', () => {
    it('renders the correct number of dots', () => {
      const steps = 5;
      const currentStep = 2;
      const { container } = render(<ProgressDots steps={steps} currentStep={currentStep} />);
      
      const dots = container.querySelectorAll('.dot');
      expect(dots.length).toBe(steps);
    });
  
    it('highlights the current step correctly', () => {
      const steps = 5;
      const currentStep = 2;
      const { container } = render(<ProgressDots steps={steps} currentStep={currentStep} />);
  
      const activeDots = container.querySelectorAll('.dot.active');
      expect(activeDots.length).toBe(1); // Ensure exactly one dot is marked as active
      // Verify that the active dot is indeed the current step
      expect(activeDots[0]).toEqual(container.querySelectorAll('.dot')[currentStep]);
    });
  });
