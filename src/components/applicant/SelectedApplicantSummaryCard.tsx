import React from "react";
import { ApplicantDetail } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface SelectedApplicantSummaryCardProps {
  selectedApplicants: Array<ApplicantDetail & { rank_no?: number; percentileText?: string }>;
}

export default function SelectedApplicantSummaryCard({
  selectedApplicants = []
}: SelectedApplicantSummaryCardProps) {
  // 배지 별 백그라운드 색 부여
  const getBadgeBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#3B82F6]";
      case 2:
        return "bg-[#22C55E]";
      case 3:
        return "bg-[#FF9800]";
      default:
        return "bg-[#98A0AE]";
    }
  };

  return (
    <div className={styles.summaryCard} id="selected-applicants-summary-card">
      <h4 className={styles.summaryTitle}>선택 지원자 요약</h4>
      <div className={styles.summaryList}>
        {selectedApplicants.length === 0 ? (
          <p className="text-[11px] text-[#98A0AE] text-center select-none py-4">
            선택된 지원자가 없습니다.
          </p>
        ) : (
          selectedApplicants.map((applicant, index) => (
            <div key={applicant.id} className={styles.summaryItem}>
              <div className={styles.summaryLeft}>
                <span className={`${styles.rankBadgeSmall} ${getBadgeBg(index + 1)}`}>
                  {index + 1}
                </span>
                <div className="flex flex-col select-none">
                  <span className={styles.summaryCode}>{applicant.masked_code}</span>
                  <span className={styles.summaryCareer}>{applicant.career || "경력 확인 중"}</span>
                </div>
              </div>
              <span className={styles.summaryScore}>
                {applicant.score.total_score.toFixed(1)}
                <span className="text-[10px] text-gray-400 font-normal">/100</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
