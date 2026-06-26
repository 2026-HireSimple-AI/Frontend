import React from "react";
import { ShieldCheck, ShieldAlert, Check, X } from "lucide-react";

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
    guidelinePassedCount: 0,
    lawViolationFreeCount: 0,
    biasFreeCount: 0,
    totalCount: 0
  }
}: ComplianceSummaryCardProps) {
  const { guidelinePassedCount, lawViolationFreeCount, biasFreeCount, totalCount } = complianceSummary;
  const allPassed = totalCount > 0 &&
    guidelinePassedCount === totalCount &&
    lawViolationFreeCount === totalCount &&
    biasFreeCount === totalCount;

  const items = [
    { label: "고용노동부 가이드 준수", passed: guidelinePassedCount, total: totalCount },
    { label: "법령 위반 소지 없음",   passed: lawViolationFreeCount,  total: totalCount },
    { label: "편향·차별 표현 없음",   passed: biasFreeCount,          total: totalCount },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">

      {/* 헤더 */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">검수 결과 요약</span>
      </div>

      {/* 배너 */}
      <div className={`mx-4 mt-4 rounded-xl p-3.5 flex items-center gap-3 ${
        allPassed
          ? "bg-emerald-50 border border-emerald-100"
          : totalCount === 0
          ? "bg-slate-50 border border-slate-100"
          : "bg-amber-50 border border-amber-100"
      }`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          allPassed ? "bg-emerald-100" : "bg-slate-100"
        }`}>
          {allPassed
            ? <ShieldCheck size={18} className="text-emerald-600" />
            : <ShieldAlert size={18} className="text-slate-400" />
          }
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-extrabold leading-snug ${allPassed ? "text-emerald-700" : "text-slate-500"}`}>
            {allPassed
              ? "모든 질문이"
              : totalCount === 0
              ? "질문을 생성해주세요."
              : "일부 질문을 확인하세요."}
          </span>
          {allPassed && (
            <span className="text-xs font-extrabold text-emerald-700 leading-snug">가이드라인을 준수했습니다.</span>
          )}
        </div>
      </div>

      {/* 체크리스트 */}
      <div className="px-4 pt-3 pb-4 flex flex-col gap-0.5">
        {items.map((item) => {
          const ok = item.passed === item.total && item.total > 0;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  ok ? "bg-emerald-100" : "bg-slate-100"
                }`}>
                  {ok
                    ? <Check size={10} className="text-emerald-600 stroke-[3]" />
                    : <X size={10} className="text-slate-400 stroke-[3]" />
                  }
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{item.label}</span>
              </div>
              <span className={`text-[11px] font-bold tabular-nums ${ok ? "text-emerald-600" : "text-slate-400"}`}>
                {item.total > 0 ? `${item.passed}/${item.total}` : "-"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
