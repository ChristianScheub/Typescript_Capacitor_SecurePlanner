import React, { FormEvent, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import View_EncryptionKeyModal from "./screen-encryption-modal";
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
  availableBiometric,
} from "../../services/fingerprintLogic/fingerprintLogic";
import { getPBKDF2_Password } from "../../services/encryptionEngine/encryptionEngine";
import { useTranslation } from 'react-i18next';

interface Container_EncryptionKeyModalProps {
  onSubmit: (encryptionKey: string) => void;
}

const Container_EncryptionKeyModal: React.FC<
Container_EncryptionKeyModalProps
> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    const checkBiometrics = async () => {
      if (await availableBiometric()) {
        setShowFingerprintBtn(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleKeySubmit = (event: FormEvent) => {
    event.preventDefault();
    const password = getPBKDF2_Password(inputRef.current!.value);
    onSubmit(password);
  };

  const activateFingerprint = async () => {
    getPasswordFromFingerprint(
      "www.securePlaner.com",
      () => {
        storePasswordFromFingerprint(
          inputRef.current?.value || "",
          () => {
            alert("Passwort gespeichert!");
            const password = getPBKDF2_Password(inputRef.current!.value);
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

  return (
    <View_EncryptionKeyModal
      showFingerprintBtn={showFingerprintBtn}
      activateFingerprint={activateFingerprint}
      handleKeySubmit={handleKeySubmit}
      inputRef={inputRef}
      navigateToPrivacy={() => navigate("/settingsHome")}
    />
  );
};

export default Container_EncryptionKeyModal;