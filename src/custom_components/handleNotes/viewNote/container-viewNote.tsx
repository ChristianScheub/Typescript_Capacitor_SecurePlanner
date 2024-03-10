import React from 'react';
import { useNavigate } from 'react-router-dom';
import getAllNotes from './getNotes';
import ViewViewNote from './screen-viewNote';
import { useLocation } from 'react-router-dom';
import { ToDoList } from "../../types/ToDoList.types";
import ProgressToDoListService from "../../services/progressToDoListService/progressToDoListService";


interface Container_ViewNoteProps {
  encryptionKey: string;
  searchQuery: string;
}

const Container_ViewNote: React.FC<Container_ViewNoteProps> = ({ encryptionKey, searchQuery }) => {
  const location = useLocation();
  const notes = getAllNotes(encryptionKey, searchQuery, location);
  //console.log(notes);

  const navigate = useNavigate();

  const handleNavigateToEdit = (noteId: string) => {
    navigate(`/edit/${noteId}`);
  };

  const handleNavigateToCreateNew = () => {
    navigate(`/edit/${Date.now().toString()}`);
  };

  const calculateProgress = (items: ToDoList) => {
    return ProgressToDoListService.calculateProgress(
      items.toDoItem,
      (item) => item.toDoDone
    )};


    const calculateProgressDays = (items: ToDoList,days: number) => {
      return ProgressToDoListService.calculateProgressForNextNDays(items.toDoItem, days)
    };

    const breakText = (text: string, maxLength: number): string => {
      let brokenText = "";
      let currentIndex = 0;
  
      while (currentIndex < text.length) {
        let spaceIndex = currentIndex + maxLength;
        if (spaceIndex < text.length && text[spaceIndex] !== " ") {
          while (spaceIndex < text.length && text[spaceIndex] !== " ") {
            spaceIndex++;
          }
        }
        if (spaceIndex === text.length) {
          spaceIndex = currentIndex + maxLength;
        }
        brokenText += text.substring(currentIndex, spaceIndex) + " ";
        currentIndex = spaceIndex;
      }
      return brokenText.trim();
    };

    const truncateText = (text: string, maxLength: number): string => {
      if (text.length <= maxLength) return text;
      return text.substr(0, maxLength) + "...";
    };

  return (
    <ViewViewNote
      notes={notes}
      onNavigateToEdit={handleNavigateToEdit}
      onNavigateToCreateNew={handleNavigateToCreateNew}
      calculateProgress={calculateProgress}
      calculateProgressDays={calculateProgressDays}
      breakText={breakText}
      truncateText={truncateText}
    />
  );
};

export default Container_ViewNote;