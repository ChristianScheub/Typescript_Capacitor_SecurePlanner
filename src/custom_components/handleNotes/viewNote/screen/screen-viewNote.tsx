import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaPlusCircle } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import FloatingBtn, {
  ButtonAlignment,
} from "../../../../modules/ui/floatingBtn/floatingBtn";
import { useTranslation } from "react-i18next";
import ProgressCircle from "../../../../modules/ui/progress/progressCircle/progressCircle";
import { ToDoListWithKey } from "../../../types/ToDoListKey.types";
import { ToDoList } from "../../../types/ToDoList.types";
import { MdArrowForwardIos } from "react-icons/md";
import "./screen-viewNote.css";

interface ViewViewNoteProps {
  notes: ToDoListWithKey[];
  onNavigateToEdit: (noteId: string) => void;
  onNavigateToCreateNew: () => void;
  calculateProgress: (items: ToDoList) => number;
  calculateProgressDays: (items: ToDoList, days: number) => number;
  breakText: (text: string, maxLength: number) => string;
  truncateText: (text: string, maxLength: number) => string;
}

const ViewViewNote: React.FC<ViewViewNoteProps> = ({
  notes,
  onNavigateToEdit,
  onNavigateToCreateNew,
  calculateProgress,
  calculateProgressDays,
  breakText,
  truncateText,
}) => {
  const { t } = useTranslation();

  return (
    <div className="viewNoteContainer">
      {notes.length > 0 ? (
        <Row xs={1} md={1} lg={1} style={{ margin: "1vw" }}>
          {notes.map((note) => (
            <Col key={note.key} style={{ marginBottom: "5vw" }}>
              <Card
                className="backgroundColorHighlight shadow viewNoteCard margin2vw multipleCards"
                onClick={() => onNavigateToEdit(note.key)}
              >
                <Card.Body>
                  <table className="viewNoteTable">
                    <tbody>
                      <tr>
                        <td>
                          <Card.Title
                            style={{
                              marginLeft: note.toDoList.content ? "1vw" : "2vw",
                            }}
                          >
                            {truncateText(note.toDoList.title, 15)}
                          </Card.Title>
                          <table
                            style={{
                              height: "100%",
                              width: "70vw",
                            }}
                          >
                            <tbody>
                              <tr>
                                {note.toDoList.content ? (
                                  <td style={{ height: "100%" }}>
                                    <Card.Text>
                                      {breakText(
                                        truncateText(note.toDoList.content, 20),
                                        6
                                      )}
                                    </Card.Text>
                                  </td>
                                ) : (
                                  <td
                                    style={{
                                      paddingLeft: "2vw",
                                      paddingRight: "2vw",
                                    }}
                                  >
                                    <ProgressCircle
                                      title={t("viewNote_progressCircle_7Days")}
                                      progress={calculateProgressDays(
                                        note.toDoList,
                                        7
                                      )}
                                    />
                                  </td>
                                )}
                                <td>
                                  <ProgressCircle
                                    title={t("viewNote_progressCircle_Today")}
                                    progress={calculateProgressDays(
                                      note.toDoList,
                                      0
                                    )}
                                  />
                                </td>
                                <td style={{ paddingLeft: "2vw" }}>
                                  <ProgressCircle
                                    title={t("viewNote_progressCircle_Total")}
                                    progress={calculateProgress(note.toDoList)}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td id="arrowLeftColum" className="width100">
                          <MdArrowForwardIos
                            className="colorWhite"
                            style={{ fontSize: "2em" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          <Card className="backgroundColorHighlight viewNoteCard margin2vw singleCard shadow">
            <Card.Body>
              <Card.Text>
                {truncateText(t("placeholder_noNotes"), 150)}
              </Card.Text>
            </Card.Body>
          </Card>
          <div className="viewNoteHintContainer viewNoteHintContainer width100">
            <p style={{ fontSize: "8vw" }}>
              {" "}
              <br /> {t("viewNote_hint")}
            </p>
            <FaArrowDownLong style={{ fontSize: "14vw" }} />
          </div>
        </div>
      )}

      <FloatingBtn
        alignment={ButtonAlignment.CENTER}
        icon={FaPlusCircle}
        onClick={onNavigateToCreateNew}
      />
    </div>
  );
};

export default ViewViewNote;