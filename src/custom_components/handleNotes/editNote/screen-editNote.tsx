import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FaRegSave, FaRegClock, FaTrash, FaCheck } from "react-icons/fa";
import FloatingBtn, { ButtonAlignment } from "../../../modules/ui/floatingBtn/floatingBtn";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import { ToDoList } from "../../types/ToDoList.types";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import ProgressBar from "../../../modules/ui/progress/progressBar/screen-progressBar";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";

interface View_EditNoteViewProps {
  toDoList: ToDoList;
  isNewPath: Boolean
  progressOverall: number;
  progressToday: number;
  progressHighPriority: number;
  progressNext7Days: number;
  getPriorityText: (priority: Priority) => string;
  handleSave: () => void;
  handleEdit: (toDoId: string) => void;
  handleAdd: () => void;
  formatDate: (dateInput: Date | string) => string;
  updateToDoList: <K extends keyof ToDoList>(
    key: K,
    value: ToDoList[K]
  ) => void;
  handleDeleteToDo: (event: React.MouseEvent, toDoId: number) => void;
  handleDoneToDo: (event: React.MouseEvent, toDoId: number) => void;
}

const View_EditNote: React.FC<View_EditNoteViewProps> = ({
  toDoList,
  isNewPath,
  progressOverall,
  progressToday,
  progressHighPriority,
  progressNext7Days,
  getPriorityText,
  handleSave,
  handleEdit,
  handleAdd,
  formatDate,
  updateToDoList,
  handleDeleteToDo,
  handleDoneToDo,
}) => {
  const formattedDate = (new Date(toDoList.date)).toLocaleDateString();
  const { t } = useTranslation();

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleProgressBarClick = (id: string) => {
    // Schaltet den Tooltip um oder setzt ihn zurück, falls er bereits aktiv ist
    setActiveTooltip(activeTooltip === id ? null : id);
  };



  return (
    <div
      style={{
        margin: "2vw",
        color: "white",
        minHeight: "70vh",
        marginTop: "env(safe-area-inset-top)",
      }}
    >
      <Form>
        <Form.Group controlId="noteTitle">
          <Form.Control
            type="text"
            value={toDoList.title}
            placeholder={t("editNote_TitlePlaceholder")}
            onChange={(e) => updateToDoList("title", e.target.value)}
            className="white-placeholder"
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #ffffff50",
          }}
        >
          <FaRegClock
            style={{
              color: "#CBCBCD",
              marginRight: "0.5rem",
              marginLeft: "1rem",
            }}
          />
          <Form.Text style={{ color: "#CBCBCD", fontSize: "1rem" }}>
            {formattedDate}
          </Form.Text>
        </div>

        <Form.Group>
          <Form.Control
            as="textarea"
            rows={1}
            value={toDoList.content}
            placeholder={t("editNote_TextPlaceholder")}
            onChange={(e) => updateToDoList("content", e.target.value)}
            style={{
              backgroundColor: "#1D1B20",
              color: "white",
              border: "0",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              padding: "10px",
              height: "7vh",
            }}
          />
        </Form.Group>

        <ProgressBar title={t("editNote_progressBar_Total")} progress={progressOverall} infoText={t("editNote_progressBar_Total_Explanation", {count: progressOverall})} active={activeTooltip === 'total'}
        onClick={() => handleProgressBarClick('total')} />
        <ProgressBar title={t("editNote_progressBar_Today")} progress={progressToday} infoText={t("editNote_progressBar_Today_Explanation", {count: progressToday})} active={activeTooltip === 'today'}
        onClick={() => handleProgressBarClick('today')}/>
        <ProgressBar title={t("editNote_progressBar_7Days")} progress={progressNext7Days} infoText={t("editNote_progressBar_7Days_Explanation", {count: progressNext7Days})} active={activeTooltip === '7Days'}
        onClick={() => handleProgressBarClick('7Days')}/>
        <ProgressBar title={t("editNote_progressBar_Priority")} progress={progressHighPriority} infoText={t("editNote_progressBar_Priority_Explanation", {count: progressHighPriority})} active={activeTooltip === 'Priority'}
        onClick={() => handleProgressBarClick('Priority')}/>

        {toDoList.toDoItem.map((item, index) => (
          <Card
            key={index}
            style={{
              backgroundColor: "#49454F",
              color: "white",
              margin: "2vw",
              minHeight: "13vh",
            }}
          >
            <Card.Body>
              <table style={{ width: "80vw" }}>
                <tbody>
                  <tr>

                    <td onClick={(event) => handleDoneToDo(event, index)}>
                      <div
                        style={{
                          textDecoration: item.toDoDone
                            ? "line-through"
                            : "none",
                        }}
                      >
                        <h4>{item.toDoTitle}</h4>
                        <b>{t("editToDoElement_EndDate")}: </b>
                        <i dangerouslySetInnerHTML={{ __html: formatDate(item.toDoEndDate) }}></i>
                        <br />
                        <b>{t("editToDoElement_Priority")}: </b>
                        <i dangerouslySetInnerHTML={{ __html: getPriorityText(item.toDoPriority) }}></i>
                      </div>
                    </td>
                    <td
                      style={{ textAlign: "left", width: "10vw" }}
                      onClick={(event) => handleDeleteToDo(event, index)}
                    >
                      <button
                        type="button"
                        style={{
                          width: "4vw",
                          height: "4vh",
                          backgroundColor: "#49454F",
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
                    <td onClick={() => handleEdit(index.toString())}>
                      <button
                        type="button"
                        style={{
                          width: "4vw",
                          height: "4vh",
                          backgroundColor: "#49454F",
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

        <FloatingBtn
          alignment={ButtonAlignment.RIGHT}
          icon={IoAddSharp}
          onClick={handleAdd}
        />
         {isNewPath && (
        <FloatingBtn
          alignment={ButtonAlignment.LEFT}
          icon={FaRegSave}
          onClick={handleSave}
        />
        )}
      </Form>
    </div>
  );
};

export default View_EditNote;