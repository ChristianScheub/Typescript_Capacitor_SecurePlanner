import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";
import SecurityLevel from "../../enums/SecurityLevel.enum";
import { t } from "i18next";

const deriveKeyPBKDF2 = (
  password: string,
  salt: CryptoJS.lib.WordArray
): CryptoJS.lib.WordArray => {
  const modifiedSaltString = salt.toString(CryptoJS.enc.Hex) + "XHÄU0ßd";
  const modifiedSalt = CryptoJS.enc.Hex.parse(modifiedSaltString);
  const mediumPassword =
    localStorage.getItem("securityLevel") === SecurityLevel.Medium;
  const iterationsToDo = mediumPassword ? 500 : 2000;

  return CryptoJS.PBKDF2(password, modifiedSalt, {
    keySize: 256 / 32,
    iterations: iterationsToDo,
  });
};

export const getPBKDF2_Password = (password: string): string => {
  const saltHex = "b1eßfd1b59öü1a5a1d439e9874ä61b1üaa8a";
  const salt = CryptoJS.enc.Hex.parse(saltHex);
  const mediumPassword =
    localStorage.getItem("securityLevel") === SecurityLevel.Medium;
  const iterationsToDo = mediumPassword ? 20000 : 600001;

  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: iterationsToDo,
    hasher: CryptoJS.algo.SHA256,
  });
  return hash.toString(CryptoJS.enc.Hex);
};

export const encryptAndStore = async (
  text: string,
  password: string,
  storageKey: string
): Promise<void> => {
  console.log(text);
  const noPasswordNeeded =
    localStorage.getItem("securityLevel") === SecurityLevel.Low;
  let encryptedData = "";
  if (noPasswordNeeded) {
    if (password === " " || password === "") {
      const securityLevelLowValue = localStorage.getItem(
        "securityLevelReallyLow"
      );
      //Now we have to check whether the security level is really low or whether someone has manipulated the LocalStorage externally so that the data is stored raw
      //Yes, that doesn't give us 100% security, but at least it gives us something.
      if (securityLevelLowValue === null) {
        alert(t("error_DataStoringCorrupted"));
      } else {
        const expectedValueSecurityLevelPlain = "securePlänner";
        const securityLevelLowValueEncrypted = await decrypt(
          await getDeviceIdHash(),
          securityLevelLowValue
        );
        if (
          securityLevelLowValueEncrypted !== expectedValueSecurityLevelPlain
        ) {
          alert(t("error_DataStoringCorrupted"));
        } else {
          encryptedData = text;
        }
      }
    } else {
      alert(t("error_DataStoringCorrupted"));
    }
  } else {
    encryptedData = await encrypt(text, password);
    console.log("encryptedData", encryptedData);
  }
  localStorage.setItem(storageKey, encryptedData);
};

export const encrypt = async (
  text: string,
  password: string
): Promise<string> => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = deriveKeyPBKDF2(password, salt);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedDataPBKDF2 = `${encrypted.toString()}::${iv.toString()}::${salt.toString()}`;
  const encryptedData = CryptoJS.TripleDES.encrypt(
    encryptedDataPBKDF2,
    await getDeviceIdHash()
  ).toString();

  return encryptedData;
};

export const decryptFromStorage = async (
  password: string,
  storageKey: string
): Promise<string> => {
  const encryptedData = localStorage.getItem(storageKey);

  if (!encryptedData) {
    return "";
  }
  const noPasswordNeeded =
    localStorage.getItem("securityLevel") === SecurityLevel.Low;
  if (noPasswordNeeded) {
    return encryptedData;
  } else {
    return decrypt(password, encryptedData);
  }
};

export const decrypt = async (
  password: string,
  encryptedData: string
): Promise<string> => {
  if (!encryptedData) {
    return "";
  }

  const decryptedDateWithDeviceId = CryptoJS.TripleDES.decrypt(
    encryptedData,
    await getDeviceIdHash()
  ).toString(CryptoJS.enc.Utf8);

  const [encryptedText, iv, salt] = decryptedDateWithDeviceId.split("::");
  const key = deriveKeyPBKDF2(password, CryptoJS.enc.Hex.parse(salt));
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  return decrypted;
};

export const getDeviceIdHash = async (): Promise<string> => {
  const info = await Device.getId();
  return CryptoJS.SHA256(info.identifier + "securePlanerSecure").toString();
};

export const makeReadyForExport = async (
  encryptedData: string
): Promise<string> => {
  const noPasswordNeeded =
    localStorage.getItem("securityLevel") === SecurityLevel.Low;
  if (noPasswordNeeded) {
    return CryptoJS.AES.encrypt(
      encryptedData,
      "securePlanerSecureExport"
    ).toString();
  }

  let decryptedDateWithDeviceId = "";
  try {
    decryptedDateWithDeviceId = CryptoJS.TripleDES.decrypt(
      encryptedData,
      await getDeviceIdHash()
    ).toString(CryptoJS.enc.Utf8);
  } catch (e) {}
  return CryptoJS.AES.encrypt(
    decryptedDateWithDeviceId,
    "securePlanerSecureExport"
  ).toString();
};

export const makeReadyForImport = async (
  encryptedData: string
): Promise<string> => {
  let decrypted = "";
  try {
    decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      "securePlanerSecureExport"
    ).toString(CryptoJS.enc.Utf8);
  } catch (e) {}

  const noPasswordNeeded =
    localStorage.getItem("securityLevel") === SecurityLevel.Low;
  if (noPasswordNeeded) {
    return decrypted;
  }
  return CryptoJS.TripleDES.encrypt(
    decrypted,
    await getDeviceIdHash()
  ).toString();
};
