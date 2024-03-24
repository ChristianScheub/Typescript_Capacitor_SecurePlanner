import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isEqual } from "../../../services/equals/equals";
import EditNoteView from "../screen/screen-editNote";
import { ToDoList } from "../../../types/ToDoList.types";
import { useTranslation } from "react-i18next";
import { Priority } from "../../../enums/priority.enum";
import ToDoListService from "../../../services/toDoListHandler/toDoListHandler";
import ProgressToDoListService from "../../../services/progressToDoListService/progressToDoListService";
import ContainerEditTodo from "../../editToDoElement/container/container-editToDo";
import { formatDate } from "../../../services/formatDate/formatDate";
import {
  logError,
  logAllDebugMessages,
} from "../../../services/logger/loggerFeatureFlags";

interface ContainerEditNoteProps {
  encryptionKey: string;
}

const ContainerEditNote: React.FC<ContainerEditNoteProps> = ({
  encryptionKey,
}) => {
  const { noteId } = useParams<{ noteId?: string }>();
  const { t } = useTranslation();
  const [toDo_toEdit_id, setToDo_toEdit_id] = useState<number>();
  const [showToDoEdit, setShowToDoEdit] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("total");

  //The Keys which should be ignored and maybe set already (i18nextLng, capuid are web only so not smartphone relevant)
  const ignoredKeys = [
    "welcomeScreenDone",
    "i18nextLng",
    "_capuid",
    "fingerprintSet",
    "securityLevelReallyLow",
    "securityLevel",
    "justOnePassword2",
    "justOnePassword",
  ];

  const relevantItemCount = Object.keys(localStorage).reduce((count, key) => {
    return ignoredKeys.includes(key) ? count : count + 1;
  }, 0);

  const isNewPath = relevantItemCount < 1;

  //Whole ToDo List without any filters
  const [toDoList, setToDoList] = useState<ToDoList>({
    title: "",
    date: new Date(),
    content: "",
    toDoItem: [],
  });

  //ToDo List with filters applied
  const [shownToDoList, setShownToDoList] = useState<ToDoList>({
    title: "",
    date: new Date(),
    content: "",
    toDoItem: [],
  });

  //List of all categories in the ToDo List
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

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
            setCategoriesList(ToDoListService.getCategories(toDoList));
            const sortedToDoList = ToDoListService.sortToDoList(toDoList);
            if (!isEqual(sortedToDoList.toDoItem, toDoList.toDoItem)) {
              setToDoList(sortedToDoList);
            }
            setShownToDoList(toDoList);
          }
        } catch (error) {
          logError("Fehler beim Laden und Entschlüsseln der Notiz", error);
        }
      }
    };

    loadAndDecryptNote();
  }, [noteId, encryptionKey, showToDoEdit]);

  useEffect(() => {
    const storeNotes = async () => {
      logAllDebugMessages("triggerStore");
      logAllDebugMessages(toDoList.toString());
      if (
        noteId &&
        (toDoList.title !== "" ||
          toDoList.content !== "" ||
          toDoList.toDoItem.length > 0)
      ) {
        try {
          await ToDoListService.saveToDoList(toDoList, encryptionKey, noteId);
          handleFilterList(currentFilter);
          setCategoriesList(ToDoListService.getCategories(toDoList));
        } catch (error) {
          logError("Fehler beim Speichern der Notiz", error);
        }
      }
    };
    storeNotes();
  }, [toDoList]);

  const progressOverall = ProgressToDoListService.calculateProgress(
    toDoList.toDoItem,
    (item) => item.toDoDone
  );
  const progressToday = ProgressToDoListService.calculateProgressForNextNDays(
    toDoList.toDoItem,
    0
  );

  const progressNext7Days =
    ProgressToDoListService.calculateProgressForNextNDays(toDoList.toDoItem, 7);

  const progressHighPriority = ProgressToDoListService.calculateProgress(
    toDoList.toDoItem,
    (item) =>
      item.toDoDone &&
      [Priority.High, Priority.Highest].includes(item.toDoPriority),
    (item) => [Priority.High, Priority.Highest].includes(item.toDoPriority)
  );

  const calculateCategoryProgress = (category: string): number => {
    return ProgressToDoListService.calculateProgressForCategory(
      toDoList.toDoItem,
      category
    );
  };

  const handleEditToDo = (toEdit_toDoId: number) => {
    setToDo_toEdit_id(toEdit_toDoId);
    setShowToDoEdit(true);
  };

  const updateToDoList = async <K extends keyof ToDoList>(
    key: K,
    value: ToDoList[K]
  ) => {
    logAllDebugMessages("updateToDoList");
    logAllDebugMessages(value.toString());
    await setToDoList({ ...toDoList, [key]: value });
    logAllDebugMessages(toDoList.toString());
  };

  function handleAdd() {
    const count = ToDoListService.generateUniqueToDoId(toDoList.toDoItem);
    setToDo_toEdit_id(count);
    setShowToDoEdit(true);
  }

  const handleDeleteToDo = (event: React.MouseEvent, toDoId: number) => {
    event.preventDefault();
    if (window.confirm(t("editNote_ToDoDeleteConfirm"))) {
      const updatedToDoItems = toDoList.toDoItem.filter(
        (item) => item.toDoId !== toDoId
      );

      setToDoList({
        ...toDoList,
        toDoItem: updatedToDoItems,
      });
    }
  };

  const handleDoneToDo = (event: React.MouseEvent, toDoId: number) => {
    event.preventDefault();

    const updatedToDoItems = toDoList.toDoItem.map((item) => {
      if (item.toDoId === toDoId) {
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

  const handleFilterList = async (filter: string) => {
    logAllDebugMessages("TRIGGER FILTER with" + filter);
    await setCurrentFilter(filter);

    if (filter === "total") {
      return setShownToDoList(ToDoListService.sortToDoList(toDoList));
    } else if (filter === "today") {
      return setShownToDoList(
        ToDoListService.sortToDoList(
          ToDoListService.filterToDoListByNextXDays(toDoList, 0)
        )
      );
    } else if (filter === "7Days") {
      return setShownToDoList(
        ToDoListService.sortToDoList(
          ToDoListService.filterToDoListByNextXDays(toDoList, 7)
        )
      );
    } else if (filter === "Priority") {
      return setShownToDoList(
        ToDoListService.sortToDoList(
          ToDoListService.filterToDoListByPriority(toDoList, [
            Priority.High,
            Priority.Highest,
          ])
        )
      );
    } else {
      return setShownToDoList(
        ToDoListService.filterToDoListByCategory(toDoList, filter)
      );
    }
  };

  const ContainerEditToDoWithValue = (
    <ContainerEditTodo
      encryptionKey={encryptionKey}
      noteId={noteId}
      toDoItemId={toDo_toEdit_id}
    />
  );

  return (
    <EditNoteView
      toDoList={shownToDoList}
      isNewPath={isNewPath}
      categoriesList={categoriesList}
      getCategoryProgress={calculateCategoryProgress}
      progressOverall={progressOverall}
      progressToday={progressToday}
      progressHighPriority={progressHighPriority}
      progressNext7Days={progressNext7Days}
      getPriorityText={getPriorityText}
      handleEdit={handleEditToDo}
      handleAdd={handleAdd}
      formatDate={formatDate}
      updateToDoList={updateToDoList}
      handleDeleteToDo={handleDeleteToDo}
      handleDoneToDo={handleDoneToDo}
      CustomComponent={() => ContainerEditToDoWithValue}
      showToDoEdit={showToDoEdit}
      onHandleToDoSave={() => setShowToDoEdit(false)}
      handleFilterList={handleFilterList}
    />
  );
};

export default ContainerEditNote;
