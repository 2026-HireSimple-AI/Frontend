import React from "react";
import { Cpu } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface SkillMatchCardProps {
  skills: string[];
  skillScore: number;
}

export default function SkillMatchCard({
  skills = [],
  skillScore = 85
}: SkillMatchCardProps) {
  // 도넛 차트 SVG 파선 계산
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (skillScore / 100) * circumference;

  return (
    <div className={styles.skillMatchCard} id="skill-match-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#1C1F26] flex items-center gap-1.5">
          <Cpu size={16} className="text-[#6D5DFC]" />
          <span>기술 스택 비교</span>
        </h3>
        <span className="text-[11px] font-bold text-[#22C55E]">일치 기술 ({skills.length})</span>
      </div>

      {/* 동적 SVG 도넛 차트 */}
      <div className={styles.donutChartArea}>
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
            {/* 백그라운드 원 */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="transparent"
              stroke="#F2F4F7"
              strokeWidth="5"
            />
            {/* 활성 매칭 스택 원 */}
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="transparent"
              stroke="#22C55E"
              strokeWidth="5.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center select-none" style={{ fontVariantNumeric: "tabular-nums" }}>
            <span className="text-lg font-extrabold text-[#111827]">{skillScore}%</span>
            <span className="text-[9px] text-[#98A0AE] font-bold">적합도</span>
          </div>
        </div>
      </div>

      <div className={styles.skillTagList} id="skills-tag-list">
        {[...new Set(skills)].map((skill) => (
          <span key={skill} className={styles.skillTag}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
