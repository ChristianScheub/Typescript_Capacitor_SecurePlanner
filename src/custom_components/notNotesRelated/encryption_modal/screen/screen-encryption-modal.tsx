import React, { FormEvent, RefObject } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingBtn, {
  ButtonAlignment,
} from "../../../../modules/ui/floatingBtn/floatingBtn";
import { FaInfoCircle } from "react-icons/fa";
import { PiFingerprintThin } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { FaArrowDownLong } from "react-icons/fa6";
import Alert from "react-bootstrap/Alert";
import "./screen-encryption-modal.css";

interface ViewEncryptionKeyModalProps {
  showFingerprintBtn: boolean;
  showFingerprintHint: boolean;
  showPasswordShortError: boolean;
  activateFingerprint: () => void;
  handleKeySubmit: (event: FormEvent) => void;
  navigateToPrivacy: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

const ViewEncryptionKeyModal: React.FC<ViewEncryptionKeyModalProps> = ({
  handleKeySubmit,
  activateFingerprint,
  showFingerprintBtn,
  showFingerprintHint,
  showPasswordShortError,
  navigateToPrivacy,
  inputRef,
}) => {
  const { t } = useTranslation();

  return (
    <div className="backgroundColor encryption-modal-container">
      <div className="backgroundColorHighlight modal-content width100">
        <h2>{t("encryption-modal_title")}</h2>
        <p>{t("encryption-modal_message")}</p>
        {showFingerprintBtn && <i>{t("encryption-modal_FastLoginmessage")}</i>}
        <br />
        <Form onSubmit={handleKeySubmit}>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              type="password"
              placeholder={t("encryption-modal_placeholder")}
              data-testid="password-input"
              className="white-placeholder colorWhite password-input"
              required
            />
          </Form.Group>
          <br />
          <Button
            onClick={handleKeySubmit}
            data-testid="password-inputBtn"
            className="colorWhite password-submit-btn width100"
          >
            {t("encryption-modal_btn")}
          </Button>
          <br /> <br />
          {showPasswordShortError && (
            <Alert variant="danger">
              {t("encryption-modal_PasswordShort")}
            </Alert>
          )}
        </Form>

        {showFingerprintBtn && (
          <FloatingBtn
            alignment={ButtonAlignment.LEFT}
            icon={PiFingerprintThin}
            onClick={() => activateFingerprint()}
          />
        )}
        <FloatingBtn
          alignment={ButtonAlignment.RIGHT}
          icon={FaInfoCircle}
          onClick={navigateToPrivacy}
        />
      </div>
      {showFingerprintHint && (
        <div className="fingerprint-hint-container width100">
          <p className="fingerprint-hint-text">{t("encryption-modal_hint")}</p>
          <FaArrowDownLong className="fingerprint-hint-icon" />
        </div>
      )}
    </div>
  );
};

export default ViewEncryptionKeyModal;