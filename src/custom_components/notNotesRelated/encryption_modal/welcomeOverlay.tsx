import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

interface WelcomeOverlayProps {
  closeOverlay: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ closeOverlay }) => {
  const [firstScreenDone, setFirstScreenDone] = useState<Boolean>(true);

  const closeWelcomeOverlay = () => {
    localStorage.setItem("welcomeScreenDone", "true");
    closeOverlay();
  };

  return (
    <div style={overlayStyle}>
      {firstScreenDone ? (
        <div style={congratulationAnimationStyle}>
          <h1>Wilkommen bei Secure Planner!</h1>
          <p>
            Diese App legt einen besonderen Fokus auf die sichere Verwahrung der
            ToDo Listen.
          </p>
          <p>
            Dementsprechend müssen sie gleich ein Passwort eingeben mit welchem
            die ToDo Listen verschlüsselt werden. Merken sie sich das gut, da
            wir diese nicht mehr wiederherstellen können.
          </p>
          <p>
            Diese App verwendet eine AES256 Verschlüsselung kombiniert mit einer
            TripleDES Verschlüsselung, ist Open Source und ist komplett
            offline.
            <b> Folglich können sie hier sicher ihre ToDo Listen erstellen.</b>
          </p>
          <p>
            Weitere Informationen zu unseren Sicherheitsmaßnahmen finden sie in
            unserem GitHub Repo.
          </p>
          <button
            style={closeButtonStyle}
            onClick={() => setFirstScreenDone(false)}
          >
            <FaArrowRight />
          </button>
        </div>
      ) : (
        <div style={congratulationAnimationStyle}>
          <h1>Weitere Funktionen</h1>
          <li>
            Mithilfe unseres Biometrischen Logins können sie schnell all ihre
            ToDos aufrufen.
          </li>
          <br />
          <li>
            Für jedes ihrer ToDos können sie eine Priorität sowie eine Deadline
            einstellen. Darauf basierend werden ihre ToDos auch in den einzelnen
            Listen sortiert.
          </li>
          <br />
          <li>
            Mithilfe unser Export und Import Funktion können sie ihre ToDo
            Listen exportieren, teilen und wieder importieren. Diese bleiben
            verschlüsselt mit ihrem gesetzten Passwort.
          </li>
          <br />
          <li>
            Die Suchfunktion erlaubt es Ihnen, Ihre ToDo-Listen und deren
            Elemente schnell zu durchsuchen.
          </li>
          <br />
          <li>
            Sie können mit verschiedenen Passwörter verschiedene ToDo Listen Gruppen abspeichern. Aber Achtung, bei einem Export werden alle exportiert! 
          </li>
          <br />
          <button style={closeButtonStyle} onClick={closeWelcomeOverlay}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomeOverlay;

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  zIndex: 1000,
};

const congratulationAnimationStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  animation: "congratulationFade 2s forwards",
};

const closeButtonStyle: React.CSSProperties = {
  marginTop: "20px",
  marginBottom: "15vh",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  border: "none",
  color: "white",
  fontSize: "24px",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  cursor: "pointer",
  outline: "none",
  transition: "background-color 0.3s",
};
