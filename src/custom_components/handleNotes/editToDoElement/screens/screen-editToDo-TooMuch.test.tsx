import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewEditTodo_TooMuch from './screen-editToDo-TooMuch';

describe('ViewEditTodo_TooMuch', () => {
  test('wird korrekt gerendert mit den erwarteten Texten', () => {
    render(<ViewEditTodo_TooMuch />);
    
    expect(screen.getByText('Sorry!')).toBeInTheDocument();
    expect(screen.getByText('You can just create 4 ToDo Items in the trial version! To edit the other delete one ToDo Item!')).toBeInTheDocument();
  });
});