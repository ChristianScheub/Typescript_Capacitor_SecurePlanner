import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WelcomeScreen5Container from "./container-welcome5";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("WelcomeScreen5Container", () => {
  const closeOverlayMock = jest.fn();

  beforeEach(() => {
    render(<WelcomeScreen5Container closeOverlay={closeOverlayMock} />);
  });

  it("should display a password short error when the password is too short and attempt to submit", async () => {
    userEvent.type(screen.getByTestId("welcome-screen-password-input"), "123");
    act(() => {
      userEvent.click(screen.getByText("welcomeScreen_Complete"));
    });

    await waitFor(() => {
      expect(
        screen.getByText("encryption-modal_PasswordShort")
      ).toBeInTheDocument();
    });
  });

  it("should call closeOverlay with the correct password when password length is more than 4 characters", () => {
    localStorage.clear();
    userEvent.type(
      screen.getByTestId("welcome-screen-password-input"),
      "12345"
    );

    userEvent.click(screen.getByTestId("welcome-screen-continueBtn"));
    expect(localStorage.getItem("welcomeScreenDone") === "true");
    expect(localStorage.getItem("justOnePassword") === "false");

    waitFor(() => {
      expect(closeOverlayMock).toHaveBeenCalledWith("12345");
    });
  });
});
