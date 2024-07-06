import React, { useState, useEffect, useCallback } from "react";
import ViewEditTodo from "../screens/screen-editToDo";
import ViewEditTodoTooMuch from "../screens/screen-editToDo-TooMuch";
import { Priority } from "../../../enums/priority.enum";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../../types/ToDoItem.types";
import { ToDoList } from "../../../types/ToDoList.types";
import ToDoListService from "../../../services/toDoListHandler/toDoListHandler";
import { featureFlag_IsTrialVersion } from "../../../config/featureFlags";
import {
  logAllDebugMessages,
  logError,
} from "../../../services/logger/loggerFeatureFlags";

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
  const toDoItemIdInt = toDoItemId ?? 1;
  const [trialAndToMuch, setTrialAndToMuch] = useState<boolean>(false);

  //This ToDoList is required for the save process (the entire list is always saved)
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
    //The first time the ToDoList is loaded
    const loadAndDecryptToDoList = async () => {
      if (noteId) {
        logAllDebugMessages(
          "ContainerEditTodo::loadAndDecryptToDoList::53: Begin to load the toDoList"
        );
        try {
          const noteData = await ToDoListService.loadToDoList(
            noteId,
            encryptionKey
          );
          if (noteData) {
            logAllDebugMessages(
              "ContainerEditTodo::loadAndDecryptToDoList::62: Set now the toDoList"
            );
            logAllDebugMessages(JSON.stringify(noteData, null, 2));
            setToDoList(noteData);
            //Trial Version Check
            if (featureFlag_IsTrialVersion) {
              if (noteData.toDoItem.length > 3) {
                setTrialAndToMuch(true);
              }
            }
          }
        } catch (error) {
          logError(
            "ContainerEditNote::loadAndDecryptToDoList:75 Error loading and decrypting the note:",
            error
          );
        }
      }
    };

    loadAndDecryptToDoList();
  }, [noteId, encryptionKey, toDoItemId]);

  const extractAndSetCategories = useCallback(() => {
    const categoriesSet = new Set<string>();
    toDoList.toDoItem.forEach((item) => {
      if (item.toDoCategorie && item.toDoCategorie.trim() !== "") {
        categoriesSet.add(item.toDoCategorie);
      }
    });

    setCategoriesList(Array.from(categoriesSet));
  }, [toDoList]);

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
    const storeModifedToDoList = async () => {
      //Represent the save of the ToDoList in the Background after an change
      if (
        noteId &&
        (toDoListItem.toDoTitle !== "" ||
          toDoListItem.toDoText !== "" ||
          toDoListItem.toDoCategorie !== "")
      ) {
        logAllDebugMessages(
          "ContainerEditTodo::storeModifedToDoList::117 saveToDoList: ToDoListe was changed!"
        );
        try {
          const updatedToDoList = { ...toDoList };
          const existingIndex = updatedToDoList.toDoItem.findIndex(
            (item) => item.toDoId === toDoListItem.toDoId
          );
          if (existingIndex === -1) {
            updatedToDoList.toDoItem.push(toDoListItem);
          } else {
            updatedToDoList.toDoItem[existingIndex] = toDoListItem;
          }
          logAllDebugMessages(
            "ContainerEditTodo::storeModifedToDoList::131 saveToDoList:"
          );
          logAllDebugMessages(JSON.stringify(updatedToDoList, null, 2));
          await ToDoListService.saveToDoList(
            updatedToDoList,
            encryptionKey,
            noteId
          );
        } catch (error) {
          logError(
            "ContainerEditNote::storeModifedToDoList::141 Error when saving the ToDo:",
            error
          );
        }
      }
    };
    storeModifedToDoList();
    extractAndSetCategories();
  }, [toDoListItem, encryptionKey, extractAndSetCategories, noteId, toDoList]);

  useEffect(() => {
    //set the i18n key for the priority
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
    //Hook to set the ToDo item after the ToDoList has been loaded from memory
    const setToDoItemFromList = async () => {
      logAllDebugMessages(
        "ContainerEditTodo::setToDoItemFromList:: START LOADING" +
          JSON.stringify(toDoItemIdInt)
      );
      if (noteId && toDoItemIdInt !== null && !isNaN(toDoItemIdInt)) {
        try {
          if (toDoList) {
            if (toDoList.toDoItem) {
              const toDoItem = toDoList.toDoItem.find(
                (item) => item.toDoId === toDoItemId
              );
              if (toDoItem) {
                logAllDebugMessages(
                  "ContainerEditTodo::setToDoItemFromList::Set ToDoItem" +
                    JSON.stringify(toDoItem)
                );
                setToDoListItem(toDoItem);
              } else {
                logError(
                  "ContainerEditTodo::setToDoItemFromList::184::ToDoItem not found",
                  new Error()
                );
              }
            } else {
              logError(
                "ContainerEditTodo::setToDoItemFromList::190:: ToDoItem not exist",
                new Error()
              );
            }
          }
        } catch (error) {
          logError(
            "ContainerEditTodo::setToDoItemFromList::197:: Error loading and decrypting the note:",
            error
          );
        }
      }
    };

    setToDoItemFromList();
    extractAndSetCategories();
  }, [
    noteId,
    toDoItemIdInt,
    toDoList,
    encryptionKey,
    toDoItemId,
    extractAndSetCategories,
  ]);

  const updateToDoItem = <K extends keyof ToDoItem>(
    key: K,
    value: ToDoItem[K]
  ) => {
    logAllDebugMessages("ContainerEditTodo::updateToDoItem::SetToDoItem:start");
    if (value !== null && value !== undefined) {
      logAllDebugMessages(
        "ContainerEditTodo::updateToDoItem::SetToDoItem" + JSON.stringify(value)
      );
    }
    setToDoListItem({ ...toDoListItem, [key]: value });
  };

  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  if (trialAndToMuch) {
    return <ViewEditTodoTooMuch />;
  }

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
