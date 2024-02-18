import React, { useState, useEffect } from "react";
import PrioritySlider from "./priorityIndicator/screen-PriorityIndicator";
import DatePickerComponent from "./dataPicker/screen-dataPicker";
import { Card } from "react-bootstrap";
import { Priority } from "./priorityIndicator/priority.enum";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FloatingBtn, { ButtonAlignment } from "../../../modules/ui/floatingBtn";
import { FaRegSave } from "react-icons/fa";
import { ToDoItem } from "../types/ToDoItem.types";


interface ScreenEditTodoProps {
  title: string;
  desc: string
  endDate: Date;
  selectedPriority: Priority;
  translatedPrio: string;
  updateToDoItem:  <K extends keyof ToDoItem>(key: K, value: ToDoItem[K]) => void;
  onHandleSave: () => void;
}

const ScreenEditTodo: React.FC<ScreenEditTodoProps> = ({
  title,
  desc,
  endDate,
  selectedPriority,
  translatedPrio,
  updateToDoItem,
  onHandleSave,
}) => {
  const { t } = useTranslation();

  return (
    <div className="edit-todo">
      <Card
        style={{
          backgroundColor: "#49454F",
          color: "white",
          height: "100%",
          margin: "2vw",
          minHeight: "20vh",
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
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  color: "white",
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  marginTop: "1vh",
                }}
              />
            </Form.Group>
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
            <hr />
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={5}
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
                  height: "40vh",
                }}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <FloatingBtn
        alignment={ButtonAlignment.RIGHT}
        icon={FaRegSave}
        onClick={onHandleSave}
      />
    </div>
  );
};

export default ScreenEditTodo;
