import React, { useState } from "react";
import "./screen-welcome4.css";
import ProgressDots from "../progressDots/progressDots";
import ContinueButton from "../continueBtn/continue-button";
import SecurityOption from "../security-radioBtn";
import SecurityLevel from "../../../enums/SecurityLevel.enum";
import {featureFlag_HighestSec} from "../../../featureFlags/featureFlags";
const WelcomeScreen4 = ({ closeOverlay }: { closeOverlay: () => void }) => {
  const [securityLevelSelected, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.High);

  const handleSubmit = () => {
    console.log(`Selected security level: ${securityLevelSelected}`);
    localStorage.setItem("welcomeScreenDone", "true");
    localStorage.setItem("securityLevel", securityLevelSelected);
    closeOverlay();
  };

  return (
    <div className="welcome-screen">
      <div
        style={{
          top: "10vh",
          width: "100vw",
          position: "absolute",
          zIndex:5
        }}
      >
        <h1 id="infoTitle4">But please choose your security rating first</h1>
        <br />
        <div style={{ marginLeft: "10vw", marginTop: "2vh" }}>
          <SecurityOption
            label="Lowest - No Password & No Encryption"
            value={SecurityLevel.Low}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          <SecurityOption
            label="Medium - Password or Biometric (Only a few PBKDF2 Iterations)"
            value={SecurityLevel.Medium}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          <SecurityOption
            label="High - Password or Biometric (Recommended, PBKDF2 600k Iterations)"
            value={SecurityLevel.High}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          {featureFlag_HighestSec && (
          <SecurityOption
            label="Highest - Password and Biometric needed (Import & Export function disappears)"
            value={SecurityLevel.Highest}
            selectedValue={securityLevelSelected}
            onChange={setSecurityLevel}
          />
          )}
        </div>
      </div>
      <div style={{ zIndex: 0 }}>
        <ContinueButton onClick={handleSubmit} textBtn={"  Complete  "} />
      </div>
      <ProgressDots steps={4} currentStep={3} />
    </div>
  );
};

export default WelcomeScreen4;
