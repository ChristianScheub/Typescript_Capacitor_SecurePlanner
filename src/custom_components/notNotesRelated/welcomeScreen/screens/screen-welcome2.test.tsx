import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewWelcomeScreen2 from './screen-welcome2';
import { TFunction } from 'i18next';

const tMock: TFunction = ((key: string) => key) as TFunction;

vi.mock('../../../config/featureFlags', () => ({
  featureFlag_IsTrialVersion: true,
}));

describe('ViewWelcomeScreen2', () => {
  it('should render the component', () => {
    render(<ViewWelcomeScreen2 onNext={() => {}} availableScreens={3} t={tMock} />);
    expect(screen.getByText('welcomeScreen2_Headline')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen2_Text')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen_Continue')).toBeInTheDocument();
  });
});