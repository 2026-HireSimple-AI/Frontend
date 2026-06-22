import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResumeSummaryToggleCardProps {
  selectedApplicant: any; // e.g. ApplicantDetail from API
  resumeSummary?: {
    career_summary: string;
    project_summary: string;
    skill_summary: string;
  } | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ResumeSummaryToggleCard({
  selectedApplicant,
  isOpen,
  onToggle
}: ResumeSummaryToggleCardProps) {
  
  if (!selectedApplicant) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-400 select-none font-medium">
        지원자를 선택하시면 이력서 분석 정보가 여기에 표시됩니다.
      </div>
    );
  }

  // Fallback high fidelity details for APPLICANT_001
  const isApplicant001 = selectedApplicant.masked_code === "APPLICANT_001";
  
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xs flex flex-col transition-all" id="resume-summary-toggle-card-root">
      
      {/* Header bar */}
      <div className="flex items-start justify-between gap-3" id="resume-summary-toggle-header">
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            {selectedApplicant.masked_code || "APPLICANT_001"}
          </span>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 select-none">
            {selectedApplicant.career || "경력 4년"} • 백엔드 개발자
          </span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1 py-1 px-2 text-[10px] font-bold text-[#155EEF] bg-[#EFF8FF] rounded-lg select-none cursor-pointer hover:bg-blue-100/60 transition-colors"
          id="resume-summary-toggle-btn"
        >
          <span>이력서 요약 {isOpen ? "접기" : "보기"}</span>
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Expanded Resume Content (if status is true) */}
      {isOpen && (
        <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-4 text-left" id="resume-summary-expanded-body">
          
          {/* Section 1: 총 경력 */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 block mb-1">1. 총 경력: 4년 주요 직무</h4>
            <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-500 flex flex-col gap-0.5">
              <li>백엔드 개발</li>
            </ul>
          </div>

          {/* Section 2: 기술 스택 */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 block mb-1">1. 기술 스택</h4>
            <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-500 flex flex-col gap-0.5">
              <li>Java</li>
              <li>Spring Boot</li>
              <li>MySQL</li>
              <li>Redis</li>
            </ul>
          </div>

          {/* Section 3: 주요 프로젝트 */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 block mb-1">1. 주요 프로젝트</h4>
            <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-500 flex flex-col gap-0.5">
              <li>쇼핑몰 플랫폼 개발</li>
              <li>결제 시스템 구축</li>
            </ul>
          </div>

          {/* Section 4: 최근 회사 */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 block mb-1">1. 최근 회사</h4>
            <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-500 flex flex-col gap-0.5">
              <li>ABC Corp (2022~현재)</li>
            </ul>
          </div>

          {/* Section 5: 추천 면접 포인트 */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 block mb-1">1. 추천 면접 포인트</h4>
            <ul className="list-disc pl-4 text-[10px] font-semibold text-slate-500 flex flex-col gap-0.5">
              <li>Redis 활용 경험 확인 필요</li>
              <li>대용량 트래픽 경험 상세 확인 필요</li>
              <li>AWS 운영 경험 범위 확인 필요</li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
