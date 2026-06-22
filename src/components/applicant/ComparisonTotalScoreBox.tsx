import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonTotalScoreBoxProps {
  totalScore: number;
  percentileText: string;
}

export default function ComparisonTotalScoreBox({
  totalScore,
  percentileText
}: ComparisonTotalScoreBoxProps) {
  return (
    <div className={styles.scoreBox} id="comparison-total-score-box">
      <span className={styles.scoreLabel}>종합 적합도</span>
      <div className={styles.totalScore}>
        <span>{totalScore.toFixed(1)}</span>
        <span className={styles.scoreMax}>/100</span>
      </div>
      <span className={styles.percentileText}>{percentileText}</span>
    </div>
  );
}
