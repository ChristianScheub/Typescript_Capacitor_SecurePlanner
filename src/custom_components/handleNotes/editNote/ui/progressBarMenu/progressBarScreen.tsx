import React, { useState } from "react";
import ProgressBar from "../progressBar/progressBar";
import ProgressBarCategoryMenu from "./progressBarMenu";
import { useTranslation } from "react-i18next";

interface ProgressBarScreenProps {
  progressOverall: number;
  progressToday: number;
  progressNext7Days: number;
  progressHighPriority: number;
  categoriesList: string[];
  getCategoryProgress: (category: string) => number;
  handleFilterList: (id: string) => void;
}

const ProgressBarScreen: React.FC<ProgressBarScreenProps> = ({
  progressOverall,
  progressToday,
  progressNext7Days,
  progressHighPriority,
  categoriesList,
  getCategoryProgress,
  handleFilterList
}) => {
  const { t } = useTranslation();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>("total");


  const handleProgressBarClick = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
    setHighlightedId(id);
    handleFilterList(id);
  };

  return (
    <>
      <ProgressBar
        title={t("editNote_progressBar_Total")}
        progress={progressOverall}
        infoText={t("editNote_progressBar_Total_Explanation", {
          count: progressOverall,
        })}
        active={activeTooltip === "total"}
        onClick={() => handleProgressBarClick("total")}
        highlighted={highlightedId === "total"}
      />
      <ProgressBar
        title={t("editNote_progressBar_Today")}
        progress={progressToday}
        infoText={t("editNote_progressBar_Today_Explanation", {
          count: progressToday,
        })}
        active={activeTooltip === "today"}
        onClick={() => handleProgressBarClick("today")}
        highlighted={highlightedId === "today"}
      />
      <ProgressBar
        title={t("editNote_progressBar_7Days")}
        progress={progressNext7Days}
        infoText={t("editNote_progressBar_7Days_Explanation", {
          count: progressNext7Days,
        })}
        active={activeTooltip === "7Days"}
        onClick={() => handleProgressBarClick("7Days")}
        highlighted={highlightedId === "7Days"}
      />
      <ProgressBar
        title={t("editNote_progressBar_Priority")}
        progress={progressHighPriority}
        infoText={t("editNote_progressBar_Priority_Explanation", {
          count: progressHighPriority,
        })}
        active={activeTooltip === "Priority"}
        onClick={() => handleProgressBarClick("Priority")}
        highlighted={highlightedId === "Priority"}
      />

      <ProgressBarCategoryMenu
        categoriesList={categoriesList}
        getCategoryProgress={getCategoryProgress}
        handleProgressBarClick={handleProgressBarClick}
        activeTooltip={activeTooltip}
        highlightedId={highlightedId}
      />
    </>
  );
};

export default ProgressBarScreen;