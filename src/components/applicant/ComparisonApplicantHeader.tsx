import React from "react";
import { X } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonApplicantHeaderProps {
  applicant: {
    id: number;
    real_name: string;
    masked_code: string;
  };
  rankNo: number;
  onRemove: () => void;
}

export default function ComparisonApplicantHeader({
  applicant,
  rankNo,
  onRemove
}: ComparisonApplicantHeaderProps) {
  // 1/2/3순위 색 분할 지정
  const getBadgeColor = (rank: number) => {
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
    <div className={styles.cardHeader} id={`comparison-header-applicant-${applicant.id}`}>
      <div className={styles.cardHeaderLeft}>
        <span className={`${styles.rankBadge} ${getBadgeColor(rankNo)}`}>
          {rankNo}
        </span>
        <span className={styles.headerCode}>{applicant.real_name || applicant.masked_code}</span>
      </div>
      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        aria-label="Remove from comparison list"
      >
        <X size={14} />
      </button>
    </div>
  );
}
