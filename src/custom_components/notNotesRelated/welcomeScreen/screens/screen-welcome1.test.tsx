import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewWelcomeScreen1 from './screen-welcome1';
import { TFunction } from 'i18next';

const tMock: TFunction = ((key: string) => key) as TFunction;

jest.mock('../../../featureFlags/featureFlags', () => ({
  featureFlag_IsTrialVersion: true,
}));

describe('ViewWelcomeScreen1', () => {
  it('should render the component', () => {
    render(<ViewWelcomeScreen1 onNext={() => {}} availableScreens={3} t={tMock} />);
    expect(screen.getByText('trial_welcomeScreen1_Headline')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen1_Btn')).toBeInTheDocument();
  });
});