import {
  render,
  fireEvent,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";
import SettingsContainer from "./container_settings";
import { MemoryRouter } from "react-router-dom";
import { encryptAndStore } from "../../../services/encryptionEngine/encryptionEngine";
import { NativeBiometric } from "capacitor-native-biometric";
import * as fingerprintLogic from "../../../services/fingerprintLogic/fingerprintLogic";
import { act } from 'react';

vi.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: vi.fn().mockResolvedValue({ isAvailable: true }),
    verifyIdentity: vi.fn().mockResolvedValue(true),
    getCredentials: vi
      .fn()
      .mockResolvedValue({ password: "encryptedPassword" }),
    setCredentials: vi.fn().mockResolvedValue(undefined),
    deleteCredentials: vi.fn(),
  },
}));

vi.mock("@capacitor/filesystem", () => ({
  Filesystem: {
    writeFile: vi.fn(() => Promise.resolve({ uri: "mock-uri" })),
    getUri: vi.fn(),
  },
  Directory: {
    Documents: "Documents",
  },
}));

vi.mock("../../../services/fingerprintLogic/fingerprintLogic", () => ({
  availableBiometric: vi.fn(),
  getPasswordFromFingerprint: vi.fn(),
  storePasswordFromFingerprint: vi.fn(),
}));


const renderWithRouter = (component: React.ReactElement): RenderResult => {
  return render(component, { wrapper: MemoryRouter });
};

beforeEach(() => {
  (fingerprintLogic.availableBiometric as MockInstance).mockResolvedValue(true);
});


describe("Container Settings Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    global.URL.createObjectURL = vi.fn();
    global.URL.revokeObjectURL = vi.fn();
    global.Blob = vi.fn();
  });

  it("renders the settings view and initializes correctly", async () => {
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    expect(screen.getByTestId("settings-delete-all-Notes")).toBeInTheDocument();
  });

  it("handles deleting biometric credentials correctly", async () => {
    vi.spyOn(window, "confirm").mockImplementation(() => true);
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    await waitFor(async () => {
      fireEvent.click(screen.getByTestId("settings-delete-bio-login"));
      expect(NativeBiometric.deleteCredentials).toHaveBeenCalled();
    });
  });

  it("handles deleting all notes correctly", async () => {
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    await encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTescht"}',
      "some-encryption-key",
      "1"
    );
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    fireEvent.click(screen.getByTestId("settings-delete-all-Notes"));
    expect(localStorage.length).toBe(0);
    expect(window.confirm).toHaveBeenCalled();
  });

  it("handles exporting all notes correctly", async () => {
    await encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTescht"}',
      "some-encryption-key",
      "1"
    );
    await act(async () => {
      renderWithRouter(<SettingsContainer />);
    });
    fireEvent.click(screen.getByTestId("settings-export-notes"));

    await waitFor(() => {
      expect(global.Blob).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
