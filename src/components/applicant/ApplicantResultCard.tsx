import React from "react";
import ResumeSummaryToggle from "./ResumeSummaryToggle";
import { ApplicantDetail } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface ApplicantResultCardProps {
  applicant: ApplicantDetail;
}

export default function ApplicantResultCard({ applicant }: ApplicantResultCardProps) {
  return (
    <div className={styles.resultCard} id="applicant-result-detail-card">
      <div className={styles.resultHeader}>
        <div className={styles.resultTitleWrapper}>
          <span className={styles.resultTitle}>
            {applicant.masked_code} 분석 결과
          </span>
          <span className={styles.fitBadge} id="fit-label-badge">
            {applicant.fitLabel} 일치
          </span>
        </div>
        
        {/* 이력서 요약 보기 토글 버튼 노출 */}
        <ResumeSummaryToggle summary={applicant.resume_summary} />
      </div>

      <div className={styles.fitScoreText} id="overall-fit-score-statement">
        {applicant.masked_code} 지원자는 공고에{" "}
        <span className="text-[#6D5DFC] underline underline-offset-4 decoration-2 font-black font-mono">
          {applicant.score.total_score.toFixed(1)}%
        </span>{" "}
        적합한 지원자입니다.
      </div>
    </div>
  );
}
