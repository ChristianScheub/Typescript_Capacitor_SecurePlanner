import React, { useState, useEffect } from "react";
import ViewEditTodo from "../screens/screen-editToDo";
import ViewEditTodoTooMuch from "../screens/screen-editToDo-TooMuch";
import { Priority } from "../../../enums/priority.enum";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../../types/ToDoItem.types";
import { ToDoList } from "../../../types/ToDoList.types";
import ToDoListService from "../../../services/toDoListHandler/toDoListHandler";
import {
  featureFlag_Debug_Errors,
  featureFlag_IsTrialVersion,
} from "../../../featureFlags/featureFlags";

interface ContainerEditTodoProps {
  encryptionKey: string;
  noteId?: string;
  toDoItemId?: number;
}

const ContainerEditTodo: React.FC<ContainerEditTodoProps> = ({
  encryptionKey,
  noteId,
  toDoItemId,
}) => {
  const { t } = useTranslation();
  const [translatedPrio, setTranslatedPrio] = useState<string>("");
  const toDoItemIdInt = toDoItemId || 1;
  const [trialAndToMuch, setTrialAndToMuch] = useState<boolean>(false);

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
            //Trial Version Check
            if (featureFlag_IsTrialVersion) {
              if (noteData.toDoItem.length > 3) {
                setTrialAndToMuch(true);
              }
            }
          }
        } catch (error) {
          if (featureFlag_Debug_Errors) {
            console.error(
              "Fehler beim Laden und Entschlüsseln der Notiz:",
              error
            );
          }
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
          console.error("Fehler beim Sichern des ToDos:", error);
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
          if (featureFlag_Debug_Errors) {
            console.error(
              "Fehler beim Laden und Entschlüsseln der Notiz:",
              error
            );
          }
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

  if (trialAndToMuch) {
    return (
      <ViewEditTodoTooMuch
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
  }
  console.log(trialAndToMuch);

  return (
    <ViewEditTodo
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

export default ContainerEditTodo;
