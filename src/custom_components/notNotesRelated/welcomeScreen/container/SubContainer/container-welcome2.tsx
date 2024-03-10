import React from "react";
import WelcomeScreen2View from "../../screens/screen-welcome2";
import { useTranslation } from "react-i18next";

interface Container_WelcomeScreen2Props {
  onNext: () => void;
  availableScreens: number;
}

const Container_WelcomeScreen2: React.FC<Container_WelcomeScreen2Props> = ({
  onNext,
  availableScreens,
}) => {
  const { t } = useTranslation();

  return (
    <WelcomeScreen2View onNext={onNext} availableScreens={availableScreens} t={t} />
  );
};

export default Container_WelcomeScreen2;