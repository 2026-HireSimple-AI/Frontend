import React from "react";
import ApplicantAnalysisHoverTrigger from "./ApplicantAnalysisHoverTrigger";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface PageTitleSectionProps {
  jobTitle: string;
}

export default function PageTitleSection({ jobTitle }: PageTitleSectionProps) {
  return (
    <div className={styles.titleSectionContainer} id="page-title-section">
      <div className={styles.pageTitleRow}>
        <h1 className={styles.pageTitle}>지원자 분석</h1>
        <ApplicantAnalysisHoverTrigger />
      </div>
      <p className={styles.pageDescription}>
        생성된 평가 기준으로 모든 지원자의 적합도를 분석했습니다.
      </p>
    </div>
  );
}
