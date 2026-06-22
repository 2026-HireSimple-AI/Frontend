import React from "react";
import CriteriaReasonHoverTrigger from "./CriteriaReasonHoverTrigger";

export interface DetailCriterion {
  id: number;
  detail: string;
  weight: number;
}

export interface TypeCriterion {
  id: number;
  criterion_type: string;
  type_weight: number;
  detail_criteria: DetailCriterion[];
}

interface CriteriaWeightTableProps {
  criteriaList: TypeCriterion[];
}

export default function CriteriaWeightTable({ criteriaList }: CriteriaWeightTableProps) {
  // 배지 스타일 매퍼
  const getCategoryBadgeClass = (type: string) => {
    switch (type) {
      case "주요 업무":
      case "주요업무":
        return "bg-[#EEF3FA] text-[#00194B] border border-[#BACFFC]";
      case "자격 조건":
      case "자격조건":
        return "bg-[#EDFDF5] text-[#22C55E] border border-green-200";
      case "우대 사항":
      case "우대사항":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="overflow-x-auto border border-[#E6EAF0] rounded-xl bg-white select-none font-sans">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E6EAF0]">
            <th className="py-3 px-4 text-xs font-bold text-[#475467] w-[140px] whitespace-nowrap">
              <span className="inline-flex items-center gap-1">
                평가 항목
                <CriteriaReasonHoverTrigger />
              </span>
            </th>
            <th className="py-3 px-4 text-xs font-bold text-[#475467]">
              세부 평가 기준
            </th>
            <th className="py-3 px-4 text-xs font-bold text-[#475467] text-center w-[120px] whitespace-nowrap">
              가중치(%)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E6EAF0]">
          {criteriaList && criteriaList.length > 0 ? (
            criteriaList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                {/* 1. 카테고리 셀 */}
                <td className="py-4 px-4 align-middle">
                  <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-lg ${getCategoryBadgeClass(item.criterion_type)}`}>
                    {item.criterion_type}
                  </span>
                </td>

                {/* 2. 세부 평가 기준 목록 */}
                <td className="py-4 px-4 text-xs text-[#344054] leading-relaxed">
                  <div className="flex flex-col gap-1.5">
                    {item.detail_criteria && item.detail_criteria.length > 0 ? (
                      item.detail_criteria.map((detail) => (
                        <div key={detail.id} className="flex items-center justify-between text-xs text-[#344054] font-medium">
                          <span className="flex items-start gap-1">
                            <span className="text-[#98A0AE] mt-0.5">•</span>
                            <span>{detail.detail}</span>
                          </span>
                          
                          {/* 세부 항목 점수가 100% 미만이거나 존재하면 예외 기재 */}
                          {detail.weight > 0 && detail.weight < 100 && (
                            <span className="text-[11px] text-[#707887] font-mono ml-2 flex-shrink-0 bg-[#F2F4F7] px-1.5 py-0.5 rounded">
                              {detail.weight}%
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 font-light">추출된 세부 기준이 없습니다.</span>
                    )}
                  </div>
                </td>

                {/* 3. 대분류 가중치 비율 */}
                <td 
                  className="py-4 px-4 text-center text-sm font-extrabold text-[#00194B] align-middle font-mono"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {item.type_weight}%
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-12 px-4 text-center text-xs text-gray-400">
                평가 항목이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
