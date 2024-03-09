import React from "react";
import "./progressDots.css";

interface ProgressDotsProps {
  steps: number;
  currentStep: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ steps, currentStep }) => {
  return (
    <footer>
      <div className="progress-dots">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            className={`dot${index === currentStep ? " active" : ""}`}
          />
        ))}
      </div>
    </footer>
  );
};

export default ProgressDots;
