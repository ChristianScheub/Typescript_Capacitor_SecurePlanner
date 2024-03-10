import React from "react";
import { useTranslation } from "react-i18next";
import WelcomeScreen1View from "../../screens/screen-welcome1";

interface Container_WelcomeScreen1Props {
  onNext: () => void;
  availableScreens: number;
}

const Container_WelcomeScreen1: React.FC<Container_WelcomeScreen1Props> = ({
  onNext,
  availableScreens,
}) => {
  const { t } = useTranslation();

  return (
    <WelcomeScreen1View
      onNext={onNext}
      availableScreens={availableScreens}
      t={t} // Übergabe der Übersetzungsfunktion t
    />
  );
};

export default Container_WelcomeScreen1;