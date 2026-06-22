import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Briefcase, FileCode } from "lucide-react";
import { ResumeSummary } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface ResumeSummaryToggleProps {
  summary: ResumeSummary;
}

export default function ResumeSummaryToggle({ summary }: ResumeSummaryToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full" id="resume-summary-toggle-container">
      <div className="flex justify-end">
        <button
          type="button"
          id="resume-summary-toggle-btn"
          className={styles.resumeSummaryButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>이력서 AI 요약 {isExpanded ? "닫기" : "보기"}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.resumeSummaryPanel} id="resume-summary-panel">
          <div>
            <span className={styles.summarySectionTitle}>
              <Briefcase size={12} className="text-[#6D5DFC]" />
              경력 요약
            </span>
            <p className={styles.summaryText}>{summary.career_summary}</p>
          </div>
          <div style={{ borderTop: "1px solid #E6EAF0", paddingTop: "0.5rem" }}>
            <span className={styles.summarySectionTitle}>
              <FileText size={12} className="text-[#6D5DFC]" />
              주요 프로젝트 경험
            </span>
            <p className={styles.summaryText}>{summary.project_summary}</p>
          </div>
          <div style={{ borderTop: "1px solid #E6EAF0", paddingTop: "0.5rem" }}>
            <span className={styles.summarySectionTitle}>
              <FileCode size={12} className="text-[#6D5DFC]" />
              핵심 보유기술
            </span>
            <p className={styles.summaryText}>{summary.skill_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
