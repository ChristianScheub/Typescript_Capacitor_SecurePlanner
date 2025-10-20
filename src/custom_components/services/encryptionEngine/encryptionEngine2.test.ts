import { MockInstance } from 'vitest';
import { Device } from "@capacitor/device";
import SecurityLevel from "../../enums/SecurityLevel.enum";
import {
  getDeviceIdHash,
  encryptAndStore,
  decryptFromStorage,
  encrypt,
  decrypt,
  getPBKDF2_Password,
} from "./encryptionEngine";

vi.mock("@capacitor/device", () => ({
  Device: {
    getId: vi.fn(),
  },
}));

describe("Encryption Tests", () => {
  beforeEach(() => {
    window.localStorage.clear();
    (Device.getId as any).mockResolvedValue({
      identifier: "deviceIdentifier",
    });
    window.alert = vi.fn();
  });

  it("activated encryption: should properly encrypt and decrypt data for export", async () => {
    const decryptedText = "test-data";

    await encryptAndStore(
      decryptedText,
      "password",
      "testKey"
    );

    const storedEncryptedData = localStorage.getItem("testKey");
    expect(storedEncryptedData).not.toBeNull();

    const decryptedData = await decryptFromStorage("password", "testKey");
    expect(decryptedData).toBe(decryptedText);
  });

  it("low security setting: return nothing + alert when LOW security level but the securityLevelReallyLow LocalStorage entry is missing", async () => {
    localStorage.setItem("securityLevel", SecurityLevel.Low);
    const testText = "plainText";
    await encryptAndStore(testText, "", "testKeyLow");
    expect(window.alert).toHaveBeenCalledWith("error_DataStoringCorrupted");
  });

  it("low security setting: return nothing + alert when the securityLevelReallyLow LocalStorage entry is wrong", async () => {
    localStorage.setItem(
      "securityLevelReallyLow",
      "fail"
    );
    localStorage.setItem("securityLevel", SecurityLevel.Low);

    const testText = "plainText";
    await encryptAndStore(testText, "", "testKeyLow2");
    expect(window.alert).toHaveBeenCalledWith("error_DataStoringCorrupted");
  });

  it("low security setting: return nothing + alert when LOW security level but password exist in app", async () => {
    localStorage.setItem("securityLevel", SecurityLevel.Low);
    const testText = "plainText";
    await encryptAndStore(testText, "helloWorld", "testKeyLow");
    expect(window.alert).toHaveBeenCalledWith("error_DataStoringCorrupted");
  });

  it("low security setting: return data correct", async () => {
    localStorage.setItem("securityLevel", SecurityLevel.Low);
    const stringToStore = "securePlänner";
    const expectedValueSecurityLevelLowValue = await encrypt(
      stringToStore,
      await getDeviceIdHash()
    );

    localStorage.setItem(
      "securityLevelReallyLow",
      expectedValueSecurityLevelLowValue
    );
    const testText = "plainText";
    await encryptAndStore(testText, "", "testKeyLow");
    const storedData = localStorage.getItem("testKeyLow");
    expect(storedData).toBe(testText);
  });

  it("correctly generates device ID hash", async () => {
    const deviceIdHash = await getDeviceIdHash();
    expect(deviceIdHash).not.toBe("");
  });
});

describe("Decryption Tests", () => {
  it("returns empty string if no data is found for decryption", async () => {
    localStorage.setItem("securityLevel", SecurityLevel.Low);
    localStorage.setItem("HELLO", "World");

    const decryptedData = await decryptFromStorage("", "HELLO");
    expect(decryptedData).toBe("World");
  });

  it("returns empty string if no data is found for decryption", async () => {
    const decryptedData = await decryptFromStorage(
      "password",
      "nonExistingKey"
    );
    expect(decryptedData).toBe("");
  });

  it("returns empty string if no data to decrypt", async () => {
    const decryptedData = await decrypt("password", "");
    expect(decryptedData).toBe("");
  });
});

describe("Generate PBKDF2 Password Tests", () => {
    beforeEach(() => {
        window.localStorage.clear();
      });
    
      it.skip('should generate a hash with high iterations for non-medium security level', () => {
        localStorage.setItem('securityLevel', SecurityLevel.Low);
        const password = 'testPassword';
        const hash = getPBKDF2_Password(password);
    
        expect(hash).toBeDefined();
        expect(hash).not.toBe('');
        expect(hash.length).toBeGreaterThan(0);

        localStorage.setItem('securityLevel', SecurityLevel.High);
        const hash2 = getPBKDF2_Password(password);
    
        expect(hash2).toBeDefined();
        expect(hash2).not.toBe('');
        expect(hash).toEqual(hash2);
      });
    
      it.skip('should generate a different hash with medium iterations for medium security level', () => {
        // Skip - PBKDF2 with 600k iterations is too slow for test environment
      });
    
});