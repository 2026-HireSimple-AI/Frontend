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

  // SVG 도넛 그리기 파라미터 계산 (SVG 자체가 회전되지 않으므로, 12시 방향부터 그리기 위해 -0.25 차감)
  const getCoordinatesForPercent = (percent: number) => {
    const angle = 2 * Math.PI * (percent - 0.25);
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return [x, y];
  };

  let cumulativePercent = 0;
  const scale = sumOfValues > 0 ? sumOfValues : 100;

  const slices = data.map((slice) => {
    if (slice.value <= 0) return null;
    
    // 비율 계산 (0 ~ 1 사이 값)
    const rawPercent = slice.value / scale;
    // 100% 전체를 차지할 때 시작점과 끝점이 겹쳐서 안 그려지는 문제를 막기 위해 미세 조절
    const percent = Math.min(rawPercent, 0.9999);
    
    const startPercent = cumulativePercent;
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    
    cumulativePercent += percent;
    const endPercent = cumulativePercent;
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    // 반지름 50, 중심(0,0)
    const pathData = [
      `M ${startX * 50} ${startY * 50}`,
      `A 50 50 0 ${largeArcFlag} 1 ${endX * 50} ${endY * 50}`
    ].join(" ");

    // 라벨이 배치될 최적의 중간 각도 구하기
    const midPercent = startPercent + (rawPercent / 2);
    const midAngle = 2 * Math.PI * (midPercent - 0.25);
    
    // 도넛 반지름이 50이고 두께가 18이므로 외곽선은 약 59. 
    // 라벨 텍스트는 76 반지름 지점에 배치하여 겹침 방지 및 여유 공간 확보.
    const labelRadius = 74;
    const tx = Math.cos(midAngle) * labelRadius;
    const ty = Math.sin(midAngle) * labelRadius;

    // 배치 방향에 따른 정렬 기준 선택
    let textAnchor: "start" | "middle" | "end" | "inherit" = "middle";
    if (tx > 6) textAnchor = "start";
    else if (tx < -6) textAnchor = "end";

    return {
      pathData,
      color: slice.color,
      name: slice.name,
      value: slice.value,
      tx,
      ty,
      textAnchor
    };
  }).filter(Boolean);

  return (
    <div className="bg-[#FFFFFF] border border-[#E6EAF0] rounded-2xl p-6 shadow-sm flex items-center justify-center select-none font-sans w-full min-h-[300px]">
      
      {/* SVG Donut 원 및 라벨 파트 */}
      <div className="relative w-72 h-72 flex items-center justify-center flex-shrink-0">
        <svg 
          viewBox="-100 -100 200 200" 
          className="w-full h-full select-none overflow-visible"
        >
          {/* 전체 원형 트랙 회색 가이드 백그라운드 */}
          <circle cx="0" cy="0" r="50" fill="none" stroke="#F2F4F7" strokeWidth="18" />

          {/* 도넛 조각들 */}
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice?.pathData}
              fill="none"
              stroke={slice?.color}
              strokeWidth="18"
              className="transition-all duration-300 stroke-linecap-round hover:opacity-95"
              style={{ strokeLinecap: "butt" }}
            />
          ))}

          {/* 조각별 라벨 (이름 및 가중치 백분율) */}
          {slices.map((slice, idx) => {
            if (!slice) return null;
            return (
              <g key={`label-${idx}`} className="transition-all duration-300">
                <text
                  x={slice.tx}
                  y={slice.ty}
                  textAnchor={slice.textAnchor}
                  dominantBaseline="middle"
                  className="select-none font-sans"
                >
                  <tspan 
                    x={slice.tx} 
                    dy="-3" 
                    className="text-[9.5px] font-bold fill-[#1C1F26]"
                  >
                    {slice.name}
                  </tspan>
                  <tspan 
                    x={slice.tx} 
                    dy="11" 
                    className="text-[9.5px] font-semibold fill-[#707887] font-mono"
                  >
                    {slice.value}%
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>

        {/* 도넛 중앙의 총합 라벨 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-[11px] font-semibold text-[#707887] tracking-wider">
            총합 비율
          </span>
          <span className="text-sm font-extrabold text-[#1C1F26] mt-0.5 font-mono">
            {sumOfValues}%
          </span>
        </div>
      </div>

    </div>
  );
}
