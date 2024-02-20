import React from 'react';

interface ProgressCircleProps {
  title: string;
  progress: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ title, progress }) => {
  const getProgressColor = (progress: number): string => {
    if (progress > 75) {
      return "#27ae60";
    } else if (progress >= 65) {
      return "#27ae60";
    } else if (progress >= 40) {
      return "#e58e26";
    } else {
      return "#e55039";
    }
  };

  const color = getProgressColor(progress);
  const radius = 40;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={radius * 2} height={radius * 2}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke="#333"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="40%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="13"
        >
          {title}
          <tspan dy="1.5em" x="50%">
            {progress}%
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default ProgressCircle;
