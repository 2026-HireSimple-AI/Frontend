import React from "react";
import ApplicantRankingCard from "./ApplicantRankingCard";
import ApplicantRadarCard from "./ApplicantRadarCard";
import ApplicantResultCard from "./ApplicantResultCard";
import DetailScoreTable from "./DetailScoreTable";
import SkillMatchCard from "./SkillMatchCard";
import { ApplicantSummary, ApplicantDetail } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface IndividualAnalysisTabProps {
  applicants: ApplicantSummary[];
  selectedApplicant: ApplicantDetail;
  onSelectApplicant: (id: number) => void;
  rankingLimit?: number;
  onRankingLimitChange?: (limit: number) => void;
}

export default function IndividualAnalysisTab({
  applicants,
  selectedApplicant,
  onSelectApplicant,
  rankingLimit,
  onRankingLimitChange
}: IndividualAnalysisTabProps) {
  return (
    <div className={styles.contentGrid} id="individual-analysis-tab-content">
      {/* 1. Left Column: 랭킹 및 레이더 능력치 판 */}
      <section className={styles.leftColumn} aria-label="지원자 랭킹 및 궤적">
        <ApplicantRankingCard
          applicants={applicants}
          selectedId={selectedApplicant.id}
          onSelect={onSelectApplicant}
          limit={rankingLimit}
          onLimitChange={onRankingLimitChange}
        />
        <ApplicantRadarCard 
          applicant={selectedApplicant} 
        />
      </section>

      {/* 2. Center Column: 종합 요건 및 소항목 가중 점수판 */}
      <section className={styles.centerColumn} aria-label="요구 세부 평정 결과">
        <ApplicantResultCard 
          applicant={selectedApplicant} 
        />
        <div className="bg-white border border-[#E6EAF0] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#1C1F26] tracking-tight">세부 매칭 분석표</h3>
          <DetailScoreTable
            scoreItems={selectedApplicant.detail_scores}
            totalScore={selectedApplicant.score.total_score}
          />
        </div>
      </section>

      {/* 3. Right Column: 기술 스택 비교 */}
      <section className={styles.rightColumn} aria-label="기술 요소 정합 분석">
        <SkillMatchCard
          skills={selectedApplicant.matched_skills}
          skillScore={selectedApplicant.score.skill_score}
        />
      </section>
    </div>
  );
}
