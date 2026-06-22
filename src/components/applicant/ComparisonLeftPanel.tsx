import React from "react";
import CompareApplicantSelectCard from "./CompareApplicantSelectCard";
import SelectedApplicantSummaryCard from "./SelectedApplicantSummaryCard";
import ComparisonGuideCard from "./ComparisonGuideCard";
import { ApplicantSummary, ApplicantDetail } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonLeftPanelProps {
  applicants: ApplicantSummary[];
  selectedApplicants: Array<ApplicantDetail & { rank_no?: number; percentileText?: string }>;
  selectedApplicantIds: number[];
  onToggleApplicant: (id: number) => void;
  errorMessage?: string;
}

export default function ComparisonLeftPanel({
  applicants,
  selectedApplicants,
  selectedApplicantIds,
  onToggleApplicant,
  errorMessage
}: ComparisonLeftPanelProps) {
  return (
    <div className={styles.leftPanel} id="comparison-left-settings-panel">
      <CompareApplicantSelectCard
        applicants={applicants}
        selectedApplicantIds={selectedApplicantIds}
        onToggleApplicant={onToggleApplicant}
        errorMessage={errorMessage}
      />
      
      <SelectedApplicantSummaryCard
        selectedApplicants={selectedApplicants}
      />

      <ComparisonGuideCard />
    </div>
  );
}
