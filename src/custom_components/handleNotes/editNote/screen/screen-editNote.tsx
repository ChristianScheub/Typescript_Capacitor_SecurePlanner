import React from "react";
import { Form } from "react-bootstrap";
import { FaRegSave, FaTrash } from "react-icons/fa";
import FloatingBtn, {
  ButtonAlignment,
} from "../../../../modules/ui/floatingBtn/floatingBtn";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import { ToDoList } from "../../../types/ToDoList.types";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { Priority } from "../../../enums/priority.enum";
import DateDisplayWithClock from "./ui/dateWithClock/dateWithClock";
import ProgressBarScreen from "./ui/progressBarMenu/progressBarScreen";
import "./screen-editNote.css";

interface View_EditNoteViewProps {
  toDoList: ToDoList;
  isNewPath: boolean;
  categoriesList: string[];
  getCategoryProgress: (category: string) => number;
  progressOverall: number;
  progressToday: number;
  progressHighPriority: number;
  progressNext7Days: number;
  getPriorityText: (priority: Priority) => string;
  handleEdit: (toDoId: number) => void;
  handleAdd: () => void;
  formatDate: (dateInput: Date | string) => string;
  updateToDoList: <K extends keyof ToDoList>(
    key: K,
    value: ToDoList[K]
  ) => void;
  handleDeleteToDo: (event: React.MouseEvent, toDoId: number) => void;
  handleDoneToDo: (
    event: React.MouseEvent,
    toDoId: number
  ) => void;
  CustomComponent: () => React.ReactNode;
  showToDoEdit: boolean;
  onHandleToDoSave: () => void;
  handleFilterList: (filterArgument: string) => void;
}

const View_EditNote: React.FC<View_EditNoteViewProps> = ({
  toDoList,
  isNewPath,
  categoriesList,
  getCategoryProgress,
  progressOverall,
  progressToday,
  progressHighPriority,
  progressNext7Days,
  getPriorityText,
  handleEdit,
  handleAdd,
  formatDate,
  updateToDoList,
  handleDeleteToDo,
  handleDoneToDo,
  CustomComponent,
  showToDoEdit,
  onHandleToDoSave,
  handleFilterList,
}) => {
  const { t } = useTranslation();


  return (
    <div
    className="editNoteScreen margin2vw"
    >
      {showToDoEdit && (
        <>
          <div
            className="edit-todo-background"
            onClick={onHandleToDoSave}
          ></div>
          {CustomComponent()}
          <div style={{ zIndex: 1001 }}>
            <FloatingBtn
              alignment={ButtonAlignment.RIGHT}
              icon={FaRegSave}
              onClick={onHandleToDoSave}
            />
          </div>
        </>
      )}

      <Form>
        <Form.Group controlId="noteTitle">
          <Form.Control
            type="text"
            value={toDoList.title}
            data-testid="noteTitleTest"
            placeholder={t("editNote_TitlePlaceholder")}
            onChange={(e) => updateToDoList("title", e.target.value)}
            className="backgroundColor placeHolderColor noteTitle"
          />
        </Form.Group>
        <DateDisplayWithClock date={new Date(toDoList.date).toLocaleDateString()} />

        <Form.Group>
          <Form.Control
            as="textarea"
            rows={1}
            value={toDoList.content}
            placeholder={t("editNote_TextPlaceholder")}
            data-testid="noteTextTest"
            onChange={(e) => updateToDoList("content", e.target.value)}
            className="backgroundColorOnGrey placeHolderColor noteContent"
          />
        </Form.Group>

        <ProgressBarScreen
          progressOverall={progressOverall}
          progressToday={progressToday}
          progressNext7Days={progressNext7Days}
          progressHighPriority={progressHighPriority}
          categoriesList={categoriesList}
          getCategoryProgress={getCategoryProgress}
          handleFilterList={handleFilterList}
        />

        {toDoList && Array.isArray(toDoList.toDoItem) && (
          <div>
            {toDoList.toDoItem.map((item, index) => (
              <Card
                key={index}
                className="backgroundColorHighlight shadow margin2vw"
                style={{
                  minHeight: "13vh",
                }}
              >
                <Card.Body>
                  <table style={{ width: "80vw", maxWidth: "80vw" }}>
                    <tbody>
                      <tr>
                        <td
                          onClick={(event) =>
                            handleDoneToDo(event, item.toDoId!)
                          }
                        >
                          <div
                            style={{
                              textDecoration: item.toDoDone
                                ? "line-through"
                                : "none",
                              width: "50vw",
                            }}
                          >
                            <p style={{ fontSize: "1.25em" }}>
                              <b style={{ color: "#00a0b2" }}>
                                {item.toDoCategorie
                                  ? `${item.toDoCategorie}:`
                                  : ""}
                              </b>{" "}
                              {item.toDoTitle}
                            </p>

                            <b>{t("editToDoElement_EndDate")}: </b>
                            <i
                              dangerouslySetInnerHTML={{
                                __html: formatDate(item.toDoEndDate),
                              }}
                            ></i>
                            <br />
                            <b>{t("editToDoElement_Priority")}: </b>
                            <i
                              dangerouslySetInnerHTML={{
                                __html: getPriorityText(item.toDoPriority),
                              }}
                            ></i>
                          </div>
                        </td>
                        <td
                          style={{ textAlign: "left", width: "10vw" }}
                          onClick={(event) => handleDeleteToDo(event, item.toDoId!)}
                        >
                          <button
                            type="button"
                            className="backgroundColorHighlight fourVwVhSquare"
                            style={{
                              border: "none",
                            }}
                          >
                            <FaTrash
                            className="fourVwVhSquare"
                              style={{
                                color: "#b30000",
                              }}
                            />
                          </button>
                        </td>
                        <td onClick={() => handleEdit(item.toDoId!)}>
                          <button
                            type="button"
                            className="backgroundColorHighlight fourVwVhSquare"
                            style={{
                              border: "none",
                            }}
                          >
                            <MdOutlineEdit
                            className="fourVwVhSquare colorWhite" 
                            />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {!showToDoEdit && (
          <>
            <FloatingBtn
              alignment={ButtonAlignment.RIGHT}
              icon={IoAddSharp}
              onClick={handleAdd}
            />
          </>
        )}

        {isNewPath && toDoList.toDoItem.length < 1 && (
          <div>
            <div
            className="editNoteHintDiv makeItCenter width100"
            >
              <p style={{ fontSize: "8vw" }}>
                {" "}
                <br /> {t("editNote_hint")}
              </p>
              <FaRegSave
                style={{
                  fontSize: "14vw",
                }}
              />
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default View_EditNote;