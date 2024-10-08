import { render, screen, waitFor } from "@testing-library/react";
import { act } from 'react';
import WelcomeScreen3Container from "./container-welcome3";

jest.useFakeTimers();

describe("<WelcomeScreen3Container />", () => {
  it("renders WelcomeScreen3View with initial progress", () => {
    render(
      <WelcomeScreen3Container
        isActivate={false}
        availableScreens={1}
        onNext={jest.fn()}
      />
    );
    expect(screen.getByText("7 Days"));
    expect(screen.getByText("Total"));
    expect(screen.getByText("Today"));
    expect(screen.getAllByText("0%").length).toBe(3);
  });

  test("renders WelcomeScreen3View with initial progress and updates after 4 seconds", async () => {
    jest.useFakeTimers();

    render(
      <WelcomeScreen3Container
        isActivate={true}
        availableScreens={1}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByText("7 Days"));
    expect(screen.getByText("Total"));
    expect(screen.getByText("Today"));
    expect(screen.getAllByText("0%").length).toBe(3);

    act(() => {
      jest.advanceTimersByTime(90);
    });

    await waitFor(() => {
      expect(screen.queryAllByText("0%").length).toBeLessThan(3);
      expect(screen.queryAllByText("3%").length).toBe(3);

    });

    jest.useRealTimers();
  });
});