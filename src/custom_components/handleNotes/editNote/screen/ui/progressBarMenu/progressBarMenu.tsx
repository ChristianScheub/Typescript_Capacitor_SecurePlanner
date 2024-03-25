import React, { useState } from "react";
import ProgressBar from "../progressBar/progressBar";
import { useTranslation } from "react-i18next";
import './progressBarMenu.css';

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
  highlightedId,
}) => {
  const { t } = useTranslation();
  const [isListVisible, setIsListVisible] = useState(false);

  return (
    <div className="progressBarContainer backgroundColorHighlight margin2vw">
      <div
        className="progressBarHeader"
        onClick={() => setIsListVisible(!isListVisible)}
      >
        {t("viewNote_progressBarsCategories_title")}
        <span data-testid="progressBarArrowIcon" className={`progressBarArrowIcon ${isListVisible ? 'progressBarArrowIconUp' : 'progressBarArrowIconDown'} backgroundColorHighlight`}>
          ▼
        </span>
      </div>
      <div className={`progressBarContent backgroundColorHighlight ${isListVisible ? 'progressBarContentVisible' : ''}`}>
        {categoriesList.map((category) => (
          <ProgressBar
            key={category}
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