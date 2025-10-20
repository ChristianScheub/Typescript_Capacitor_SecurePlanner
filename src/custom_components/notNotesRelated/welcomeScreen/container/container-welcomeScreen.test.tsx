import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeContainer from './container-welcomeScreen';

describe('WelcomeContainer', () => {
  const closeOverlayMock = vi.fn();

  const simulateSwipeLeft = (element: HTMLElement) => {
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 0 }],
    });
    fireEvent.touchMove(element, {
      touches: [{ clientX: 50, clientY: 0 }],
    });
    fireEvent.touchEnd(element);
  };

  const simulateSwipeRight = (element: HTMLElement) => {
    fireEvent.touchStart(element, {
      touches: [{ clientX: 50, clientY: 0 }],
    });
    fireEvent.touchMove(element, {
      touches: [{ clientX: 100, clientY: 0 }],
    });
    fireEvent.touchEnd(element);
  };

  beforeEach(() => {
    localStorage.clear();
    render(<WelcomeContainer closeOverlay={closeOverlayMock} />);
  });

  test('initially renders the first screen', () => {
    expect(screen.getByTestId("welcome-container1")).toBeInTheDocument();
    expect(screen.getByTestId("welcome-container1")).toHaveClass("slide-in");
    expect(screen.getByTestId("welcome-container2")).toHaveClass("hide");
  });

  test('navigates to the next screen on swipe left', () => {
    simulateSwipeLeft(screen.getByTestId('welcome-container1'));
    expect(screen.getByTestId("welcome-container1")).toHaveClass("slide-out");
    expect(screen.getByTestId("welcome-container2")).toHaveClass("slide-in");
  });

  test('navigates to the previous screen on swipe right', () => {
    const welcomeContainer = screen.getByTestId('welcome-container1');
    simulateSwipeLeft(welcomeContainer);
    simulateSwipeRight(welcomeContainer);
    expect(screen.getByTestId("welcome-container1")).toHaveClass("slide-in");
    expect(screen.getByTestId("welcome-container2")).toHaveClass("hide");
  });
});