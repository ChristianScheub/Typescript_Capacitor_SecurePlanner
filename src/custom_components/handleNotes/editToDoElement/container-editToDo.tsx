import React, { useState, useEffect } from "react";
import View_EditTodo from "./screen-editToDo";
import { Priority } from "../../../modules/ui/editToDo/priorityIndicator/priority.enum";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../types/ToDoItem.types";
import { ToDoList } from "../../types/ToDoList.types";
import ToDoListService from "../../services/toDoListHandler/toDoListHandler";

interface Container_EditTodoProps {
  encryptionKey: string;
  noteId?: string;
  toDoItemId?: number;
}

const Container_EditTodo: React.FC<Container_EditTodoProps> = ({
  encryptionKey,
  noteId,
  toDoItemId,
}) => {
  const { t } = useTranslation();
  const [translatedPrio, setTranslatedPrio] = useState<string>("");
  const toDoItemIdInt = toDoItemId ? toDoItemId : 1;

  //ToDoList wird benötigt für den Speichervorgang
  const [toDoList, setToDoList] = useState<ToDoList>({
    title: "",
    date: new Date(),
    content: "",
    toDoItem: [
      {
        toDoPriority: Priority.Middle,
        toDoTitle: "",
        toDoText: "",
        toDoEndDate: new Date(),
        toDoDone: false,
        toDoCategorie: "",
      },
    ],
  });
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
          console.error("Fehler beim Laden und Entschlüsseln der Notiz:");
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
    toDoCategorie: "",
    toDoId: toDoItemIdInt,
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
          const existingIndex = updatedToDoList.toDoItem.findIndex(
            (item) => item.toDoId === toDoListItem.toDoId
          );
          if (existingIndex === -1) {
            updatedToDoList.toDoItem.push(toDoListItem);
          } else {
            updatedToDoList.toDoItem[existingIndex] = toDoListItem;
          }
          await ToDoListService.saveToDoList(
            updatedToDoList,
            encryptionKey,
            noteId || Date.now().toString()
          );
        } catch (error) {
          console.error("Fehler beim Sichern des ToDos:");
        }
      }
    };
    loadAndDecryptNote();
    extractAndSetCategories();
  }, [toDoListItem]);

  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId && toDoItemIdInt !== null && !isNaN(toDoItemIdInt)) {
        try {
          const noteData = await ToDoListService.loadToDoList(
            noteId,
            encryptionKey
          );
          if (noteData) {
            const listData: ToDoList = noteData;
            if (listData.toDoItem) {
              const toDoItem = listData.toDoItem.find(
                (item) => item.toDoId === toDoItemId
              );
              if (toDoItem) {
                setToDoListItem(toDoItem);
              }
            } else {
              console.error(
                "ToDoItem-Index liegt außerhalb der Grenzen des Arrays"
              );
            }
          }
        } catch (error) {
          console.error("Fehler beim Laden und Entschlüsseln der Notiz:");
        }
      }
    };

    loadAndDecryptNote();
    extractAndSetCategories();
  }, [noteId, toDoItemIdInt, encryptionKey]);

  const updateToDoItem = <K extends keyof ToDoItem>(
    key: K,
    value: ToDoItem[K]
  ) => {
    setToDoListItem({ ...toDoListItem, [key]: value });
  };

  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  const extractAndSetCategories = () => {
    const categoriesSet = new Set<string>();
    toDoList.toDoItem.forEach((item) => {
      if (item.toDoCategorie && item.toDoCategorie.trim() !== "") {
        categoriesSet.add(item.toDoCategorie);
      }
    });

    setCategoriesList(Array.from(categoriesSet));
  };

  return (
    <View_EditTodo
      title={toDoListItem.toDoTitle}
      desc={toDoListItem.toDoText}
      endDate={toDoListItem.toDoEndDate}
      selectedPriority={toDoListItem.toDoPriority}
      translatedPrio={translatedPrio}
      categorie={toDoListItem.toDoCategorie}
      categoriesList={categoriesList || []}
      updateToDoItem={updateToDoItem}
    />
  );
};

export default Container_EditTodo;
