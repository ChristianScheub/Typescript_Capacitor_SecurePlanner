import React from "react";
import "../WelcomeScreen.css";
import ProgressDots from "../progressDots/progressDots";
import illustration from "../secureIcon.webp";
import ContinueButton from "../continueBtn/continue-button";

const WelcomeScreen2 = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="welcome-screen">
      <div style={{ top: "20vh",width:"100vw", position: "absolute", textAlign: "center" }}>
        <img
          src={illustration}
          alt="Illustration"
          style={{ height: "30vh" }}
        />
        <br />
        <br />
        <br />
        <b id="infoTitle2" className="infoTextWelcome2">
          State of the art Encryption
        </b>
        <p id="infoText2" className="infoTextWelcome2">
          Thanks to a combination of different cryptographic algorithms, all
          your data are as secure as possible
        </p>
      </div>
      <ContinueButton onClick={onNext} textBtn={"  Continue  "} />
      <ProgressDots steps={4} currentStep={1} />
    </div>
  );
};

export default WelcomeScreen2;