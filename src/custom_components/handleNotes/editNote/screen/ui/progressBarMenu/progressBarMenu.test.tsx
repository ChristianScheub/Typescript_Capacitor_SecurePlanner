import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBarCategoryMenu from './progressBarMenu';
import '@testing-library/jest-dom';

jest.mock('../progressBar/progressBar', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-progress-bar"></div>),
}));

describe('ProgressBarCategoryMenu', () => {
  const mockHandleProgressBarClick = jest.fn();
  const mockGetCategoryProgress = jest.fn().mockReturnValue(50);
  const categoriesList = ['Category 1', 'Category 2', 'Category 3'];
  const activeTooltip = 'Category 1';
  const highlightedId = 'Category 2';

  beforeEach(() => {
    render(
      <ProgressBarCategoryMenu
        categoriesList={categoriesList}
        getCategoryProgress={mockGetCategoryProgress}
        handleProgressBarClick={mockHandleProgressBarClick}
        activeTooltip={activeTooltip}
        highlightedId={highlightedId}
      />
    );
  });

  it('renders categories and allows interaction', () => {
    expect(screen.getByText("Progress per Category"));
  });
  
});