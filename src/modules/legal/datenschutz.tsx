import { Card } from "react-bootstrap";
import { datenschutz_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";
import NavBarContainer from "../../custom_components/notNotesRelated/navBar/container/container-navBar";
import { useLocation } from "react-router-dom";
import React from "react";

const Datenschutz: React.FC = () => {
  const isAlreadyLoggedIn = !useLocation().pathname.includes("Home");

  return (
    <div
      style={{
        ...(isAlreadyLoggedIn
          ? {}
          : {
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#1E1E1E",
              paddingTop: "15vw",
            }),
      }}
    >
      <div
        style={{
          marginTop: "env(safe-area-inset-top)",
        }}
      >
        {!isAlreadyLoggedIn && (
          <NavBarContainer />
        )}
        <div className="after-login-container">
          <Card className="mb-3 backgroundColorHighlight margin2vw">
            <Card.Header as="h2">Infos</Card.Header>
            <Card.Body>
              <CodeToTextParser code={datenschutz_text} />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Datenschutz;
