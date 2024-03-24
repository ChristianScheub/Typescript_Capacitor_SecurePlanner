import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
import {
  getPBKDF2_Password
} from "./custom_components/services/encryptionEngine/encryptionEngine";


const mockEncryptionKey = "some-encryption-key";

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

jest.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: jest.fn(),
  },
}));

jest.mock('./custom_components/services/encryptionEngine/encryptionEngine', () => ({
  getPBKDF2_Password: jest.fn().mockImplementation(password => password),
}));

describe("App Component", () => {
  beforeEach(() => {
    localStorage.setItem("welcomeScreenDone", "true");
    jest.mocked(getPBKDF2_Password).mockImplementation(password => password);
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  test("renders without crashing", async () => {
    renderWithRouter(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
    });
  });

  test("renders encryption key modal on start", async () => {
    renderWithRouter(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
    });
  });

  test("modal does not close when submit button is clicked without data insertion", async () => {
    renderWithRouter(<App />);
    const submitButton = screen.getByTestId("password-inputBtn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId("password-inputBtn")).toBeInTheDocument();
    });
  });

  test("closes modal on submit when data are inserted", async () => {
    renderWithRouter(<App />);
    const input = screen.getByTestId("password-input");
    fireEvent.change(input, { target: { value: mockEncryptionKey } });
    const submitButton = screen.getByTestId("password-inputBtn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId("password-inputBtn")).not.toBeInTheDocument();
    });
  });
});