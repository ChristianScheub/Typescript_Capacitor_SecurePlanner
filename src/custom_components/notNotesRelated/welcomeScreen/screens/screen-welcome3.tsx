import React, { useEffect, useState } from "react";
import "../WelcomeScreen.css";
import ProgressDots from "../progressDots/progressDots";
import illustration from "../secureIcon.webp";
import ContinueButton from "../continueBtn/continue-button";
import ProgressCircle from "../../../../modules/ui/progress/progressCircle/progressCircle";
import { useTranslation } from "react-i18next";

const WelcomeScreen3 = ({
  onNext,
  isActivate,
}: {
  onNext: () => void;
  isActivate: Boolean;
}) => {
  const { t } = useTranslation();
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);

  const updateProgress = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    max: number
  ) => {
    setter((prev) => (prev < max ? prev + 1 : prev));
  };

  useEffect(() => {
    if (isActivate) {
      const interval = setInterval(() => {
        updateProgress(setProgress1, 100);
        updateProgress(setProgress2, 50);
        updateProgress(setProgress3, 30);
      }, 30);
      return () => clearInterval(interval);
    }
    else{
      setProgress1(0);
      setProgress2(0);
      setProgress3(0);
    }
  }, [isActivate]);

  return (
    <div className="welcome-screen">
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
        </table>
        <br />
        <br />
        <br />
        <b id="infoTitle2" className="infoTextWelcome2">
          Prioritize and track
        </b>
        <p id="infoText2" className="infoTextWelcome2">
          Discover the possibilities of prioritization and deadlines and the
          categorization of individual to-do items!
        </p>
      </div>
      <ContinueButton onClick={onNext} textBtn={"  Continue  "} />
      <ProgressDots steps={4} currentStep={2} />
    </div>
  );
};

export default WelcomeScreen3;
