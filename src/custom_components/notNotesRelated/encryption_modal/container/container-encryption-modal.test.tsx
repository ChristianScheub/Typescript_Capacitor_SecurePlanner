import { MockInstance } from 'vitest';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { act } from 'react';
import "@testing-library/jest-dom";
import EncryptionKeyModalContainer from "./container-encryption-modal";
import { BrowserRouter as Router } from "react-router-dom";
import * as fingerprintLogic from "../../../services/fingerprintLogic/fingerprintLogic";
import { getPBKDF2_Password } from '../../../services/encryptionEngine/encryptionEngine';


vi.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: vi.fn().mockResolvedValue({ isAvailable: true }),
    verifyIdentity: vi.fn().mockResolvedValue(true),
    getCredentials: jest
      .fn()
      .mockResolvedValue({ password: "encryptedPassword" }),
    setCredentials: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@capacitor/device", () => ({
  Device: {
    getId: vi.fn().mockResolvedValue({ identifier: "uniqueIdentifier" }),
  },
}));

vi.mock("crypto-js", () => ({
  SHA256: vi.fn().mockReturnValue({ toString: () => "hashedIdentifier" }),
  TripleDES: {
    encrypt: vi.fn().mockReturnValue({ toString: () => "encryptedData" }),
    decrypt: vi.fn().mockReturnValue({ toString: () => "decryptedData" }),
  },
}));

vi.mock("../../../services/fingerprintLogic/fingerprintLogic", () => ({
  availableBiometric: vi.fn(),
  getPasswordFromFingerprint: vi.fn(),
  storePasswordFromFingerprint: vi.fn(),
}));

vi.mock('../../../services/encryptionEngine/encryptionEngine', () => ({
  getPBKDF2_Password: vi.fn().mockImplementation((password: any) => password),
}));


beforeEach(() => {
  (fingerprintLogic.availableBiometric as any).mockResolvedValue(true);
  (getPBKDF2_Password as any).mockImplementation((password: any) => password);
  localStorage.setItem("welcomeScreenDone", "true");
});

describe("<EncryptionKeyModal />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});

    (
      fingerprintLogic.getPasswordFromFingerprint as any
    ).mockImplementation((_: any, onSuccess: any, __: any, ___: any) => {
      onSuccess("mocked password");
    });
    (
      fingerprintLogic.storePasswordFromFingerprint as any
    ).mockImplementation((_: any, onSuccess: any, __: any) => {
      onSuccess();
    });
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
    });
  });

  it("submits the form with the entered encryption key", async () => {
    const onSubmitMock = vi.fn();
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={onSubmitMock} />
        </Router>
      );
    });
    await waitFor(() => {
      const input = screen.getByTestId("password-input");
      fireEvent.change(input, { target: { value: "test123" } });
      fireEvent.click(screen.getByTestId("password-inputBtn"));
      expect(onSubmitMock).toHaveBeenCalledWith("test123");
    });
  });

  it("navigates to privacy policy page on privacy button click", async () => {
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });
    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      const privacyButton1 = privacyButtons[1];
      act(() => {
        fireEvent.click(privacyButton1);
      });

      expect(window.location.pathname).toBe("/settingsHome");
    });
  });

  it("handles fingerprint authentication success", async () => {
    const onSubmitMock = vi.fn();
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={onSubmitMock} />
        </Router>
      );
    });
    const privacyButtons = screen.queryAllByTestId("floating-btn");
    fireEvent.click(privacyButtons[0]);

    await waitFor(() => {
      expect(fingerprintLogic.getPasswordFromFingerprint).toHaveBeenCalled();
    });
  });

  it("handles error in storePasswordFromFingerprint", async () => {
    const errorMessage = "Store error";
    (
      fingerprintLogic.storePasswordFromFingerprint as any
    ).mockImplementation((_: any, __: any, onError: any) => {
      onError(errorMessage);
    });

    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });

    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      fireEvent.click(privacyButtons[0]);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("handles successful password retrieval", async () => {
    const mockPassword = "retrievedPassword";
    (
      fingerprintLogic.getPasswordFromFingerprint as any
    ).mockImplementation((_: any, __: any, onSuccess: any) => {
      onSuccess(mockPassword);
    });

    const onSubmitMock = vi.fn();
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={onSubmitMock} />
        </Router>
      );
    });

    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      fireEvent.click(privacyButtons[0]);
      expect(onSubmitMock).toHaveBeenCalledWith(mockPassword);
    });
  });

  it("handles error in getPasswordFromFingerprint", async () => {
    const errorMessage = "Retrieval error";
    (
      fingerprintLogic.getPasswordFromFingerprint as any
    ).mockImplementation((_: any, __: any, ___: any, onError: any) => {
      onError(errorMessage);
    });

    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });

    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      fireEvent.click(privacyButtons[0]);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });
});
