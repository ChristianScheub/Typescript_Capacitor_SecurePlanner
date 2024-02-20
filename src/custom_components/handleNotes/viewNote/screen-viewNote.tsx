import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaPlusCircle, FaArrowRight } from "react-icons/fa";
import FloatingBtn, { ButtonAlignment } from "../../../modules/ui/floatingBtn/floatingBtn";
import { useTranslation } from "react-i18next";
import ProgressCircle from "../../../modules/ui/progress/progressCircle/progressCircle";
import { ToDoListWithKey } from "../../types/ToDoListKey.types";
import { ToDoList } from "../../types/ToDoList.types";
import { MdArrowForwardIos } from "react-icons/md";

interface View_ViewNoteProps {
  notes: ToDoListWithKey[];
  onNavigateToEdit: (noteId: string) => void;
  onNavigateToCreateNew: () => void;
  calculateProgress: (items: ToDoList) => number;
  calculateProgressDays: (items: ToDoList, days: number) => number;
}

const View_ViewNote: React.FC<View_ViewNoteProps> = ({
  notes,
  onNavigateToEdit,
  onNavigateToCreateNew,
  calculateProgress,
  calculateProgressDays,
}) => {
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };
  const breakText = (text: string, maxLength: number): string => {
    let brokenText = "";
    let currentIndex = 0;

    while (currentIndex < text.length) {
      let spaceIndex = currentIndex + maxLength;
      if (spaceIndex < text.length && text[spaceIndex] !== " ") {
        while (spaceIndex < text.length && text[spaceIndex] !== " ") {
          spaceIndex++;
        }
      }
      if (spaceIndex === text.length) {
        spaceIndex = currentIndex + maxLength;
      }
      brokenText += text.substring(currentIndex, spaceIndex) + " ";
      currentIndex = spaceIndex;
    }
    return brokenText.trim();
  };

  const { t } = useTranslation();

  return (
    <div
      style={{
        marginTop: "env(safe-area-inset-top)",
      }}
    >
      {notes.length > 0 ? (
        <Row xs={1} md={1} lg={2} style={{ margin: "1vw" }}>
          {notes.map((note) => (
            <Col key={note.key} style={{ marginBottom: "5vw" }}>
              <Card
                style={{
                  backgroundColor: "#49454F",
                  color: "white",
                  margin: "2vw",
                  minHeight: "20vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => onNavigateToEdit(note.key)}
              >
                <Card.Body>
                  <table
                    style={{
                      paddingTop: "1vh",
                      marginLeft: "4vw",
                      width: "82vw"
                    }}
                  >
                    <tr>
                      <td>
                        <Card.Title style={{
                      marginLeft: note.toDoList.content ? "1vw" : "2vw",
                    }}>
                          {truncateText(note.toDoList.title, 15)}
                        </Card.Title>
                        <table
                          style={{
                            height: "100%",
                            width: "70vw",
                          }}
                        >
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
                        </table>
                      </td>
                      <td style={{ paddingLeft: "2vw",textAlign:"right",width: "100%" }}>
                        <MdArrowForwardIos
                          style={{ color: "white", fontSize: "2em" }}
                        />
                      </td>
                    </tr>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card
          style={{
            margin: "2vw",
            backgroundColor: "#49454F",
            color: "white",
            minHeight: "25vh",
          }}
        >
          <Card.Body>
            <Card.Text>{truncateText(t("placeholder_noNotes"), 150)}</Card.Text>
          </Card.Body>
        </Card>
      )}

      <FloatingBtn
        alignment={ButtonAlignment.RIGHT}
        icon={FaPlusCircle}
        onClick={onNavigateToCreateNew}
      />
    </div>
  );
};

export default View_ViewNote;