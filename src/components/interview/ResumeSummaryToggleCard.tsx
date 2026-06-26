import React from "react";
import { ChevronDown, ChevronUp, Briefcase, FileText, FileCode, User } from "lucide-react";

interface ResumeSummaryToggleCardProps {
  selectedApplicant: any;
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
        지원자를 선택하시면 이력서 정보가 표시됩니다.
      </div>
    );
  }

  const summary = selectedApplicant.resume_summary;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-slate-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-slate-800 leading-tight">
              {selectedApplicant.masked_code || "APPLICANT_001"}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              {selectedApplicant.career ? `경력 ${selectedApplicant.career}` : "지원자"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1 py-1.5 px-3 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer select-none whitespace-nowrap"
        >
          <span>{isOpen ? "접기" : "이력서 요약"}</span>
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* 확장 영역 */}
      {isOpen && (
        <div className="px-5 py-4 bg-slate-50/50 flex flex-col gap-4">
          {summary ? (
            <>
              <SummarySection
                icon={<Briefcase size={12} className="text-indigo-500" />}
                title="경력 요약"
                content={summary.career_summary}
              />
              <SummarySection
                icon={<FileText size={12} className="text-indigo-500" />}
                title="주요 프로젝트"
                content={summary.project_summary}
              />
              <SummarySection
                icon={<FileCode size={12} className="text-indigo-500" />}
                title="핵심 보유기술"
                content={summary.skill_summary}
              />
            </>
          ) : (
            <p className="text-[11px] text-slate-400 text-center py-2">이력서 요약 정보가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

function SummarySection({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] font-bold text-slate-700">{title}</span>
      </div>
      <p
        className="text-[11px] text-slate-500 leading-relaxed pl-4"
        dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, "<br/>") || "-" }}
      />
    </div>
  );
}
