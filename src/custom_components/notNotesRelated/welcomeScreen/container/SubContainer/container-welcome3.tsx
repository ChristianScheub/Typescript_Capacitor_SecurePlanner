import React, { useEffect, useState } from "react";
import WelcomeScreen3View from "../../screens/screen-welcome3";
import { useTranslation } from "react-i18next";

interface WelcomeScreen3ContainerProps {
  onNext: () => void;
  isActivate: boolean;
  availableScreens: number;
}

const WelcomeScreen3Container: React.FC<WelcomeScreen3ContainerProps> = ({
  onNext,
  isActivate,
  availableScreens,
}) => {
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
    } else {
      setProgress1(0);
      setProgress2(0);
      setProgress3(0);
    }
  }, [isActivate]);

  const { t } = useTranslation();


  return (
    <WelcomeScreen3View
      onNext={onNext}
      availableScreens={availableScreens}
      progress1={progress1}
      progress2={progress2}
      progress3={progress3}
      t={t}
    />
  );
};

export default WelcomeScreen3Container;