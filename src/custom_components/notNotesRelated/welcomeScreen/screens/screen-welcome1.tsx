import React from "react";
import "../WelcomeScreen.css";
import ProgressDots from "../progressDots/progressDots";
import illustration from "../welcomeIllustration.webp"; // Pfad zum Bild anpassen
import ContinueButton from "../continueBtn/continue-button";

const WelcomeScreen = ({ onNext }: { onNext: () => void }) => {
  
  return (
    <div className="welcome-screen">
      <p id="infoText1">Great that you have chosen us!</p>
      <img src={illustration} alt="Illustration" className="illustration" />
      <ContinueButton onClick={onNext} textBtn={"Lets get started"} />
      <ProgressDots steps={4} currentStep={0} />
    </div>
  );
};

export default WelcomeScreen;