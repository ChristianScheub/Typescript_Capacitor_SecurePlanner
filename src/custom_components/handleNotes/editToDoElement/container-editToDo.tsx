import React, { useState, useEffect } from "react";
import View_EditTodo from "./screen-editToDo";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../types/ToDoItem.types";
import { ToDoList } from "../../types/ToDoList.types";
import  ToDoListService from "../../services/toDoListHandler/toDoListHandler";

interface Container_EditTodoProps {
  encryptionKey: string;
}

const Container_EditTodo: React.FC<Container_EditTodoProps> = ({
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
        toDoDone: false,
      },
    ],
  });
  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId) {
        try {
          const noteData = await ToDoListService.loadToDoList(noteId, encryptionKey);
          if(noteData){
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

  //An dem toDoListItem wird eigentlich gearbeitet
  const [toDoListItem, setToDoListItem] = useState<ToDoItem>({
    toDoPriority: Priority.High,
    toDoTitle: "",
    toDoText: "",
    toDoEndDate: new Date(),
    toDoDone: false,
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
      if (noteId) {
        try {
          let updatedToDoList = { ...toDoList };
          if (toDoItemIdInt >= updatedToDoList.toDoItem.length) {
            updatedToDoList.toDoItem.push(toDoListItem);
          } else {
            updatedToDoList.toDoItem[toDoItemIdInt] = toDoListItem;
          }
          await ToDoListService.saveToDoList(updatedToDoList, encryptionKey, noteId || Date.now().toString());
        } catch (error) {
          console.error(
            "Fehler beim Sichern des ToDos:",
            error
          );
        }
      }
    };
    loadAndDecryptNote();
  }, [toDoListItem]);

  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId && toDoItemIdInt !== null && !isNaN(toDoItemIdInt)) {
        try {
          const noteData = await ToDoListService.loadToDoList(noteId, encryptionKey);
          if(noteData){
            const listData: ToDoList = noteData;
            if (listData.toDoItem && toDoItemIdInt < listData.toDoItem.length) {
              setToDoListItem(listData.toDoItem[toDoItemIdInt]);
            } else {
              console.error(
                "ToDoItem-Index liegt außerhalb der Grenzen des Arrays"
              );
            }
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
    navigate(-1);
  };

  const updateToDoItem = <K extends keyof ToDoItem>(
    key: K,
    value: ToDoItem[K]
  ) => {
    setToDoListItem({ ...toDoListItem, [key]: value });
  };

  return (
    <View_EditTodo
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

export default Container_EditTodo;
