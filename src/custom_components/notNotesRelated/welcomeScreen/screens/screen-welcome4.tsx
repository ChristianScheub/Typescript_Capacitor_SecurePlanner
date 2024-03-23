import React from "react";
import "./screen-welcome4.css";
import ProgressDots from "./ui/progressDots/progressDots";
import ContinueButton from "./ui/continueBtn/continue-button";
import GenericRadioOption from "./ui/radioBtns/generic-radioBtn";
import SecurityLevel from "../../../enums/SecurityLevel.enum";
import { TFunction } from "i18next";

interface ViewWelcomeScreen4Props {
  t: TFunction;
  securityLevelSelected: SecurityLevel;
  setSecurityLevel: React.Dispatch<React.SetStateAction<SecurityLevel>>;
  handleSubmit: () => Promise<void>;
  featureFlag_HighestSec: boolean;
  availableScreens: number;
}

const ViewWelcomeScreen4: React.FC<ViewWelcomeScreen4Props> = ({
  t,
  securityLevelSelected,
  setSecurityLevel,
  handleSubmit,
  featureFlag_HighestSec,
  availableScreens
}) => {

  return (
    <div className="welcome-screen colorWhite">
      <div
        style={{
          top: "10vh",
          width: "100vw",
          position: "absolute",
          zIndex: 5,
        }}
      >
        <h1 id="infoTitle4">{t("welcomeScreen4_Headline")}</h1>
        <br />
        <div style={{ marginLeft: "10vw", marginTop: "2vh" }}>
          <GenericRadioOption
            label={t("welcomeScreen4_Option1")}
            value={SecurityLevel.Low}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          <GenericRadioOption
            label={t("welcomeScreen4_Option2")}
            value={SecurityLevel.Medium}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          <GenericRadioOption
            label={t("welcomeScreen4_Option3")}
            value={SecurityLevel.High}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          {featureFlag_HighestSec && (
            <GenericRadioOption
              label={t("welcomeScreen4_Option4")}
              value={SecurityLevel.Highest}
              selectedValue={securityLevelSelected}
              onChange={setSecurityLevel}
            />
          )}
        </div>
      </div>
      <div style={{ zIndex: 0 }}>
        <ContinueButton
          onClick={handleSubmit}
          textBtn={
            securityLevelSelected === SecurityLevel.Low
              ? t("welcomeScreen_Complete")
              : t("welcomeScreen_Continue")
          }
        />
      </div>
      <ProgressDots
        steps={availableScreens}
        currentStep={3}
      />
    </div>
  );
};

export default ViewWelcomeScreen4;