import {
  encryptAndStore,
  decryptFromStorage,
} from "../../encryptionEngine/encryptionEngine";
import { ToDoList } from "../../../types/ToDoList.types";
import { ToDoItem } from "../../../types/ToDoItem.types";

const isJsonString = (str: string): boolean => {
  try {
    const data = JSON.parse(str);
    const test = data.content + data.title;
    return true;
  } catch (e) {
    return false;
  }
};

export const loadAllToDoLists = async (
  encryptionKey: string
): Promise<[ToDoList, string][]> => {
  try {
    const loadedNotes: [ToDoList, string][] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if(key === "securityLevel" || key === "welcomeScreenDone") continue;
      if (key) {
        try {
          const originalText = await decryptFromStorage(encryptionKey, key);
          if (originalText && isJsonString(originalText)) {
            const noteData = JSON.parse(originalText) as ToDoList;
            loadedNotes.push([noteData, key]);
          }
        } catch (error) {
          //console.error("Fehler beim Laden und Entschlüsseln der Liste:", error);
        }
      }
    }
    return loadedNotes;
  } catch (error) {
    //console.error("Fehler beim Laden und Entschlüsseln der Liste:", error);

    return [];
  }
};

export const loadToDoList = async (
  noteId: string,
  encryptionKey: string
): Promise<ToDoList | null> => {
  try {
    const decryptedContent = await decryptFromStorage(encryptionKey, noteId);
    const parsedToDoList: ToDoList = JSON.parse(decryptedContent);

    parsedToDoList.toDoItem.forEach((item, index) => {
      if (!item.toDoId) {
        item.toDoId = generateUniqueToDoId(parsedToDoList.toDoItem);
      }
    });

    return parsedToDoList;
  } catch (error) {
    //console.error("Fehler beim Laden und Entschlüsseln der Notiz:", error);
    return null;
  }
};

export const generateUniqueToDoId = (toDoList: ToDoItem[]): number => {
  let newId = 1;
  const existingIds = new Set(toDoList.map((item) => item.toDoId));
  while (existingIds.has(newId)) {
    newId++;
  }

  return newId;
};

export const saveToDoList = async (
  note: ToDoList,
  encryptionKey: string,
  noteId?: string
): Promise<void> => {
  try {
    const noteDataString = JSON.stringify(note);
    await encryptAndStore(
      noteDataString,
      encryptionKey,
      noteId || Date.now().toString()
    );
  } catch (error) {
    //console.error("Fehler beim Speichern der Notiz:", error);
  }
};
