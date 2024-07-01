import { NavigateFunction,useLocation } from "react-router-dom";
import { NativeBiometric } from "capacitor-native-biometric";
import SettingsView from "../screen/screen_settings";
import React, { useState, useEffect, ChangeEvent } from "react";
import { availableBiometric } from "../../../services/fingerprintLogic/fingerprintLogic";
import { useTranslation } from "react-i18next";
import { logError } from "../../../services/logger/loggerFeatureFlags";
import { ignoredKeys } from "../../../config/toIgnoreKeys";
import { handleExportAllClick,handleFileChangeTranslation} from "../../../services/fileHandler/fileHandler"
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

  function deleteKeysFromLocalStorage(keysToDelete: string[]): void {
    keysToDelete.forEach((key) => {
      localStorage.removeItem(key);
    });
    alert("Deleted");
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileChangeTranslation(event,t)
  };

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