import { render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom/client';

vi.mock('capacitor-native-biometric', () => ({
  NativeBiometric: {
    isAvailable: vi.fn(),
  },
}));


describe('App Component Tests', () => {
  beforeEach(() => {
    localStorage.setItem("welcomeScreenDone", "true");
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  test('renders App component', () => {
    render(<App />);
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it('calls ReactDOM.createRoot', () => {
    const mockRender = vi.fn();
    const createRootMock = vi.fn(() => ({ render: mockRender }));
    ReactDOM.createRoot = createRootMock as any;

    document.getElementById = vi.fn().mockReturnValue(document.createElement('div'));
    require('./index');

    expect(createRootMock).toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalled();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});