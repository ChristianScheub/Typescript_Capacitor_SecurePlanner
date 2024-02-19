import React, { ButtonHTMLAttributes } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SlCalender } from "react-icons/sl";
import { ToDoItem } from "../../../types/ToDoItem.types";


interface DatePickerComponentProps {
  selectedDate: Date;
  onDateChange:  <K extends keyof ToDoItem>(key: K, value: ToDoItem[K]) => void;
}

const CustomInput = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ value, onClick }, ref) => (
    <div
      className="custom-datepicker-text"
      onClick={onClick}
      ref={ref}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        marginLeft: '5px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'currentColor',
        textDecoration: 'underline',
      }}
    >
      {value ? value : 'Datum wählen'}
      <SlCalender style={{marginLeft:'2vw'}}/>

    </div>
  )
);



const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ selectedDate, onDateChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={date => onDateChange("toDoEndDate",date as Date)}
      dateFormat="dd.MM.yyyy"
      customInput={<CustomInput />}

    />
  );
};

export default DatePickerComponent;
