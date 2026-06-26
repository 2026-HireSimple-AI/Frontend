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
      <div className={styles.resultHeader} style={{ flexWrap: "wrap", gap: "0.5rem" }}>
        <div className={styles.resultTitleWrapper}>
          <span className={styles.resultTitle}>
            {applicant.real_name || applicant.masked_code} 분석 결과
          </span>
          <span className={styles.fitBadge} id="fit-label-badge">
            {applicant.fitLabel} 일치
          </span>
        </div>
        
        {/* 이력서 요약 보기 토글 버튼 노출 */}
        <ResumeSummaryToggle summary={applicant.resume_summary} />
      </div>
      <div className={styles.fitScoreText} id="overall-fit-score-statement">
        <strong>{applicant.real_name || applicant.masked_code}</strong>님과 이 포지션의 매칭률은{" "}
        <span
          style={{
            color: "#6D5DFC",
            fontWeight: 700,
            fontSize: "1.15em",
            letterSpacing: "-0.01em",
            fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
          }}
        >
          {applicant.score.total_score.toFixed(1)}%
        </span>
        입니다.
      </div>
    </div>
  );
}
