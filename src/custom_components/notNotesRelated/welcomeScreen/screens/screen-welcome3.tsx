import React from "react";
import "../WelcomeScreen.css";
import ProgressDots from "./ui/progressDots/progressDots";
import ContinueButton from "./ui/continueBtn/continue-button";
import ProgressCircle from "../../../../modules/ui/progress/progressCircle/progressCircle";
import { TFunction } from "i18next";

interface ViewWelcomeScreen3Props {
  onNext: () => void;
  availableScreens: number;
  progress1: number;
  progress2: number;
  progress3: number;
  t: TFunction;
}

const ViewWelcomeScreen3: React.FC<ViewWelcomeScreen3Props> = ({
  onNext,
  availableScreens,
  progress1,
  progress2,
  progress3,
  t,
}) => {
  return (
    <div className="welcome-screen colorWhite">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "80vh",
          width: "100vw",
        }}
      >
        <table style={{ backgroundColor: "rgb(30, 30, 30)" }}>
          <tbody>
            <tr>
              <td style={{ paddingLeft: "2vw", paddingRight: "2vw" }}>
                <ProgressCircle
                  title={t("viewNote_progressCircle_7Days")}
                  progress={progress1}
                />
              </td>
              <td>
                <ProgressCircle
                  title={t("viewNote_progressCircle_Today")}
                  progress={progress2}
                />
              </td>
              <td style={{ paddingLeft: "2vw" }}>
                <ProgressCircle
                  title={t("viewNote_progressCircle_Total")}
                  progress={progress3}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <br />
        <b id="infoTitle2" className="infoTextWelcome2 makeItCenter">
          {t("welcomeScreen3_Headline")}
        </b>
        <p id="infoText2" className="infoTextWelcome2 makeItCenter">
          {t("welcomeScreen3_Text")}
        </p>
      </div>
      <ContinueButton onClick={onNext} textBtn={t("welcomeScreen_Continue")} />
      <ProgressDots steps={availableScreens} currentStep={2} />
    </div>
  );
};

export default ViewWelcomeScreen3;
