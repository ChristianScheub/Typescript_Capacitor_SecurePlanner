import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WelcomeScreen4Container from "./container-welcome4";
import SecurityLevel from "../../../../enums/SecurityLevel.enum";

describe("<WelcomeScreen4Container />", () => {
  const mockCloseOverlay = vi.fn();
  const mockSetAvailableScreens = vi.fn();
  const mockSetCurrentScreen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.getItem = vi.fn();
  });

  test("sets the number of available screens based on the selected security level", () => {
    render(
      <WelcomeScreen4Container
        closeOverlay={mockCloseOverlay}
        setAvailableScreens={mockSetAvailableScreens}
        setCurrentScreen={mockSetCurrentScreen}
        availableScreens={5}
      />
    );

    fireEvent.click(screen.getByText("Lowest - No Password & No Encryption"));

    expect(mockSetAvailableScreens).toHaveBeenCalledWith(4);
  });

  test("saves the selected security level in localStorage", async () => {
    render(
      <WelcomeScreen4Container
        closeOverlay={mockCloseOverlay}
        setAvailableScreens={mockSetAvailableScreens}
        setCurrentScreen={mockSetCurrentScreen}
        availableScreens={5}
      />
    );

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "securityLevel",
        SecurityLevel.High.toString()
      );
      expect(mockCloseOverlay).not.toHaveBeenCalled();
    });
  });

  test("correctly stores the low security level in localStorage", async () => {
    render(
      <WelcomeScreen4Container
        closeOverlay={mockCloseOverlay}
        setAvailableScreens={mockSetAvailableScreens}
        setCurrentScreen={mockSetCurrentScreen}
        availableScreens={5}
      />
    );
    fireEvent.click(screen.getByText("Lowest - No Password & No Encryption"));
    fireEvent.click(screen.getByText("Complete"));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "securityLevel",
        SecurityLevel.Low.toString()
      );

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "welcomeScreenDone",
        "true"
      );
      expect(mockCloseOverlay).toHaveBeenCalled();
    });
  });
});