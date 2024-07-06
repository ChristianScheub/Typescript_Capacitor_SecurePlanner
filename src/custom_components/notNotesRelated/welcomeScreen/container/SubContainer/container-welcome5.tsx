import { useState } from "react";
import WelcomeScreen5View from "../../screens/screen-welcome5";
import { useTranslation } from "react-i18next";

const WelcomeScreen5Container = ({
  closeOverlay,
}: {
  closeOverlay: (password: string) => void;
}) => {
  const { t } = useTranslation();
  const [justOnePassword, setJustOnePassword] = useState("Multiple");
  const [password, setPassword] = useState("");
  const [passwordShortError, setPasswordShortError] = useState(false);

  const handleSubmit = () => {
    if (password.length < 4) {
      //That the user sees the error message is new
      setPasswordShortError(!passwordShortError);
      setTimeout(() => setPasswordShortError(true), 200);
    } else {
      localStorage.setItem("welcomeScreenDone", "true");
      localStorage.setItem(
        "justOnePassword",
        justOnePassword === "One" ? "true" : "false"
      );
      closeOverlay(password);
    }
  };

  return (
    <WelcomeScreen5View
      justOnePassword={justOnePassword}
      setJustOnePassword={setJustOnePassword}
      passwordShortError={passwordShortError}
      handlePasswordChange={setPassword}
      handleSubmit={handleSubmit}
      t={t}
    />
  );
};

export default WelcomeScreen5Container;