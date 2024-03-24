import { render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom/client';

jest.mock('capacitor-native-biometric', () => ({
  NativeBiometric: {
    isAvailable: jest.fn(),
  },
}));


describe('App Component Tests', () => {
  beforeEach(() => {
    localStorage.setItem("welcomeScreenDone", "true");
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  test('renders App component', () => {
    render(<App />);
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it('calls ReactDOM.createRoot', () => {
    const mockRender = jest.fn();
    const createRootMock = jest.fn(() => ({ render: mockRender }));
    ReactDOM.createRoot = createRootMock as any;

    document.getElementById = jest.fn().mockReturnValue(document.createElement('div'));
    require('./index');

    expect(createRootMock).toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});