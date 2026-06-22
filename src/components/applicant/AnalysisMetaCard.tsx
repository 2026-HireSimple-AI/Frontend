import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface AnalysisMetaCardProps {
  jobTitle: string;
  completedAt?: string;
}

export default function AnalysisMetaCard({ 
  jobTitle, 
  completedAt = "2026.06.21 14:00" 
}: AnalysisMetaCardProps) {
  return (
    <div className={styles.metaCard} id="analysis-meta-card">
      <div className={styles.metaItem}>
        <span className={styles.metaLabel}>분석 공고</span>
        <span className={styles.metaValue}>{jobTitle}</span>
      </div>
      <div className={styles.metaItem} style={{ borderLeft: "1px solid #E6EAF0", paddingLeft: "1.5rem" }}>
        <span className={styles.metaLabel}>분석 완료</span>
        <span className={styles.metaValue}>{completedAt}</span>
      </div>
    </div>
  );
}
