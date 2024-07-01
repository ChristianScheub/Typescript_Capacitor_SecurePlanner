import React, { useEffect, useState } from "react";
import WelcomeScreen4View from "../../screens/screen-welcome4";
import SecurityLevel from "../../../../enums/SecurityLevel.enum";
import { encrypt, getDeviceIdHash } from "../../../../services/encryptionEngine/encryptionEngine";
import { featureFlag_HighestSec } from "../../../../config/featureFlags";
import { useTranslation } from "react-i18next";
import { logAllDebugMessages } from "../../../../services/logger/loggerFeatureFlags";

interface WelcomeScreen4ContainerProps {
  closeOverlay: (password: string) => void;
  setAvailableScreens: (numScreens: number) => void;
  setCurrentScreen: (num: number) => void;
  availableScreens: number;
}

const WelcomeScreen4Container: React.FC<WelcomeScreen4ContainerProps> = ({
  closeOverlay,
  setAvailableScreens,
  setCurrentScreen,
  availableScreens,
}) => {
  const { t } = useTranslation();
  const [securityLevelSelected, setSecurityLevelSelected] = useState<SecurityLevel>(SecurityLevel.High);

  useEffect(() => {
    const screenCount = securityLevelSelected === SecurityLevel.Low ? 4 : 5;
    setAvailableScreens(screenCount);
    logAllDebugMessages("selectedSecurity:"+securityLevelSelected);
    logAllDebugMessages("screenCount:" + screenCount);
  }, [securityLevelSelected, setAvailableScreens]);

  const handleSubmit = async () => {
    localStorage.setItem("securityLevel", securityLevelSelected);
    logAllDebugMessages("submit security");
    logAllDebugMessages("selectedSecurity:"+securityLevelSelected);
    if (securityLevelSelected === SecurityLevel.Low) {
      localStorage.setItem("welcomeScreenDone", "true");
      //securityLevelReallyLow will be used later to authenticate that we really have the low level
      const stringToStore = "securePlänner";
      const expectedValueSecurityLevelLowValue = await encrypt(
        stringToStore,
        await getDeviceIdHash()
      );

      localStorage.setItem(
        "securityLevelReallyLow",
        expectedValueSecurityLevelLowValue
      );
      closeOverlay("");
    } else {
      setCurrentScreen(4);
    }
  };

  return (
    <WelcomeScreen4View
      t={t}
      securityLevelSelected={securityLevelSelected}
      setSecurityLevel={setSecurityLevelSelected}
      handleSubmit={handleSubmit}
      featureFlag_HighestSec={featureFlag_HighestSec}
      availableScreens={availableScreens}
    />
  );
};

export default WelcomeScreen4Container;