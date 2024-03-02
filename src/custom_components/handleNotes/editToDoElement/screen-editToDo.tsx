import React, { useState } from "react";
import PrioritySlider from "../../../modules/ui/editToDo/priorityIndicator/priorityIndicator";
import DatePickerComponent from "../../../modules/ui/editToDo/dataPicker/dataPicker";
import { Card, InputGroup } from "react-bootstrap";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../types/ToDoItem.types";

interface View_EditTodoProps {
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

const View_EditTodo: React.FC<View_EditTodoProps> = ({
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
  console.log(categoriesList);

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
        style={{
          backgroundColor: "#49454F",
          color: "white",
          margin: "2vw",
          marginTop: "25vh",
          position: "absolute",
          minHeight: "30vh",
          width: "90vw",
          zIndex: 99,
        }}
      >
        <Card.Body>
          <Form>
            <Form.Group controlId="noteTitle">
              <Form.Control
                type="text"
                value={title}
                data-testid="noteTitleTest"
                placeholder={t("editNote_TitlePlaceholder")}
                className="white-placeholder"
                onChange={(e) => updateToDoItem("toDoTitle", e.target.value)}
                style={{
                  backgroundColor: "#38373b",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              />
            </Form.Group>
            <hr />
            <div>
              <b>{t("editToDoElement_EndDate")}</b>
              <DatePickerComponent
                selectedDate={endDate}
                onDateChange={updateToDoItem}
              />
            </div>
            <div>
              <b>{t("editToDoElement_Priority")}:</b> {translatedPrio}
              <PrioritySlider
                selectedPriority={selectedPriority}
                onPriorityChange={updateToDoItem}
              />
            </div>
            <Form.Group>
              <b>{t("editToDoElement_Category")}</b>
              <InputGroup>
                <Form.Control
                  type="text"
                  list="category-options"
                  value={categorie}
                  onChange={(e) =>
                    updateToDoItem("toDoCategorie", e.target.value)
                  }
                  style={{
                    backgroundColor: "#38373b",
                    border: "none",
                    color: "white",
                    boxShadow: "none",
                  }}
                />
                <datalist id="category-options">
                  {categoriesList.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </InputGroup>
            </Form.Group>

            <hr />
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                value={desc}
                id="editToDo_Text"
                data-testid="noteTextTest"
                className="white-placeholder"
                placeholder={t("editToDoElement_DetailText")}
                onChange={(e) => updateToDoItem("toDoText", e.target.value)}
                style={{
                  backgroundColor: "#1D1B20",
                  color: "white",
                  border: "0",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  padding: "10px",
                  height: "10vh",
                }}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default View_EditTodo;