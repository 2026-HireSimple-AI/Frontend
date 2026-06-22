import React from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

interface ResumeSummary {
  career_summary: string;
  project_summary: string;
  skill_summary: string;
}

interface ResumeSummaryToggleProps {
  resumeSummary?: ResumeSummary | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ResumeSummaryToggle({
  resumeSummary,
  isOpen,
  onToggle
}: ResumeSummaryToggleProps) {
  return (
    <div className="w-full" id="resume-summary-toggle-wrapper">
      {/* Toggle Button */}
      <button
        type="button"
        className={styles.resumeToggleButton}
        onClick={onToggle}
        id="resume-toggle-btn"
      >
        <FileText size={14} />
        <span>이력서 요약 {isOpen ? "접기" : "보기"}</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expanded Summary Box */}
      {isOpen && (
        <div 
          className={styles.resumeSummaryPanel} 
          id="resume-summary-panel-content"
        >
          {resumeSummary ? (
            <div className="flex flex-col gap-3 text-left">
              {/* Career Summary */}
              <div id="resume-career-summary-area">
                <div className="text-[11px] font-bold text-[#475467] mb-0.5 select-none">경력 요약</div>
                <div className="text-xs text-[#344054] leading-relaxed font-normal">
                  {resumeSummary.career_summary || "등록된 경력 정보 요약이 없습니다."}
                </div>
              </div>

              {/* Project Summary */}
              <div id="resume-project-summary-area">
                <div className="text-[11px] font-bold text-[#475467] mb-0.5 select-none">프로젝트 요약</div>
                <div className="text-xs text-[#344054] leading-relaxed font-normal">
                  {resumeSummary.project_summary || "등록된 프로젝트 수행 정보 요약이 없습니다."}
                </div>
              </div>

              {/* Skill Summary */}
              <div id="resume-skill-summary-area">
                <div className="text-[11px] font-bold text-[#475467] mb-0.5 select-none">핵심 기술</div>
                <div className="text-xs text-[#344054] leading-relaxed font-normal">
                  {resumeSummary.skill_summary || "등록된 핵심 기술 및 언어 요약이 없습니다."}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 font-medium py-2 text-center select-none" id="resume-summary-empty">
              요약 데이터를 불러올 수 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
