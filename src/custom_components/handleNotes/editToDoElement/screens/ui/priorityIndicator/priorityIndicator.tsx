import React, { useState, useEffect } from "react";
import { Priority } from "../../../../../enums/priority.enum";
import { useTranslation } from "react-i18next";
import { ToDoItem } from "../../../../../types/ToDoItem.types";

const priorityColors: Record<Priority, string> = {
  [Priority.Low]: "#9290C3",
  [Priority.Middle]: "#535C91",
  [Priority.High]: "#1B1A55",
  [Priority.Highest]: "#070F2B",
};

interface PrioritySliderProps {
  selectedPriority: Priority;
  onPriorityChange: <K extends keyof ToDoItem>(
    key: K,
    value: ToDoItem[K]
  ) => void;
}

const PrioritySlider: React.FC<PrioritySliderProps> = ({
  selectedPriority,
  onPriorityChange,
}) => {
  const priorityToValue: Record<Priority, number> = {
    [Priority.Low]: 10,
    [Priority.Middle]: 30,
    [Priority.High]: 50,
    [Priority.Highest]: 70,
  };
  const [sliderValue, setSliderValue] = useState(
    priorityToValue[selectedPriority]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    const newPriority = Object.keys(priorityToValue).find(
      (key) => priorityToValue[key as Priority] === newValue
    ) as Priority;

    if (newPriority) {
      setSliderValue(newValue);
      onPriorityChange("toDoPriority", newPriority);
    }
  };

  useEffect(() => {
    setSliderValue(priorityToValue[selectedPriority]);
  }, [selectedPriority]);

  const widthEachLabel = 80 / Object.keys(priorityColors).length + 2;
  const { t } = useTranslation();

  return (
    <div style={{ position: "relative", padding: "2vw" }}>
      <input
        type="range"
        min="0"
        max="80"
        value={sliderValue}
        step="10"
        onChange={handleChange}
        className="width100"
        style={{
          cursor: "pointer",
          background: `linear-gradient(to right, 
            ${priorityColors.Low} 0% 25%,
            ${priorityColors.Middle} 25% 50%,
            ${priorityColors.High} 50% 75%,
            ${priorityColors.Highest} 75% 100%)`,
          height: "13vw",
          borderRadius: "10px",
          outline: "none",
          WebkitAppearance: "none",
          appearance: "none",
          position: "relative",
        }}
      />
      <div
        className="colorWhite width100"
        style={{
          position: "absolute",
          top: "9vw",
          display: "flex",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: `${widthEachLabel / 1.8}%`,
            transform: "translateX(-50%)",
          }}
        >
          {t("editToDoElement_Low")}
        </span>
        <span
          style={{
            position: "absolute",
            left: `${widthEachLabel * 1.6}%`,
            transform: "translateX(-50%)",
          }}
        >
          {t("editToDoElement_Middle")}
        </span>
        <span
          style={{
            position: "absolute",
            left: `${widthEachLabel * 2.7}%`,
            transform: "translateX(-50%)",
          }}
        >
          {t("editToDoElement_High")}
        </span>
        <span
          style={{
            position: "absolute",
            left: `${widthEachLabel * 3.8}%`,
            transform: "translateX(-50%)",
          }}
        >
          {t("editToDoElement_Highest")}
        </span>
      </div>
    </div>
  );
};

export default PrioritySlider;