import React from "react";
import { Form } from "react-bootstrap";
import { FaRegSave, FaTrash } from "react-icons/fa";
import FloatingBtn, {
  ButtonAlignment,
} from "../../../modules/ui/floatingBtn/floatingBtn";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import { ToDoList } from "../../types/ToDoList.types";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { Priority } from "../../enums/priority.enum";
import DateDisplayWithClock from "./ui/dateWithClock/dateWithClock";
import ProgressBarScreen from "./ui/progressBarMenu/progressBarScreen";

interface View_EditNoteViewProps {
  toDoList: ToDoList;
  isNewPath: Boolean;
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
  showToDoEdit: Boolean;
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
      style={{
        margin: "2vw",
        minHeight: "70vh",
        marginTop: "env(safe-area-inset-top)",
      }}
    >
      {showToDoEdit && (
        <>
          <div
            className="edit-todo"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
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
            className="backgroundColor placeHolderColor"
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "8px",
              marginTop: "1vh",
            }}
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
            className="backgroundColorOnGrey placeHolderColor"
            style={{
              border: "0",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              padding: "10px",
              height: "7vh",
            }}
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
                className="backgroundColorHighlight shadow"
                style={{
                  margin: "2vw",
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
                            className="backgroundColorHighlight"
                            style={{
                              width: "4vw",
                              height: "4vh",
                              border: "none",
                            }}
                          >
                            <FaTrash
                              style={{
                                width: "4vw",
                                height: "4vw",
                                color: "#b30000",
                              }}
                            />
                          </button>
                        </td>
                        <td onClick={() => handleEdit(item.toDoId!)}>
                          <button
                            type="button"
                            className="backgroundColorHighlight"
                            style={{
                              width: "4vw",
                              height: "4vh",
                              border: "none",
                            }}
                          >
                            <MdOutlineEdit
                              style={{
                                width: "4vw",
                                height: "4vw",
                                color: "white",
                              }}
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
              style={{
                display: "flex",
                textAlign: "center",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "30vh",
              }}
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
