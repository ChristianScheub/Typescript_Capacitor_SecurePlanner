import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { isEqual } from "../../services/equals/equals";
import EditNoteView from "./screen-editNote";
import { ToDoList } from "../../types/ToDoList.types";
import { useTranslation } from "react-i18next";
import { Priority } from "../editToDoElement/priorityIndicator/priority.enum";
import ToDoListService from "../../services/toDoListHandler/toDoListHandler";
import ProgressToDoListService from "../../services/progressToDoListService/progressToDoListService";
import { ToDoItem } from "../../types/ToDoItem.types";

interface EditNoteContainerProps {
  encryptionKey: string;
}

const EditNoteContainer: React.FC<EditNoteContainerProps> = ({
  encryptionKey,
}) => {
  let { noteId } = useParams<{ noteId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toDoList, setToDoList] = useState<ToDoList>({
    title: "",
    date: new Date(),
    content: "",
    toDoItem: [],
  });
  const location = useLocation();
  const isNewPath = location.pathname.includes("new");

  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId) {
        try {
          const noteData = await ToDoListService.loadToDoList(
            noteId,
            encryptionKey
          );
          if (noteData) {
            setToDoList(noteData);
          }
        } catch (error) {
          console.error(
            "Fehler beim Laden und Entschlüsseln der Notiz:",
            error
          );
        }
      }
    };
    loadAndDecryptNote();
  }, [noteId, encryptionKey]);

  useEffect(() => {
    const sortedToDoList = ToDoListService.sortToDoList(toDoList);
    if (!isEqual(sortedToDoList.toDoItem, toDoList.toDoItem)) {
      setToDoList(sortedToDoList);
    }

    const loadAndDecryptNote = async () => {
      if (noteId) {
        try {
          await ToDoListService.saveToDoList(toDoList, encryptionKey, noteId);
        } catch (error) {
          console.error("Fehler beim Speichern der Notiz:", error);
        }
      }
    };

    loadAndDecryptNote();
  }, [toDoList]);

  const progressOverall = ProgressToDoListService.calculateProgress(
    toDoList.toDoItem,
    (item) => item.toDoDone
  );
  const progressToday = ProgressToDoListService.calculateProgress(
    toDoList.toDoItem,
    (item) =>
      item.toDoDone && ProgressToDoListService.isNextNDays(item.toDoEndDate, 0),
    (item) => ProgressToDoListService.isNextNDays(item.toDoEndDate, 0)
  );

  const progressNext7Days = ProgressToDoListService.calculateProgress(
    toDoList.toDoItem,
    (item) =>
      item.toDoDone && ProgressToDoListService.isNextNDays(item.toDoEndDate, 7),
    (item) => ProgressToDoListService.isNextNDays(item.toDoEndDate, 7)
  );

  const progressHighPriority = ProgressToDoListService.calculateProgress(
    toDoList.toDoItem,
    (item) =>
      item.toDoDone &&
      [Priority.High, Priority.Highest].includes(item.toDoPriority),
    (item) => [Priority.High, Priority.Highest].includes(item.toDoPriority)
  );

  const handleSave = async () => {
    await ToDoListService.saveToDoList(toDoList, encryptionKey, noteId);
    navigate(-1);
  };

  const handleEditToDo = (toDoId: string) => {
    navigate(`/edit/${noteId}/` + toDoId);
  };

  function formatDate(dateInput: Date | string): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.error(
        "Das übergebene Argument ist kein gültiges Date-Objekt oder Datum-String:",
        dateInput
      );
      return "";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const toDoEndDate = `${day}.${month}.${year}`;
    const today: Date = new Date();
    let formattedDate: string = toDoEndDate;

    if (date.toDateString() === today.toDateString()) {
      formattedDate = `<span style="color: red;">${toDoEndDate}</span>`;
    }
    return formattedDate;
  }

  const updateToDoList = <K extends keyof ToDoList>(
    key: K,
    value: ToDoList[K]
  ) => {
    setToDoList({ ...toDoList, [key]: value });
  };

  function handleAdd() {
    const count = toDoList.toDoItem.length;
    navigate(`/edit/${noteId}/` + count);
  }

  const handleDeleteToDo = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    if (window.confirm(t("editNote_ToDoDeleteConfirm"))) {
      event.preventDefault();
      const updatedToDoItems = toDoList.toDoItem.filter(
        (item, itemIndex) => itemIndex !== index
      );

      setToDoList({
        ...toDoList,
        toDoItem: updatedToDoItems,
      });
    }
  };

  const handleDoneToDo = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    const updatedToDoItems = toDoList.toDoItem.map((item, itemIndex) => {
      if (itemIndex === index) {
        if ({ ...item, toDoDone: true })
          return { ...item, toDoDone: !item.toDoDone };
      }
      return item;
    });

    setToDoList({
      ...toDoList,
      toDoItem: updatedToDoItems,
    });
  };

  const getPriorityText = (priority: Priority): string => {
    const priorityKeyMap: Record<Priority, string> = {
      [Priority.Low]: "editToDoElement_Low",
      [Priority.Middle]: "editToDoElement_Middle",
      [Priority.High]: "editToDoElement_High",
      [Priority.Highest]: "editToDoElement_Highest",
    };

    let i18nKey = priorityKeyMap[priority];
    if (priority === Priority.Highest) {
      i18nKey = `<span style="color: red;">${t(i18nKey)}</span>`;
    }
    return t(i18nKey);
  };

  return (
    <EditNoteView
      toDoList={toDoList}
      isNewPath={isNewPath}
      progressOverall={progressOverall}
      progressToday={progressToday}
      progressHighPriority={progressHighPriority}
      progressNext7Days={progressNext7Days}
      getPriorityText={getPriorityText}
      handleSave={handleSave}
      handleEdit={handleEditToDo}
      handleAdd={handleAdd}
      formatDate={formatDate}
      updateToDoList={updateToDoList}
      handleDeleteToDo={handleDeleteToDo}
      handleDoneToDo={handleDoneToDo}
    />
  );
};

export default EditNoteContainer;
