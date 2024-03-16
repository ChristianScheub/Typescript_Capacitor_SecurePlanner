import React from "react";

export interface ProgressBarProps {
  title: string;
  progress: number;
  infoText: string;
  active: boolean;
  onClick: () => void; 
  highlighted?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  progress,
  infoText,
  active,
  onClick,
  highlighted = false,
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
    borderRadius: "15px",
    position: "relative" as "relative",
    border: highlighted ? "3px solid #3498db" : "none", 
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
    fontWeight: "bold",
  };

  const progressTextStyle: React.CSSProperties = {
    position: "absolute" as "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontWeight: "bold",
    left: "5vw",
  };

  const tooltipStyle: React.CSSProperties = {
    position: "absolute" as "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
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
      className="progressBarContainerStyle"
      onClick={onClick}
    >
      {active && infoText!=="NO" && <div className="backgroundColorOnGrey" style={tooltipStyle}>{infoText}</div>}
      <div className="backgroundColorHighlight" style={progressBarStyle}>
        <div style={progressTextStyle} className="colorWhite">
          {title}: {progress}%
        </div>
        <div className="colorWhite"style={progressStyle}></div>
      </div>
    </div>
  );
};

export default ProgressBar;