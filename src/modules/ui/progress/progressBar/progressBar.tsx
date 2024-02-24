import React from "react";

interface ProgressBarProps {
  title: string;
  progress: number;
  infoText: string;
  active: boolean;
  onClick: () => void; 
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  progress,
  infoText,
  active,
  onClick
}) => {

  const getProgressColor = (progress: number): string => {
    if (progress > 75) {
      return "#27ae60";
    } else if (progress >= 65) {
      return "#27ae60";
    } else if (progress >= 40) {
      return "#e58e26";
    } else {
      return "#e58e26";
    }
  };

  const color = getProgressColor(progress);

  const progressBarContainerStyle: React.CSSProperties = {
    margin: "10px 0",
    padding: "5px",
    backgroundColor: "#333",
    borderRadius: "15px",
    position: "relative" as "relative",
  };

  const progressBarStyle: React.CSSProperties = {
    backgroundColor: "#e55039",
    height: "30px",
    borderRadius: "15px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative" as "relative",
    whiteSpace: "nowrap" as "nowrap",
  };

  const progressStyle: React.CSSProperties = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: color,
    borderRadius: "15px",
    transition: "width 0.5s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
  };

  const progressTextStyle: React.CSSProperties = {
    position: "absolute" as "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: "white",
    fontWeight: "bold",
    left: "5vw",
  };

  const tooltipStyle: React.CSSProperties = {
    position: "absolute" as "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "black",
    color: "white",
    padding: "8px",
    borderRadius: "6px",
    textAlign: "center",
    width: "80vw",
    whiteSpace: "normal" as "normal",
    zIndex: 3,
    display: active ? "block" : "none",
  };

  return (
    <div
      style={progressBarContainerStyle}
      onClick={onClick}
    >
      {active && <div style={tooltipStyle}>{infoText}</div>}
      <div style={progressBarStyle}>
        <div style={progressTextStyle}>
          {title}: {progress}%
        </div>
        <div style={progressStyle}></div>
      </div>
    </div>
  );
};

export default ProgressBar;