import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface AnalysisTabNavigationProps {
  activeTab: "individual" | "comparison";
  onTabChange: (tab: "individual" | "comparison") => void;
}

export default function AnalysisTabNavigation({
  activeTab,
  onTabChange
}: AnalysisTabNavigationProps) {
  return (
    <div className={styles.tabNavigation} id="analysis-tab-navigation">
      <button
        type="button"
        id="tab-individual-btn"
        className={`${styles.tabButton} ${activeTab === "individual" ? styles.activeTab : ""}`}
        onClick={() => onTabChange("individual")}
      >
        개별 분석
      </button>
      <button
        type="button"
        id="tab-comparison-btn"
        className={`${styles.tabButton} ${activeTab === "comparison" ? styles.activeTab : ""}`}
        onClick={() => onTabChange("comparison")}
      >
        지원자 비교
      </button>
    </div>
  );
}
