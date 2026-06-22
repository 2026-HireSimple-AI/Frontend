import React from "react";

interface DetailCriterion {
  id: number;
  detail: string;
  weight: number;
}

interface TypeCriterion {
  id: number;
  criterion_type: string;
  type_weight: number;
  detail_criteria: DetailCriterion[];
}

interface CriteriaDonutChartProps {
  criteriaList: TypeCriterion[];
  totalWeight?: number;
}

export default function CriteriaDonutChart({
  criteriaList,
  totalWeight = 100
}: CriteriaDonutChartProps) {
  // 색상 맵
  const getColorForType = (type: string) => {
    switch (type) {
      case "주요 업무":
      case "주요업무":
        return "#00194B"; // Navy (Primary)
      case "자격 조건":
      case "자격조건":
        return "#6D5DFC"; // AI Accent
      case "우대 사항":
      case "우대사항":
        return "#F59E0B"; // Warning Accent
      default:
        return "#98A0AE"; // Gray
    }
  };

  // 가용 데이터 정렬
  const data = criteriaList.map(item => ({
    name: item.criterion_type,
    value: item.type_weight,
    color: getColorForType(item.criterion_type)
  }));

  // 검증 점수 백분율 총합
  const sumOfValues = data.reduce((acc, curr) => acc + curr.value, 0);

  // SVG 도넛 그리기 파라미터 계산
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = data.map((slice) => {
    if (slice.value <= 0) return null;
    
    // 비율 계산 (예: 45 / 100 => 0.45)
    // 합계가 100이 아닐 경우를 대비해 스케일링
    const scale = sumOfValues > 0 ? sumOfValues : 100;
    const percent = slice.value / scale;
    
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    // 반지름 40, 중심(0,0)
    const pathData = [
      `M ${startX * 40} ${startY * 40}`,
      `A 40 40 0 ${largeArcFlag} 1 ${endX * 40} ${endY * 40}`
    ].join(" ");

    return {
      pathData,
      color: slice.color,
      name: slice.name,
      value: slice.value
    };
  }).filter(Boolean);

  return (
    <div className="bg-[#FFFFFF] border border-[#E6EAF0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6 select-none font-sans w-full">
      
      {/* 1. SVG Donut 원 파트 */}
      <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
        <svg 
          viewBox="-50 -50 100 100" 
          className="w-full h-full transform -rotate-90 select-none"
        >
          {/* 전체 원형 트랙 회색 가이드 백그라운드 */}
          <circle cx="0" cy="0" r="40" fill="none" stroke="#F2F4F7" strokeWidth="12" />

          {/* 도넛 조각들 */}
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice?.pathData}
              fill="none"
              stroke={slice?.color}
              strokeWidth="12"
              className="transition-all duration-300 stroke-linecap-round hover:opacity-90"
              style={{ strokeLinecap: "butt" }}
            />
          ))}
        </svg>

        {/* 도넛 중앙의 총합 라벨 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-[11px] font-semibold text-[#707887] uppercase tracking-wide">
            총합 비율
          </span>
          <span className="text-sm font-extrabold text-[#1C1F26] mt-0.5 font-mono">
            총 {sumOfValues}%
          </span>
        </div>
      </div>

      {/* 2. 우측 컬러 인덱스 목록 */}
      <div className="flex flex-col gap-3 min-w-[160px]">
        {data.map((slice, idx) => (
          <div key={idx} className="flex items-center justify-between gap-6 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              {/* 컬러 패치 */}
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-xs font-bold text-[#1C1F26]">
                {slice.name}
              </span>
            </div>
            
            <span className="text-xs font-bold text-[#00194B] font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>
              {slice.value}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
