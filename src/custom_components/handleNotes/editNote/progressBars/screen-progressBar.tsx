interface ProgressBarProps {
    title: string;
    progress: number;
  }
  
  const ProgressBar: React.FC<ProgressBarProps> = ({
    title,
    progress,
  }) => {
    const getProgressColor = (progress: number): string => {
      if (progress > 75) {
        return '#27ae60';
      } else if (progress >= 60) {
        return '#27ae60';
      } else if (progress >= 40) {
        return '#e58e26';
      } else {
        return '#e58e26';
      };
    };
  
    const color = getProgressColor(progress);
  
    const progressBarContainerStyle = {
      margin: "10px 0",
      padding: "5px",
      backgroundColor: "#333",
      borderRadius: "15px",
    };
  
    const progressBarStyle = {
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
  
    const progressStyle = {
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
  
    const progressTextStyle = {
      position: "absolute" as "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      color: "white",
      fontWeight: "bold",
      left: "5vw"
    };
  
    return (
      <div style={progressBarContainerStyle}>
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