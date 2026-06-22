import React from "react";
import { ShieldCheck, Check } from "lucide-react";

interface ComplianceSummary {
  guidelinePassedCount: number;
  lawViolationFreeCount: number;
  biasFreeCount: number;
  totalCount: number;
}

interface ComplianceSummaryCardProps {
  complianceSummary?: ComplianceSummary;
}

export default function ComplianceSummaryCard({
  complianceSummary = {
    guidelinePassedCount: 9,
    lawViolationFreeCount: 9,
    biasFreeCount: 9,
    totalCount: 9
  }
}: ComplianceSummaryCardProps) {
  const { guidelinePassedCount, lawViolationFreeCount, biasFreeCount, totalCount } = complianceSummary;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4 text-left" id="compliance-summary-card-container">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider" id="compliance-summary-card-title">검수 결과 요약</h3>

      {/* Shield Banner */}
      <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4" id="compliance-status-banner">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0" id="compliance-shield-icon-wrap">
          <ShieldCheck size={20} className="fill-emerald-50" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold text-[#16A34A] select-none leading-tight">모든 질문이</span>
          <span className="text-xs font-extrabold text-[#16A34A] leading-tight mt-0.5">가이드라인을 준수했습니다.</span>
        </div>
      </div>

      {/* Checklist list */}
      <div className="flex flex-col gap-3 font-semibold text-slate-700" id="compliance-checklist-area">
        {/* Row 1: 고용노동부 가이드 준수 */}
        <div className="flex items-center justify-between text-xs py-1" id="compliance-item-guideline">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 stroke-[3]" />
            <span>고용노동부 가이드 준수</span>
          </div>
          <span className="font-bold text-slate-800">
            {guidelinePassedCount}/{totalCount}
          </span>
        </div>

        {/* Row 2: 법령 위반 소지 없음 */}
        <div className="flex items-center justify-between text-xs py-1" id="compliance-item-laws">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 stroke-[3]" />
            <span>법령 위반 소지 없음</span>
          </div>
          <span className="font-bold text-slate-800">
            {lawViolationFreeCount}/{totalCount}
          </span>
        </div>

        {/* Row 3: 편향/차별 표현 없음 */}
        <div className="flex items-center justify-between text-xs py-1" id="compliance-item-bias">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500 stroke-[3]" />
            <span>편향/차별 표현 없음</span>
          </div>
          <span className="font-bold text-slate-800">
            {biasFreeCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}
