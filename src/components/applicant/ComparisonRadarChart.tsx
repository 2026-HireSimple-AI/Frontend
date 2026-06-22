import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonRadarChartProps {
  scoreSummary: {
    requirement_score: number;
    skill_score: number;
    task_score: number;
    preference_score: number;
  };
  colorTheme?: string; // "blue" or "green"
}

export default function ComparisonRadarChart({
  scoreSummary,
  colorTheme = "blue"
}: ComparisonRadarChartProps) {
  const {
    requirement_score = 90,
    skill_score = 85,
    task_score = 88,
    preference_score = 70
  } = scoreSummary;

  // SVG dimensions
  const width = 240;
  const height = 180;
  const cx = width / 2;
  const cy = height / 2 + 5;
  const maxRadius = 45;

  // 테마별 색상 옵션
  const isGreen = colorTheme === "green";
  const strokeColor = isGreen ? "#22C55E" : "#6D5DFC";
  const fillColor = isGreen ? "rgba(34, 197, 94, 0.12)" : "rgba(109, 93, 252, 0.12)";

  // 좌표 맵 (Top, Right, Bottom, Left)
  // Top: 자격조건 적합도
  // Right: 주요업무 적합도
  // Bottom: 우대사항 적합도
  // Left: 기술스택 적합도
  const topY = cy - (requirement_score / 100) * maxRadius;
  const rightX = cx + (task_score / 100) * maxRadius;
  const bottomY = cy + (preference_score / 100) * maxRadius;
  const leftX = cx - (skill_score / 100) * maxRadius;

  const points = `${cx},${topY} ${rightX},${cy} ${cx},${bottomY} ${leftX},${cy}`;

  // 백그라운드 참조 그리드 레벨들 (25, 50, 75, 100)
  const levels = [25, 50, 75, 100];

  return (
    <div className={styles.radarArea} id="comparison-radar-chart">
      <svg width={width} height={height} className="overflow-visible select-none">
        {/* 축 그리드 레벨 그리기 */}
        {levels.map((level) => {
          const r = (level / 100) * maxRadius;
          return (
            <polygon
              key={level}
              points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
              fill="none"
              stroke="#E6EAF0"
              strokeWidth="0.8"
            />
          );
        })}

        {/* 십자 축 라인 */}
        <line x1={cx - maxRadius} y1={cy} x2={cx + maxRadius} y2={cy} stroke="#E6EAF0" strokeWidth="1" />
        <line x1={cx} y1={cy - maxRadius} x2={cx} y2={cy + maxRadius} stroke="#E6EAF0" strokeWidth="1" />

        {/* 지원자 능력치 매핑 폴리곤 */}
        <polygon
          points={points}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 꼭짓점 인디케이터 점들 */}
        <circle cx={cx} cy={topY} r="3" fill={strokeColor} />
        <circle cx={rightX} cy={cy} r="3" fill={strokeColor} />
        <circle cx={cx} cy={bottomY} r="3" fill={strokeColor} />
        <circle cx={leftX} cy={cy} r="3" fill={strokeColor} />

        {/* 텍스트 라벨 (자격조건 적합도, 주요업무 적합도, 우대사항 적합도, 기술스택 적합도) */}
        {/* 상(자격조건) */}
        <text
          x={cx}
          y={cy - maxRadius - 15}
          textAnchor="middle"
          className="text-[9px] font-bold fill-[#475467]"
        >
          자격조건 적합도
        </text>
        <text
          x={cx}
          y={cy - maxRadius - 5}
          textAnchor="middle"
          className="text-[9px] font-black fill-[#1C1F26] font-mono"
        >
          {requirement_score}/100
        </text>

        {/* 우(주요업무) */}
        <text
          x={cx + maxRadius + 14}
          y={cy - 5}
          textAnchor="start"
          className="text-[9px] font-bold fill-[#475467]"
        >
          주요업무 적합도
        </text>
        <text
          x={cx + maxRadius + 14}
          y={cy + 5}
          textAnchor="start"
          className="text-[9px] font-black fill-[#1C1F26] font-mono"
        >
          {task_score}/100
        </text>

        {/* 하(우대사항) */}
        <text
          x={cx}
          y={cy + maxRadius + 11}
          textAnchor="middle"
          className="text-[9px] font-bold fill-[#475467]"
        >
          우대사항 적합도
        </text>
        <text
          x={cx}
          y={cy + maxRadius + 21}
          textAnchor="middle"
          className="text-[9px] font-black fill-[#1C1F26] font-mono"
        >
          {preference_score}/100
        </text>

        {/* 좌(기술스택) */}
        <text
          x={cx - maxRadius - 14}
          y={cy - 5}
          textAnchor="end"
          className="text-[9px] font-bold fill-[#475467]"
        >
          기술스택 적합도
        </text>
        <text
          x={cx - maxRadius - 14}
          y={cy + 5}
          textAnchor="end"
          className="text-[9px] font-black fill-[#1C1F26] font-mono"
        >
          {skill_score}/100
        </text>
      </svg>
    </div>
  );
}
