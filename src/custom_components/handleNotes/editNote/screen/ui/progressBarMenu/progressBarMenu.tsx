import React, { useState } from 'react';
import ProgressBar from '../progressBar/progressBar';
import { useTranslation } from 'react-i18next';

export interface ProgressBarCategoryMenuProps {
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
      overflow: "hidden",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    header: {
      padding: "16px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "18px",
    },
    content: {
      padding: "10px",
      display: isListVisible ? "block" : "none",
    },
    arrowIcon: {
      transition: "transform 0.3s ease",
      transform: isListVisible ? "rotate(-180deg)" : "rotate(0deg)",
    },
  };

  return (
    <div style={menuStyles.container} className="backgroundColorHighlight margin2vw">
      <div
        style={menuStyles.header}
        onClick={() => setIsListVisible(!isListVisible)}
      >
        {t("viewNote_progressBarsCategories_title")}
        <span style={menuStyles.arrowIcon} className="backgroundColorHighlight">▼</span>
      </div>
      <div style={menuStyles.content} className="backgroundColorHighlight">
        {categoriesList.map((category, index) => (
          <ProgressBar
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