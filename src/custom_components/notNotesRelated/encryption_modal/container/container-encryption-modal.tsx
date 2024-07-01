import React, { FormEvent, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewEncryptionKeyModal from "../screen/screen-encryption-modal";
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
  availableBiometric,
} from "../../../services/fingerprintLogic/fingerprintLogic";
import {
  getPBKDF2_Password,
  encryptAndStore,
  decryptFromStorage,
} from "../../../services/encryptionEngine/encryptionEngine";
import { useTranslation } from "react-i18next";
import WelcomeContainer from "../../welcomeScreen/container/container-welcomeScreen";
import SecurityLevel from "../../../enums/SecurityLevel.enum";
import { featureFlag_newWelcomeScreen } from "../../../config/featureFlags";

interface ContainerEncryptionKeyModalProps {
  onSubmit: (encryptionKey: string) => void;
}

const ContainerEncryptionKeyModal: React.FC<
  ContainerEncryptionKeyModalProps
> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);
  const showFingerprintHint = showFingerprintBtn && localStorage.getItem("fingerprintSet") !== "true";
  const [passwordShortError, setPasswordShortError] = useState<boolean>(false);

  const { t } = useTranslation();

  useEffect(() => {
    const checkBiometrics = async () => {
      if (await availableBiometric()) {
        setShowFingerprintBtn(true);
      }
    };
    checkBiometrics();
  }, []);

  function checkPasswordLength(password: string) {
    if (password.length < 4) {
      if (passwordShortError) {
        //That the user sees the error message is new
        setPasswordShortError(false);
        setTimeout(() => {
          setPasswordShortError(true);
        }, 200);
      } else {
        setPasswordShortError(true);
      }
      return false;
    } else {
      return true;
    }
  }

  const handleKeySubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (checkPasswordLength(inputRef.current!.value)) {
      const password = getPBKDF2_Password(inputRef.current!.value);
      if (localStorage.getItem("justOnePassword") === "true") {
        if (
          (await decryptFromStorage(password, "justOnePassword2")) ===
          "onlyOnePass"
        ) {
          onSubmit(password);
        } else {
          alert(t("encryption-modal_password_wrong"));
        }
      } else {
        onSubmit(password);
      }
    }
  };

  const activateFingerprint = async () => {
    getPasswordFromFingerprint(
      "www.securePlaner.com",
      () => {
        storePasswordFromFingerprint(
          inputRef.current?.value ?? "",
          () => {
            alert(t("encryption-modal_password_stored"));
            const password = getPBKDF2_Password(inputRef.current!.value);
            localStorage.setItem("fingerprintSet", "true");
            onSubmit(password);
          },
          (errorMessage) => {
            alert(errorMessage);
          },
          t
        );
      },
      (password) => {
        onSubmit(password);
      },
      (errorMessage) => {
        alert(errorMessage);
      },
      t
    );
  };

  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState<boolean | null>(
    localStorage.getItem("welcomeScreenDone") !== "true"
  );

  useEffect(() => {
    const noPasswordNeeded =
      localStorage.getItem("securityLevel") === SecurityLevel.Low;
    if (noPasswordNeeded) {
      onSubmit(" ");
    }
  }, [showWelcomeOverlay, onSubmit]);

  function closeWelcomeOverlay(password: string) {
    setShowWelcomeOverlay(false);
    if (
      !(
        localStorage.getItem("securityLevel") === SecurityLevel.Low &&
        password === ""
      )
    ) {
      localStorage.setItem("justOnePassword", "true");
      password = getPBKDF2_Password(password);
      if (localStorage.getItem("justOnePassword") === "true") {
        encryptAndStore("onlyOnePass", password, "justOnePassword2");
      }
    }

    onSubmit(password);
  }

  return (
    <>
      {showWelcomeOverlay && featureFlag_newWelcomeScreen ? (
        <WelcomeContainer closeOverlay={closeWelcomeOverlay} />
      ) : (
        <ViewEncryptionKeyModal
          showFingerprintBtn={showFingerprintBtn}
          showFingerprintHint={showFingerprintHint}
          showPasswordShortError={passwordShortError}
          activateFingerprint={activateFingerprint}
          handleKeySubmit={handleKeySubmit}
          navigateToPrivacy={() => navigate("/settingsHome")}
          inputRef={inputRef}
        />
      )}
    </>
  );
};

export default ContainerEncryptionKeyModal;