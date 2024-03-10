import React from "react";
import "./screen-welcome4.css";
import ProgressDots from "../ui/progressDots/progressDots";
import ContinueButton from "../ui/continueBtn/continue-button";
import StringRadioBtn from "../ui/radioBtns/string-radioBtn";
import PasswordInput from "../ui/passwordInputField/passwordInputField";
import Alert from "react-bootstrap/Alert";
import { TFunction } from "i18next";

interface View_WelcomeScreen5Props {
  justOnePassword: string;
  setJustOnePassword: React.Dispatch<React.SetStateAction<string>>;
  passwordShortError: boolean;
  handlePasswordChange: (password: string) => void;
  handleSubmit: () => void;
  t: TFunction;
}

const View_WelcomeScreen5: React.FC<View_WelcomeScreen5Props> = ({
  justOnePassword,
  setJustOnePassword,
  passwordShortError,
  handlePasswordChange,
  handleSubmit,
  t,
}) => {

  return (
    <div className="welcome-screen">
      <div
        style={{
          top: "10vh",
          width: "100vw",
          position: "absolute",
          zIndex: 5,
        }}
      >
        <h1 id="infoTitle4">{t("welcomeScreen5_Headline")}</h1>
        <br />
        <div style={{ marginLeft: "10vw", marginTop: "2vh" }}>
          <StringRadioBtn
            label={t("welcomeScreen5_Option1")}
            value={"One"}
            selectedValue={justOnePassword}
            onChange={setJustOnePassword}
          />
          <StringRadioBtn
            label={t("welcomeScreen5_Option2")}
            value={"Multiple"}
            selectedValue={justOnePassword}
            onChange={setJustOnePassword}
          />
        </div>
        <h1 id="infoTitle4"> {t("welcomeScreen5_Headline2")}</h1>
        <div style={{ marginLeft: "5vw", marginTop: "2vh", width: "90vw" }}>
        <PasswordInput onChange={(e) => handlePasswordChange(e.target.value)} />
          {passwordShortError && (
            <Alert variant="danger">
              {t("encryption-modal_PasswordShort")}
            </Alert>
          )}
        </div>
      </div>
      <div style={{ zIndex: 0 }}>
        <ContinueButton onClick={handleSubmit} textBtn={t("welcomeScreen_Complete")} />
      </div>
      <ProgressDots steps={4} currentStep={3} />
    </div>
  );
};

export default View_WelcomeScreen5;