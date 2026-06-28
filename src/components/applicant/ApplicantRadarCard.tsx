import React from "react";
import { ApplicantDetail } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface ApplicantRadarCardProps {
  applicant: ApplicantDetail;
  percentileText?: string;
}

export default function ApplicantRadarCard({
  applicant,
  percentileText = "상위 3.2% 이내"
}: ApplicantRadarCardProps) {
  // 4개 역량 점수 추출
  const req = applicant.score.requirement_score;
  const skill = applicant.score.skill_score;
  const task = applicant.score.task_score;
  const pref = applicant.score.preference_score;

  // 레이더 플롯 SVG 좌표계 산정 (Center=100, Center=100, Max Radius=65)
  const cx = 100;
  const cy = 100;
  const r = 65;

  // 각 스코어 비율에 따른 좌표 계산
  // 12시 (자격조건)
  const y0 = cy - r * (req / 100);
  const x0 = cx;

  // 3시 (기술스택)
  const x1 = cx + r * (skill / 100);
  const y1 = cy;

  // 6시 (주요업무)
  const y2 = cy + r * (task / 100);
  const x2 = cx;

  // 9시 (우대사항)
  const x3 = cx - r * (pref / 100);
  const y3 = cy;

  // 가이드라인 격자 반경 배열
  const gridRadii = [25, 50, 75, 100];

  return (
    <div className={styles.radarCard} id="applicant-radar-card">
      <h3 className={styles.radarTitle}>
        {applicant.real_name || applicant.masked_code} 종합 적합도 능력치
      </h3>

      <div className={styles.radarScoreWrapper}>
        <span className={styles.radarScoreLabel}>종합 역량 점수</span>
        <span className={styles.radarScoreValue}>
          {applicant.score.total_score.toFixed(1)}
          <span className={styles.radarScoreUnit}> / 100점</span>
        </span>
        <span className={styles.radarScorePercentile}>{percentileText}</span>
      </div>

      <div className={styles.radarCanvasContainer}>
        {/* 아름답게 정렬된 펄스 SVG 레이더 그래프 */}
        <svg width="200" height="200" className="overflow-visible select-none">
          {/* 1. 격자 평행선 그리기 */}
          {gridRadii.map((percent) => {
            const rad = r * (percent / 100);
            return (
              <polygon
                key={percent}
                points={`${cx},${cy - rad} ${cx + rad},${cy} ${cx},${cy + rad} ${cx - rad},${cy}`}
                fill="none"
                stroke="#E6EAF0"
                strokeWidth="1"
                strokeDasharray={percent < 100 ? "2,2" : "none"}
              />
            );
          })}

          {/* 2. 각도 축 라인 */}
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#E6EAF0" strokeWidth="1" />
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#E6EAF0" strokeWidth="1" />

          {/* 3. 격자 텍스트 라벨 가이드 */}
          <text x={cx + 3} y={cy - r * 0.5 + 4} fill="#98A0AE" fontSize="8" fontWeight="600" className="font-mono">50</text>
          <text x={cx + 3} y={cy - r + 4} fill="#98A0AE" fontSize="8" fontWeight="600" className="font-mono">100</text>

          {/* 4. 영역 폴리곤 내부 사상 */}
          <polygon
            points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="rgba(109, 93, 252, 0.15)"
            stroke="#6D5DFC"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5. 꼭짓점 조견 마커 점 */}
          <circle cx={x0} cy={y0} r="4" fill="#00194B" stroke="#6D5DFC" strokeWidth="1.5" />
          <circle cx={x1} cy={y1} r="4" fill="#00194B" stroke="#6D5DFC" strokeWidth="1.5" />
          <circle cx={x2} cy={y2} r="4" fill="#00194B" stroke="#6D5DFC" strokeWidth="1.5" />
          <circle cx={x3} cy={y3} r="4" fill="#00194B" stroke="#6D5DFC" strokeWidth="1.5" />

          {/* 6. 레이블 텍스트 수치 매핑 */}
          <text x={cx} y={cy - r - 8} textAnchor="middle" fill="#475467" fontSize="10" fontWeight="700">자격 조건</text>
          <text x={cx + r + 8} y={cy + 4} textAnchor="start" fill="#475467" fontSize="10" fontWeight="700">기술 스택</text>
          <text x={cx} y={cy + r + 15} textAnchor="middle" fill="#475467" fontSize="10" fontWeight="700">주요 업무</text>
          <text x={cx - r - 8} y={cy + 4} textAnchor="end" fill="#475467" fontSize="10" fontWeight="700">우대 사항</text>
        </svg>
      </div>
    </div>
  );
}
