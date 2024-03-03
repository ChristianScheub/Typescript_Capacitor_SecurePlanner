import { useState, useEffect } from "react";
import { Location } from "react-router-dom";
import { ToDoListWithKey } from "../../types/ToDoListKey.types";
import toDoListService from "../../services/toDoListHandler/toDoListHandler";
import { ToDoItem } from "../../types/ToDoItem.types";

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
        const filteredNotes = loadedNotes
          .map(([toDoList, key]) => ({ toDoList, key }))
          .filter(({ toDoList }) => {
            return (
              toDoList.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              toDoList.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              toDoList.toDoItem.some((item: ToDoItem) =>
                item.toDoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.toDoText.toLowerCase().includes(searchQuery.toLowerCase())
              )
            );
          });
        filteredNotes.sort((a, b) => {
          if (a.key < b.key) return -1;
          if (a.key > b.key) return 1;
          return 0;
        });
        setToDoLists(filteredNotes);
      }
    };
    loadAndDecryptNotes();
  }, [encryptionKey, searchQuery, location]);

  return toDoLists;
};

export default useAllNotes;
