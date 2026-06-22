import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

interface ComplianceWarningPanelProps {
  originalQuestionText: string;
  revisedQuestionText: string;
  complianceReason: string;
  onReplace: () => void;
}

export default function ComplianceWarningPanel({
  originalQuestionText,
  revisedQuestionText,
  complianceReason,
  onReplace
}: ComplianceWarningPanelProps) {
  return (
    <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 mt-2 flex flex-col md:grid md:grid-cols-12 gap-5" id="compliance-warning-panel-root">
      
      {/* 1. 권장 수정안 (left 7 columns) */}
      <div className="md:col-span-7 flex flex-col text-left gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#EF4444] flex items-center gap-1">
            <AlertCircle size={14} className="text-[#EF4444] fill-red-100" />
            권장 수정안 (법령/가이드 준수)
          </span>
          <span className="bg-red-100 text-[#EF4444] text-[9px] font-bold px-1.5 py-0.5 rounded">
            권장
          </span>
        </div>
        
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold leading-relaxed shadow-3xs">
          {revisedQuestionText || "권장 질문이 아직 생성되지 않았습니다."}
        </div>
      </div>

      {/* 2. 검수 사유 (right 5 columns) */}
      <div className="md:col-span-5 flex flex-col justify-between text-left gap-3">
        <div>
          <h5 className="text-xs font-extrabold text-slate-800 mb-1.5">검수 사유</h5>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            {complianceReason || "• 직무 역량 판단과 관련하여 보완 검증이 필요합니다."}
          </p>
        </div>

        <button
          type="button"
          onClick={onReplace}
          className="self-end inline-flex items-center gap-1.5 bg-white text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 py-1.5 px-3 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer select-none shadow-3xs"
          id="btn-replace-recommended-text"
        >
          <span>이 권장 질문으로 교체</span>
          <ArrowRight size={11} />
        </button>
      </div>

    </div>
  );
}
