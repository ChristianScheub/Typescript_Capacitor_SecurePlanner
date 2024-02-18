import React, { useState, useEffect } from "react";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { encryptAndStore, decryptFromStorage } from "../encryptionEngine";
import EditNoteView from "./screen-editNote";
import { ToDoList } from "../types/ToDoList.types"; // Angenommen, ToDoItem ist korrekt importiert
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../types/ToDoItem.types";
import { Priority } from "../editToDoElement/priorityIndicator/priority.enum";

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
  const isNewPath = location.pathname.includes('new');

  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId) {
        try {
          const decryptedContent = await decryptFromStorage(
            encryptionKey,
            noteId
          );
          const noteData: ToDoList = JSON.parse(decryptedContent);
          setToDoList(noteData);
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
    const loadAndDecryptNote = async () => {
      if (noteId) {
        try {
          const noteDataString = JSON.stringify(toDoList);
          encryptAndStore(
            noteDataString,
            encryptionKey,
            noteId
          );
        } catch (error) {
          console.error(
            "Fehler beim Laden und Entschlüsseln der Notiz:",
            error
          );
        }
      }
    };

    loadAndDecryptNote();
  }, [toDoList]);

  const isToday = (dateInput: Date | string): boolean => {
    const date = new Date(dateInput);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calculateProgress = (
    toDoItems: ToDoItem[],
    predicate: (item: ToDoItem) => Boolean,
    totalPredicate: (item: ToDoItem) => Boolean = () => true
  ): number => {
    const totalItems = toDoItems.filter(totalPredicate).length;
    const doneItems = toDoItems.filter(predicate).length;
    let progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;
    progress = Math.round(progress * 10) / 10;
    return progress;
  };

  const progressOverall = calculateProgress(
    toDoList.toDoItem,
    (item) => item.toDoDone
  );
  const progressToday = calculateProgress(
    toDoList.toDoItem,
    (item) => item.toDoDone && isToday(item.toDoEndDate),
    (item) => isToday(item.toDoEndDate)
  );
  const progressHighPriority = calculateProgress(
    toDoList.toDoItem,
    (item) => item.toDoDone && 
      (item.toDoPriority === Priority.High || item.toDoPriority === Priority.Highest),
    (item) => item.toDoPriority === Priority.High || item.toDoPriority === Priority.Highest // Nur To-Dos mit hoher Priorität zählen
  );

  const handleSave = () => {
    const noteDataString = JSON.stringify(toDoList);
    encryptAndStore(
      noteDataString,
      encryptionKey,
      noteId || Date.now().toString()
    );
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
    return `${day}.${month}.${year}`;
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
  
    const i18nKey = priorityKeyMap[priority];
    return t(i18nKey);
  };

  return (
    <EditNoteView
      toDoList={toDoList}
      isNewPath={isNewPath}
      progressOverall={progressOverall}
      progressToday={progressToday}
      progressHighPriority={progressHighPriority}
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
