import { MockInstance } from 'vitest';
import { NativeBiometric } from "capacitor-native-biometric";
import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
} from "./fingerprintLogic";
import { getPBKDF2_Password } from '../encryptionEngine/encryptionEngine';

vi.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: vi.fn(),
    verifyIdentity: vi.fn(),
    getCredentials: vi.fn(),
    setCredentials: vi.fn(),
  },
}));

vi.mock("crypto-js", () => ({
  default: {
    SHA256: vi.fn(),
    TripleDES: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
    },
    enc: {
      Utf8: {
        stringify: vi.fn(),
      },
    },
  },
  SHA256: vi.fn(),
  TripleDES: {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
  },
  enc: {
    Utf8: {
      stringify: vi.fn(),
    },
  },
}));

vi.mock("@capacitor/device", () => ({
  Device: {
    getId: vi.fn(),
  },
}));

vi.mock('../encryptionEngine/encryptionEngine', () => ({
  getPBKDF2_Password: vi.fn().mockImplementation(password => password),
}));

const t = (key: string): string => {
  switch (key) {
    case 'fingerprint_empty':
      return 'Bitte geben Sie das zu speichernde Passwort erst ein und drücken sie dann diesen Button zum speichern.';
    case 'fingerprint_not_Avaible':
      return 'Biometrische Authentifizierung nicht verfügbar.';
    case 'fingerprint_error':
      return 'Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!';
    default:
      return '';
  }
};

describe("getPasswordFromFingerprint", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    (getPBKDF2_Password as any).mockImplementation((password: string) => password);
  });

  it("successfully retrieves password", async () => {
    (NativeBiometric.isAvailable as any).mockResolvedValue({
      isAvailable: true,
    });
    (NativeBiometric.verifyIdentity as any).mockResolvedValue(true);
    (NativeBiometric.getCredentials as any).mockResolvedValue({
      password: "encryptedPassword",
    });
    (Device.getId as any).mockResolvedValue({
      identifier: "deviceIdentifier",
    });
    (CryptoJS.SHA256 as any).mockReturnValue("hashedIdentifier");
    (CryptoJS.TripleDES.decrypt as any).mockReturnValue({
      toString: vi.fn(() => "decryptedPassword"),
    });

    const onPasswordRetrieved = vi.fn();
    const onError = vi.fn();


    await getPasswordFromFingerprint(
      "www.securePlaner.com",
      vi.fn(),
      onPasswordRetrieved,
      onError,
      t
    );

    expect(onPasswordRetrieved).toHaveBeenCalledWith("decryptedPassword");
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles the case where biometric authentication is not available', async () => {
    (NativeBiometric.isAvailable as any).mockResolvedValue({ isAvailable: false });
    const onError = vi.fn();
    await getPasswordFromFingerprint('www.securePlaner.com', vi.fn(), vi.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

  it('handles biometric authentication failure', async () => {
    (NativeBiometric.isAvailable as any).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.verifyIdentity as any).mockRejectedValue(new Error());
    const onError = vi.fn();
    await getPasswordFromFingerprint('www.securePlaner.com', vi.fn(), vi.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!");
  });

  it('handles empty password scenario', async () => {
    (NativeBiometric.isAvailable as any).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.verifyIdentity as any).mockResolvedValue(true);
    (NativeBiometric.getCredentials as any).mockResolvedValue({ password: '' });
    const onEmptyPassword = vi.fn();
    const onError = vi.fn();
    await getPasswordFromFingerprint('www.securePlaner.com', onEmptyPassword, vi.fn(), onError,t);
    expect(onEmptyPassword).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!");
  });

  it('handles general error during password retrieval', async () => {
    const onEmptyPassword = vi.fn();
    const onError = vi.fn();
  
    (NativeBiometric.getCredentials as any).mockRejectedValue(new Error('General error'));
    await getPasswordFromFingerprint('www.securePlaner.com', onEmptyPassword, vi.fn(), onError,t);
  
    expect(onEmptyPassword).toHaveBeenCalled();
  });
});

describe("storePasswordFromFingerprint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully stores password", async () => {
    (NativeBiometric.isAvailable as any).mockResolvedValue({
      isAvailable: true,
    });
    (Device.getId as any).mockResolvedValue({
      identifier: "deviceIdentifier",
    });
    (CryptoJS.SHA256 as any).mockReturnValue("hashedIdentifier");
    (CryptoJS.TripleDES.encrypt as any).mockReturnValue({
      toString: vi.fn(() => "encryptedPassword"),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();

    await storePasswordFromFingerprint("testPassword", onSuccess, onError,t);

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles case where biometric authentication is not available', async () => {
    (NativeBiometric.isAvailable as any).mockResolvedValue({ isAvailable: false });
    const onError = vi.fn();
    await storePasswordFromFingerprint('testPassword', vi.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

  it('handles case where no password is provided', async () => {
    const onError = vi.fn();
    await storePasswordFromFingerprint('', vi.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Bitte geben Sie das zu speichernde Passwort erst ein und drücken sie dann diesen Button zum speichern.");
  });

  it('handles error during password storing', async () => {
    const onError = vi.fn();
    (NativeBiometric.isAvailable as any).mockResolvedValue({ isAvailable: false });
    await storePasswordFromFingerprint('testPassword', vi.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

});
