import React from "react";

interface RadioOptionProps {
  label: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const StringRadioOption: React.FC<RadioOptionProps> = ({
  label,
  value,
  selectedValue,
  onChange,
}) => {
  const isSelected = value === selectedValue;
  const handleClick = () => {
    onChange(value);
  };

  return (
    <div
      className={`option ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <table>
        <tbody>
        <tr>
          <td>
            <div className={`radio ${isSelected ? "selected" : ""}`} />
          </td>
          <td>
            <span>{label}</span>
          </td>
        </tr>
        </tbody>
      </table>
      <br />
      <br />
    </div>
  );
};

export default StringRadioOption;