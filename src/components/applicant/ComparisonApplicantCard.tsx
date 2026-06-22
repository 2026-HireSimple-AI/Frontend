import React from "react";
import ComparisonApplicantHeader from "./ComparisonApplicantHeader";
import ComparisonTotalScoreBox from "./ComparisonTotalScoreBox";
import ComparisonRadarChart from "./ComparisonRadarChart";
import ComparisonSkillMatchSection from "./ComparisonSkillMatchSection";
import ComparisonSkillTagList from "./ComparisonSkillTagList";
import ComparisonDetailScoreTable from "./ComparisonDetailScoreTable";
import { ApplicantDetail } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonApplicantCardProps {
  key?: any;
  applicant: ApplicantDetail & {
    rank_no?: number;
    percentileText?: string;
  };
  rankNo: number;
  onRemove: () => void;
}

export default function ComparisonApplicantCard({
  applicant,
  rankNo,
  onRemove
}: ComparisonApplicantCardProps) {
  // 백업 퍼센타일 디스플레이 텍스트
  const percentileDisplay = applicant.percentileText || `상위 ${Math.max(1, Math.min(99, Math.round(100 - applicant.score.total_score)))}%`;
  
  // 차트 등에 사용될 테마결정
  const chartColorTheme = rankNo === 2 ? "green" : "blue";

  // 레이더 차트에 주어질 객체
  const scoreSummary = {
    requirement_score: applicant.score.requirement_score,
    skill_score: applicant.score.skill_score,
    task_score: applicant.score.task_score,
    preference_score: applicant.score.preference_score
  };

  return (
    <div className={styles.applicantCard} id={`comparison-card-applicant-${applicant.id}`}>
      {/* 1. Header Area (Stays visible) */}
      <ComparisonApplicantHeader
        applicant={applicant}
        rankNo={rankNo}
        onRemove={onRemove}
      />

      {/* 2. Scrollable Body Area (Scrolls independently) */}
      <div className={styles.cardScrollBody}>
        <ComparisonTotalScoreBox
          totalScore={applicant.score.total_score}
          percentileText={percentileDisplay}
        />

        <ComparisonRadarChart
          scoreSummary={scoreSummary}
          colorTheme={chartColorTheme}
        />

        <div className="border-t border-[#F2F4F7] my-1" />

        <ComparisonSkillMatchSection
          skillScore={applicant.score.skill_score}
        />

        <ComparisonSkillTagList
          skills={applicant.matched_skills || []}
        />

        <div className="border-t border-[#F2F4F7] my-1" />

        <ComparisonDetailScoreTable
          detailScores={applicant.detail_scores || []}
        />
      </div>
    </div>
  );
}
