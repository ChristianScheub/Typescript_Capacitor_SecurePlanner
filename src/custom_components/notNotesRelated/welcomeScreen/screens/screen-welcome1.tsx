import "../WelcomeScreen.css";
import ProgressDots from "../ui/progressDots/progressDots";
import illustration from "../welcomeIllustration.webp";
import ContinueButton from "../ui/continueBtn/continue-button";
import { TFunction } from "i18next";
import { featureFlag_IsTrialVersion } from "../../../featureFlags/featureFlags";

const View_WelcomeScreen1 = ({
  onNext,
  availableScreens,
  t,
}: {
  onNext: () => void;
  availableScreens: number;
  t: TFunction;
}) => {
  return (
    <div className="welcome-screen">
      {featureFlag_IsTrialVersion ? (
        <p id="infoText1_Trial">{t("trial_welcomeScreen1_Headline")}</p>
      ) : (
        <p id="infoText1">{t("welcomeScreen1_Headline")}</p>
      )}
      <img src={illustration} alt="Illustration" className="illustration" />
      <ContinueButton onClick={onNext} textBtn={t("welcomeScreen1_Btn")} />
      <ProgressDots steps={availableScreens} currentStep={0} />
    </div>
  );
};

export default View_WelcomeScreen1;
