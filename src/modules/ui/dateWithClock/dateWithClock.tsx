import React from 'react';
import { FaRegClock } from "react-icons/fa";
import { Form } from "react-bootstrap";

interface DateDisplayProps {
  date: string;
}

const DateDisplayWithClock: React.FC<DateDisplayProps> = ({ date }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
        paddingBottom: "2rem",
        borderBottom: "1px solid #ffffff50",
      }}
    >
      <FaRegClock
        style={{
          color: "#CBCBCD",
          marginRight: "0.5rem",
          marginLeft: "1rem",
        }}
      />
      <Form.Text style={{ color: "#CBCBCD", fontSize: "1rem" }}>
        {date}
      </Form.Text>
    </div>
  );
};

export default DateDisplayWithClock;
