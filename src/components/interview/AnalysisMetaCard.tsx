import React from "react";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

interface AnalysisMetaCardProps {
  jobPostingTitle: string;
  criteriaVersion: string;
  generatedAt: string;
}

export default function AnalysisMetaCard({
  jobPostingTitle,
  criteriaVersion,
  generatedAt
}: AnalysisMetaCardProps) {
  return (
    <div className={styles.metaCard} id="analysis-meta-card">
      {/* 1. 분석 공고 */}
      <div className={styles.metaItem} id="meta-job-posting">
        <span className={styles.metaLabel}>분석 공고</span>
        <span className={styles.metaValue}>{jobPostingTitle || "백엔드 개발자 (경력 3년 이상)"}</span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-[#EAECF0]"></div>

      {/* 2. 질문 생성 시간 */}
      <div className={styles.metaItem} id="meta-generated-at">
        <span className={styles.metaLabel}>질문 생성 시간</span>
        <span className={styles.metaValue}>{generatedAt || "2024.05.20 15:24"}</span>
      </div>
    </div>
  );
}
