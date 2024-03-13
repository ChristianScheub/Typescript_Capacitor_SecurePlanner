import React, { useState } from "react";
import { Card, InputGroup } from "react-bootstrap";
import { Priority } from "../../../enums/priority.enum";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../../types/ToDoItem.types";

interface View_EditTodo_TooMuchProps {
  title: string;
  desc: string;
  endDate: Date;
  selectedPriority: Priority;
  translatedPrio: string;
  categorie: string;
  categoriesList: string[];
  updateToDoItem: <K extends keyof ToDoItem>(
    key: K,
    value: ToDoItem[K]
  ) => void;
}

const View_EditTodo_TooMuch: React.FC<View_EditTodo_TooMuchProps> = ({
  title,
  desc,
  endDate,
  selectedPriority,
  translatedPrio,
  categorie,
  categoriesList,
  updateToDoItem
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="edit-todo"
      style={{
        position: "fixed",
        top: "40vh",
        left: 0,
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 90,
      }}
    >
      <Card
      className="backgroundColorHighlight"
        style={{
          margin: "2vw",
          marginTop: "25vh",
          position: "absolute",
          minHeight: "15vh",
          width: "90vw",
          zIndex: 99,
        }}
      >
        <Card.Body>
        <h1>{t("trial_editToDoElement_Title")}</h1>
            <h4>{t("trial_editToDoElement_Text")}</h4>
        </Card.Body>
      </Card>
    </div>
  );
};

export default View_EditTodo_TooMuch;