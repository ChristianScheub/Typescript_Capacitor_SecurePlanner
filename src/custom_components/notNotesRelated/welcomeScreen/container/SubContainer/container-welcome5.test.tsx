import {
  act,
  fireEvent,
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
  beforeEach(() => {
    render(<WelcomeScreen5Container closeOverlay={jest.fn()} />);
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
});
