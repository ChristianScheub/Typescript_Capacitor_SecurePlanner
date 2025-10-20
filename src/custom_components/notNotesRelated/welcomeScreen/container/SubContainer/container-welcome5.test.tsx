import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { act } from 'react';
import userEvent from "@testing-library/user-event";
import WelcomeScreen5Container from "./container-welcome5";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("WelcomeScreen5Container", () => {
  const closeOverlayMock = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    render(<WelcomeScreen5Container closeOverlay={closeOverlayMock} />);
  });

  it("should display a password short error when the password is too short and attempt to submit", async () => {
    const passwordInput = screen.getByTestId("welcome-screen-password-input");
    const submitButton = screen.getByText("welcomeScreen_Complete");
    
    await user.type(passwordInput, "123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("encryption-modal_PasswordShort")
      ).toBeInTheDocument();
    });
  });

  it("should call closeOverlay with the correct password when password length is more than 4 characters", async () => {
    localStorage.clear();
    
    const passwordInput = screen.getByTestId("welcome-screen-password-input");
    
    await user.type(passwordInput, "12345");
    
    // Find the actual button element inside the testid container
    const continueButtonContainer = screen.getByTestId("welcome-screen-continueBtn");
    const continueButton = continueButtonContainer.querySelector("button");
    expect(continueButton).toBeTruthy();
    
    await act(async () => {
      await user.click(continueButton!);
    });
    
    // Wait for localStorage to be set first
    await waitFor(() => {
      expect(localStorage.getItem("welcomeScreenDone")).toBe("true");
    }, { timeout: 3000 });
    
    expect(localStorage.getItem("justOnePassword")).toBe("false");
    expect(closeOverlayMock).toHaveBeenCalledWith("12345");
  });
});
