import React from "react";
import SecurityLevel from "../../../../../enums/SecurityLevel.enum";

interface SecurityOptionProps {
  label: string;
  value: SecurityLevel;
  selectedValue: SecurityLevel;
  onChange: (value: SecurityLevel) => void;
}

const SecurityOption: React.FC<SecurityOptionProps> = ({
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

export default SecurityOption;