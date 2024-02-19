import {
  encryptAndStore,
  decryptFromStorage,
} from "../encryptionEngine/encryptionEngine";
import { ToDoList } from "../../types/ToDoList.types";
import { Priority } from "../../handleNotes/editToDoElement/priorityIndicator/priority.enum";

export interface ToDoListService {
  loadToDoList: (
    noteId: string,
    encryptionKey: string
  ) => Promise<ToDoList | null>;
  saveToDoList: (
    note: ToDoList,
    encryptionKey: string,
    noteId?: string
  ) => Promise<void>;
  sortToDoList: (toDoList: ToDoList) => ToDoList;
}

const toDoListService: ToDoListService = {
  loadToDoList: async (noteId: string, encryptionKey: string) => {
    try {
      const decryptedContent = await decryptFromStorage(encryptionKey, noteId);
      return JSON.parse(decryptedContent) as ToDoList;
    } catch (error) {
      console.error("Fehler beim Laden und Entschlüsseln der Notiz:", error);
      return null;
    }
  },

  saveToDoList: async (
    note: ToDoList,
    encryptionKey: string,
    noteId?: string
  ) => {
    try {
      const noteDataString = JSON.stringify(note);
      await encryptAndStore(
        noteDataString,
        encryptionKey,
        noteId || Date.now().toString()
      );
    } catch (error) {
      console.error("Fehler beim Speichern der Notiz:", error);
    }
  },

  sortToDoList: (toDoList: ToDoList) => {
    return {
      ...toDoList,
      toDoItem: [...toDoList.toDoItem].sort((a, b) => {
        if (a.toDoDone && !b.toDoDone) {
          return 1; // Verschiebe erledigte To-Dos nach hinten
        } else if (!a.toDoDone && b.toDoDone) {
          return -1; // Verschiebe nicht-erledigte To-Dos nach vorne
        } else if (
          !a.toDoDone &&
          !b.toDoDone &&
          a.toDoPriority === Priority.Highest &&
          b.toDoPriority !== Priority.Highest
        ) {
          return -1; // Nicht erledigte To-Dos mit höchster Priorität nach vorne
        } else if (
          !a.toDoDone &&
          !b.toDoDone &&
          b.toDoPriority === Priority.Highest &&
          a.toDoPriority !== Priority.Highest
        ) {
          return 1; // Nicht erledigte To-Dos mit höchster Priorität nach vorne
        } else if (a.toDoDone && b.toDoDone) {
          // Sortiere erledigte To-Dos nach dem Enddatum (neuestes zuerst)
          return (
            new Date(b.toDoEndDate).getTime() -
            new Date(a.toDoEndDate).getTime()
          );
        } else {
          // Sortiere nach dem Enddatum
          return (
            new Date(a.toDoEndDate).getTime() -
            new Date(b.toDoEndDate).getTime()
          );
        }
      }),
    };
  },
};

export default toDoListService;
