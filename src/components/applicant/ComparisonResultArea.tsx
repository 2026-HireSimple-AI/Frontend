import React from "react";
import ComparisonApplicantCard from "./ComparisonApplicantCard";
import { ApplicantDetail } from "../../api/applicantApi";
import { HelpCircle } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonResultAreaProps {
  selectedApplicants: Array<ApplicantDetail & { rank_no?: number; percentileText?: string }>;
  onRemoveApplicant: (id: number) => void;
}

export default function ComparisonResultArea({
  selectedApplicants = [],
  onRemoveApplicant
}: ComparisonResultAreaProps) {
  if (selectedApplicants.length === 0) {
    return (
      <div className={styles.emptyState} id="comparison-result-empty-state">
        <div className="w-12 h-12 rounded-full bg-[#EEF3FA] flex items-center justify-center text-[#6D5DFC] mb-2 animate-pulse">
          <HelpCircle size={24} />
        </div>
        <p className="font-bold text-sm text-[#1C1F26]">비교할 지원자를 선택해 주세요.</p>
        <p className="text-xs text-[#707887]">최대 3명까지 선택할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.comparisonResultArea} id="comparison-result-grid-area">
      {selectedApplicants.map((applicant, index) => (
        // @ts-ignore
        <ComparisonApplicantCard
          key={applicant.id}
          applicant={applicant}
          rankNo={index + 1}
          onRemove={() => onRemoveApplicant(applicant.id)}
        />
      ))}
    </div>
  );
}
