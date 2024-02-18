import React, { useState, useEffect } from "react";
import ScreenEditTodo from "./screen-editToDo";
import { Priority } from "./priorityIndicator/priority.enum";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../types/ToDoItem.types";
import { ToDoList } from "../types/ToDoList.types";
import { encryptAndStore, decryptFromStorage } from "../encryptionEngine";

interface EditToDoContainerProps {
  encryptionKey: string;
}

const EditTodoContainer: React.FC<EditToDoContainerProps> = ({
  encryptionKey,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [translatedPrio, setTranslatedPrio] = useState<string>("");

  const { noteId, toDoItemId } = useParams<{
    noteId?: string;
    toDoItemId?: string;
  }>();
  const toDoItemIdInt = toDoItemId ? parseInt(toDoItemId, 10) : 0;

  //ToDoList wird benötigt für den Speichervorgang
  const [toDoList, setToDoList] = useState<ToDoList>({
    title: "",
    date: new Date(),
    content: "",
    toDoItem: [
      {
        toDoPriority: Priority.High,
        toDoTitle: "",
        toDoText: "",
        toDoEndDate: new Date(),
        toDoDone: false
      },
    ],
  });
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

  //An dem toDoListItem wird eigentlich gearbeitet
  const [toDoListItem, setToDoListItem] = useState<ToDoItem>({
    toDoPriority: Priority.High,
    toDoTitle: "",
    toDoText: "",
    toDoEndDate: new Date(),
    toDoDone: false
  });
  useEffect(() => {
    const priorityKeyMap: Record<Priority, string> = {
      [Priority.Low]: "editToDoElement_Low",
      [Priority.Middle]: "editToDoElement_Middle",
      [Priority.High]: "editToDoElement_High",
      [Priority.Highest]: "editToDoElement_Highest",
    };
    const i18nKey = priorityKeyMap[toDoListItem.toDoPriority];
    setTranslatedPrio(t(i18nKey));
  }, [toDoListItem.toDoPriority, t]);

  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId && toDoItemIdInt !== null && !isNaN(toDoItemIdInt)) {
        try {
          const decryptedContent = await decryptFromStorage(
            encryptionKey,
            noteId
          );
          const listData: ToDoList = JSON.parse(decryptedContent);

          // Prüfen, ob der Index innerhalb der Grenzen des toDoItem-Arrays liegt
          if (listData.toDoItem && toDoItemIdInt < listData.toDoItem.length) {
            setToDoListItem(listData.toDoItem[toDoItemIdInt]);
          } else {
            console.error(
              "ToDoItem-Index liegt außerhalb der Grenzen des Arrays"
            );
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
  }, [noteId, toDoItemIdInt, encryptionKey]);

  const handleSave = () => {
    let updatedToDoList = { ...toDoList };
    console.log(toDoItemIdInt);
    if (toDoItemIdInt >= updatedToDoList.toDoItem.length) {
      updatedToDoList.toDoItem.push(toDoListItem);
    } else {
      updatedToDoList.toDoItem[toDoItemIdInt] = toDoListItem;
    }
    console.log(updatedToDoList);
    const noteDataString = JSON.stringify(updatedToDoList);
    encryptAndStore(
      noteDataString,
      encryptionKey,
      noteId || Date.now().toString()
    );

    navigate(-1);
  };

  const updateToDoItem = <K extends keyof ToDoItem>(
    key: K,
    value: ToDoItem[K]
  ) => {
    setToDoListItem({ ...toDoListItem, [key]: value });
  };

  return (
    <ScreenEditTodo
      title={toDoListItem.toDoTitle}
      desc={toDoListItem.toDoText}
      endDate={toDoListItem.toDoEndDate}
      selectedPriority={toDoListItem.toDoPriority}
      translatedPrio={translatedPrio}
      updateToDoItem={updateToDoItem}
      onHandleSave={handleSave}
    />
  );
};

export default EditTodoContainer;
