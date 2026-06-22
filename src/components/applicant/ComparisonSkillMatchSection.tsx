import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonSkillMatchSectionProps {
  skillScore: number;
}

export default function ComparisonSkillMatchSection({
  skillScore
}: ComparisonSkillMatchSectionProps) {
  // 스코어별 파란색/초록색 바 테마 부여
  const barColor = skillScore >= 80 ? "bg-[#3B82F6]" : "bg-[#22C55E]";

  return (
    <div className={styles.skillMatchSection} id="comparison-skill-match-section">
      <div className="flex items-center justify-between">
        <span className={styles.skillMatchTitle}>기술 스택 적합도</span>
        <span className={styles.skillMatchScore}>{skillScore}%</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${barColor}`}
          style={{ width: `${skillScore}%` }}
        />
      </div>
    </div>
  );
}
