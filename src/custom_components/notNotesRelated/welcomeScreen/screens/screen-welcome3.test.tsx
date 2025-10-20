import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewWelcomeScreen3 from './screen-welcome3';
import { TFunction } from 'i18next';

const tMock: TFunction = ((key: string) => key) as TFunction;

vi.mock('../../../config/featureFlags', () => ({
  featureFlag_IsTrialVersion: true,
}));

describe('ViewWelcomeScreen3', () => {
  it('should render the component', () => {
    render(<ViewWelcomeScreen3 onNext={() => { } } availableScreens={3} t={tMock} progress1={0} progress2={0} progress3={0} />);
    expect(screen.getByText('viewNote_progressCircle_7Days')).toBeInTheDocument();
    expect(screen.getByText('viewNote_progressCircle_Today')).toBeInTheDocument();
    expect(screen.getByText('viewNote_progressCircle_Total')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen3_Headline')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen3_Text')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen_Continue')).toBeInTheDocument();
  });
});