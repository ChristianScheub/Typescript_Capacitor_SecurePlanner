import React from "react";
import { useTranslation } from "react-i18next";
import WelcomeScreen1View from "../../screens/screen-welcome1";

interface ContainerWelcomeScreen1Props {
  onNext: () => void;
  availableScreens: number;
}

const ContainerWelcomeScreen1: React.FC<ContainerWelcomeScreen1Props> = ({
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

export default ContainerWelcomeScreen1;