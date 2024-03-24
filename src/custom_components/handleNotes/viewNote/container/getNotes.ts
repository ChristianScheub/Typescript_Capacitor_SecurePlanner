import { useState, useEffect } from "react";
import { Location } from "react-router-dom";
import { ToDoListWithKey } from "../../../types/ToDoListKey.types";
import toDoListService from "../../../services/toDoListHandler/toDoListHandler";
import { ToDoItem } from "../../../types/ToDoItem.types";
import { logAllDebugMessages } from "../../../services/logger/loggerFeatureFlags";
import { ToDoList } from "../../../types/ToDoList.types";

const useAllNotes = (
  encryptionKey: string,
  searchQuery: string,
  location: Location
): ToDoListWithKey[] => {
  const [toDoLists, setToDoLists] = useState<ToDoListWithKey[]>([]);

  useEffect(() => {
    const loadAndDecryptNotes = async () => {
      const loadedNotes = await toDoListService.loadAllToDoLists(encryptionKey);
      if (loadedNotes) {
        const filteredNotes = filterNotes2(loadedNotes, searchQuery);
        const sortedNotes = sortNotes(filteredNotes);
        setToDoLists(sortedNotes);
      }
    };
    loadAndDecryptNotes();
  }, [encryptionKey, searchQuery, location]);

  return toDoLists;
};

const sortNotes = (notes: ToDoListWithKey[]): ToDoListWithKey[] => {
  return notes.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
};


const filterNotes2 = (
  loadedNotes: [ToDoList, string][],
  searchQuery: string
) => {
  let filteredNotes = loadedNotes
    .map(([toDoList, key]) => ({ toDoList, key }))
    .filter(({ toDoList }) => {
      logAllDebugMessages("loadingNotes");
      logAllDebugMessages(loadedNotes.toString());
      return (
        toDoList.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        toDoList.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        toDoList.toDoItem.some(
          (item: ToDoItem) =>
            item.toDoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.toDoText.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  return filteredNotes;
};

export default useAllNotes;