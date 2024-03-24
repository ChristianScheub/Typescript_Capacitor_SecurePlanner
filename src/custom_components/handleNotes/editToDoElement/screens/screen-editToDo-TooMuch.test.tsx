import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewEditTodoTooMuch from './screen-editToDo-TooMuch';

describe('ViewEditTodoTooMuch', () => {
  test('is rendered correctly with the expected texts', () => {
    render(<ViewEditTodoTooMuch />);
    
    expect(screen.getByText('Sorry!')).toBeInTheDocument();
    expect(screen.getByText('You can just create 4 ToDo Items in the trial version! To edit the other delete one ToDo Item!')).toBeInTheDocument();
  });
});