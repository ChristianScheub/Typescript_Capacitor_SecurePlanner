import { NavigateFunction,useLocation } from "react-router-dom";
import { NativeBiometric } from "capacitor-native-biometric";
import SettingsView from "../screen/screen_settings";
import React, { useState, useEffect } from "react";
import { availableBiometric } from "../../../services/fingerprintLogic/fingerprintLogic";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import {
  makeReadyForExport,
  makeReadyForImport,
} from "../../../services/encryptionEngine/encryptionEngine";
import { useTranslation } from "react-i18next";
import { logError } from "../../../services/logger/loggerFeatureFlags";

const ContainerSettings: React.FC = () => {
  const { t } = useTranslation();

  const handleImpressumClick = (navigate: NavigateFunction) => {
    if (isAlreadyLoggedIn) {
      navigate("/impressum");
    } else {
      navigate("/impressumHome");
    }
  };
  const handleDatenschutzClick = (navigate: NavigateFunction) => {
    if (isAlreadyLoggedIn) {
      navigate("/datenschutz");
    } else {
      navigate("/datenschutzHome");
    }
  };

  const location = useLocation();
  const isAlreadyLoggedIn = !location.pathname.includes("settingsHome");

  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);
  useEffect(() => {
    const checkBiometrics = async () => {
      if (await availableBiometric()) {
        setShowFingerprintBtn(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleDeleteAllClick = async (
    showFingerprintBtn: boolean,
    navigate: NavigateFunction
  ): Promise<void> => {
    if (window.confirm(t("settings_Dialog_DeleteAll"))) {
      localStorage.clear();
      if (showFingerprintBtn) {
        try {
          await NativeBiometric.deleteCredentials({
            server: "www.securePlaner.com",
          });
        } catch (error) {
          logError("Error at delete Credentials", error);
        }
      }
      navigate("/");
      window.location.reload();
      alert(t("settings_Dialog_DeleteAllSuccessful"));
    }
  };

  const handleDeleteNotesClick = async (): Promise<void> => {
    if (window.confirm(t("settings_Dialog_DeleteNotes"))) {
      localStorage.clear();
      alert(t("settings_Dialog_DeleteNotesSuccessful"));
    }
  };

  const handleDeleteBiometryClick = async () => {
    if (window.confirm(t("settings_Dialog_DeleteBio"))) {
      try {
        await NativeBiometric.deleteCredentials({
          server: "www.securePlaner.com",
        });
        alert(t("settings_Dialog_DeleteBioSuccessful"));
      } catch (error) {
        logError("Error at delete Credentials", error);
        alert(t("settings_Dialog_DeleteBioError"));
      }
    }
  };

  const generateFileName = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `notes-${year}${month}${day}-${hours}${minutes}${seconds}.txt`;
  };

  const handleExportAllClick = async () => {
    let notes = "";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        const item = localStorage.getItem(key);
        if (item !== null) {
          const value = await makeReadyForExport(item);
          notes += ` ${key}*_*_* ${value}*_*_*`;
        }
      }
    }

    try {
      const fileName = generateFileName();
      const base64Data = btoa(notes);

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      try {
        const uriResult = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName,
        });

        await Share.share({
          url: uriResult.uri,
        });
      } catch (shareError) {
        downloadFile(notes, fileName);
      }
    } catch (e) {
      console.error("Error during export or sharing", e);
    }
  };

  const downloadFile = (base64Data: string, fileName: string) => {
    const blob = new Blob([base64Data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!window.confirm(t("settings_Dialog_Import")) || !file) return;
  
    try {
      const fileContent = await readFileContent(file);
      if (fileContent) {
        await processFileContent(fileContent);
        alert(t("settings_Dialog_ImportSuccessful"));
      }
    } catch (error) {
      console.error("Error processing file:", error);
      // Handle the error appropriately
    }
  };
  
  const processFileContent = async (content: string) => {
    const lines = content.trim().split("*_*_*");
    for (let i = 0; i < lines.length; i += 2) {
      const key = lines[i].slice(1);
      let value = lines[i + 1] ?? "";
      value = value.substring(1);
      value = await makeReadyForImport(value);
      if (key) {
        localStorage.setItem(key, value);
      }
    }
  };  

  const readFileContent = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result;
        resolve(text as string);
      };

      reader.onerror = (event) => {
        reject(event.target?.error);
      };

      reader.readAsText(file);
    });
  };

  function deleteKeysFromLocalStorage(keysToDelete: string[]): void {
    keysToDelete.forEach((key) => {
      localStorage.removeItem(key);
    });
    alert("Deleted");
  }

  const ignoredKeys: string[] = [
    "securityLevelReallyLow",
    "securityLevel",
    "justOnePassword2",
    "justOnePassword",
  ];

  return (
    <SettingsView
      showFingerprintBtn={showFingerprintBtn}
      onDeleteAllClick={handleDeleteAllClick}
      onDeleteBiometryClick={handleDeleteBiometryClick}
      onDatenschutzClick={handleDatenschutzClick}
      onImpressumClick={handleImpressumClick}
      onExportAllClick={handleExportAllClick}
      onFileChange={handleFileChange}
      onDeleteNotesClick={handleDeleteNotesClick}
      onDeleteTechnicalDataClick={() => deleteKeysFromLocalStorage(ignoredKeys)}
      isAlreadyLoggedIn={isAlreadyLoggedIn}
    />
  );
};

export default ContainerSettings;
