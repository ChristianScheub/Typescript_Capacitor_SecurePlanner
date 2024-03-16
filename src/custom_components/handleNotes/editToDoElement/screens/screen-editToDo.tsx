import React from "react";
import PrioritySlider from "./ui/priorityIndicator/priorityIndicator";
import DatePickerComponent from "./ui/dataPicker/dataPicker";
import { Card, InputGroup } from "react-bootstrap";
import { Priority } from "../../../enums/priority.enum";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../../types/ToDoItem.types";
import "./screen-editToDo.css";

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

  return (
    <div
      className="edit-todo-screen"
    >
      <Card
      className="backgroundColorHighlight edit-todo-card margin2vw"
      >
        <Card.Body>
          <Form>
            <Form.Group controlId="noteTitle">
              <Form.Control
                type="text"
                value={title}
                data-testid="noteTitleTest"
                placeholder={t("editNote_TitlePlaceholder")}
                className="backgroundColorNotFocused placeHolderColor note-title-input"
                onChange={(e) => updateToDoItem("toDoTitle", e.target.value)}
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
                  className="backgroundColorNotFocused placeHolderColor category-input-group"
                  onChange={(e) =>
                    updateToDoItem("toDoCategorie", e.target.value)
                  }
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
                className="backgroundColorNotFocused placeHolderColor note-detail-textarea"
                placeholder={t("editToDoElement_DetailText")}
                onChange={(e) => updateToDoItem("toDoText", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default View_EditTodo;