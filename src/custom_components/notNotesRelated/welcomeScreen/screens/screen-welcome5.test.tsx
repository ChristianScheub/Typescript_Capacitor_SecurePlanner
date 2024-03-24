import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewWelcomeScreen5 from './screen-welcome5';
import { TFunction } from 'i18next';

const tMock: TFunction = ((key: string) => key) as TFunction;

describe('ViewWelcomeScreen5', () => {
  it('renders the component without error message', () => {
    render(
      <ViewWelcomeScreen5
        justOnePassword=""
        setJustOnePassword={() => {}}
        passwordShortError={false}
        handlePasswordChange={() => {}}
        handleSubmit={() => {}}
        t={tMock}
      />
    );

    expect(screen.getByText('welcomeScreen5_Headline')).toBeInTheDocument();
    expect(screen.getByText('welcomeScreen_Complete')).toBeInTheDocument();
  });

  it('displays an error message when password is too short', () => {
    render(
      <ViewWelcomeScreen5
        justOnePassword=""
        setJustOnePassword={() => {}}
        passwordShortError={true}
        handlePasswordChange={() => {}}
        handleSubmit={() => {}}
        t={tMock}
      />
    );

    expect(screen.getByText('encryption-modal_PasswordShort')).toBeInTheDocument();
  });
});
