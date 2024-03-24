import React from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./screen-editToDo.css";

const ViewEditTodo_TooMuch: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="edit-todo-screen">
      <Card className="backgroundColorHighlight edit-todo-card margin2vw">
        <Card.Body>
          <h1>{t("trial_editToDoElement_Title")}</h1>
          <h4>{t("trial_editToDoElement_Text")}</h4>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewEditTodo_TooMuch;