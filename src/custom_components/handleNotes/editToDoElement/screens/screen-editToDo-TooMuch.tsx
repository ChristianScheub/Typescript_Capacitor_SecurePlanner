import React from "react";
import { Card } from "react-bootstrap";
import { Priority } from "../../../enums/priority.enum";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../../types/ToDoItem.types";
import "./screen-editToDo.css";

interface ViewEditTodoTooMuchProps {
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

const ViewEditTodo_TooMuch: React.FC<ViewEditTodoTooMuchProps> = ({
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
      className="edit-todo-screen"
    >
      <Card
      className="backgroundColorHighlight edit-todo-card margin2vw"
      >
        <Card.Body>
        <h1>{t("trial_editToDoElement_Title")}</h1>
            <h4>{t("trial_editToDoElement_Text")}</h4>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewEditTodo_TooMuch;