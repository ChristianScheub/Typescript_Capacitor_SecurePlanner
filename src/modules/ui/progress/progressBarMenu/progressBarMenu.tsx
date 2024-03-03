import React, { useState } from 'react';
import ProgressBar from '../progressBar/progressBar';
import { useTranslation } from 'react-i18next';

interface ProgressBarCategoryMenuProps {
  categoriesList: string[];
  getCategoryProgress: (category: string) => number;
  handleProgressBarClick: (id: string) => void;
  activeTooltip: string | null;
  highlightedId: string | null;
}

const ProgressBarCategoryMenu: React.FC<ProgressBarCategoryMenuProps> = ({
  categoriesList,
  getCategoryProgress,
  handleProgressBarClick,
  activeTooltip,
  highlightedId
}) => {
  const { t } = useTranslation();
  const [isListVisible, setIsListVisible] = useState(false);

  const menuStyles = {
    container: {
      margin: "2vw",
      overflow: "hidden",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#49454F",
    },
    header: {
      backgroundColor: "#49454F",
      padding: "16px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "18px",
    },
    content: {
      background: "#49454F",
      padding: "10px",
      display: isListVisible ? "block" : "none",
    },
    arrowIcon: {
      transition: "transform 0.3s ease",
      transform: isListVisible ? "rotate(-180deg)" : "rotate(0deg)",
    },
  };

  return (
    <div style={menuStyles.container}>
      <div
        style={menuStyles.header}
        onClick={() => setIsListVisible(!isListVisible)}
      >
        {t("viewNote_progressBarsCategories_title")}
        <span style={menuStyles.arrowIcon}>▼</span>
      </div>
      <div style={menuStyles.content}>
        {categoriesList.map((category, index) => (
          <ProgressBar
            key={index}
            title={category}
            progress={getCategoryProgress(category)}
            infoText={`NO`}
            active={activeTooltip === category}
            onClick={() => handleProgressBarClick(category)}
            highlighted={highlightedId === category}

          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBarCategoryMenu;