import React from 'react';
import { useNavigate } from 'react-router-dom';
import getAllNotes from './getNotes';
import View_ViewNote from './screen-viewNote';
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

 


  return (
    <View_ViewNote
      notes={notes}
      onNavigateToEdit={handleNavigateToEdit}
      onNavigateToCreateNew={handleNavigateToCreateNew}
      calculateProgress={calculateProgress}
      calculateProgressDays={calculateProgressDays}
    />
  );
};

export default Container_ViewNote;