import React, { useState } from "react";
import { ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import { ApplicantSummary } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface ApplicantRankingCardProps {
  applicants: ApplicantSummary[];
  selectedId: number;
  onSelect: (id: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export default function ApplicantRankingCard({
  applicants,
  selectedId,
  onSelect,
  limit: propLimit,
  onLimitChange
}: ApplicantRankingCardProps) {
  const [localLimit, setLocalLimit] = useState<number>(() => {
    const saved = localStorage.getItem("selected_ranking_limit");
    return saved ? Number(saved) : 5;
  });
  const [page, setPage] = useState<number>(0);

  const limit = propLimit !== undefined ? propLimit : localLimit;

  const pageSize = 5;

  // 종합 점수 수치 정렬로 랭크 부여
  const sortedApplicants = [...applicants].sort((a, b) => b.total_score - a.total_score);
  const limitedApplicants = sortedApplicants.slice(0, limit === 0 ? sortedApplicants.length : limit);

  // 현재 페이지 데이터 분할
  const displayedApplicants = limitedApplicants.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(limitedApplicants.length / pageSize);

  return (
    <div className={styles.rankingCard} id="applicant-ranking-card">
      <div className={styles.rankingHeader}>
        <div className="flex items-center gap-1.5">
          <span className={styles.rankingTitle}>지원자 랭킹</span>
          <span className="text-[10px] font-bold text-white bg-[#6D5DFC] px-1.5 py-0.5 rounded-md leading-none">AI</span>
        </div>
          <select
            id="ranking-limit-select"
            className={styles.rankingCountSelect}
            value={limit}
            disabled={applicants.length <= 5}
            onChange={(e) => {
              const val = Number(e.target.value);
              localStorage.setItem("selected_ranking_limit", String(val));
              if (onLimitChange) {
                onLimitChange(val);
              } else {
                setLocalLimit(val);
              }
              setPage(0);
            }}
          >
            <option value={5}>5명 보기</option>
            {applicants.length > 5 && applicants.length <= 20 && (
              <option value={applicants.length}>{applicants.length}명 보기</option>
            )}
            {applicants.length > 20 && (
              <option value={20}>20명 보기</option>
            )}
          </select>
      </div>
      <p className={styles.rankingDesc}>
        종합 적합도 분석이 완료된 지원자 목록입니다.
      </p>

      <table className={styles.rankingTable} id="ranking-list-table">
        <thead>
          <tr>
            <th className={styles.rankingTableHeader} style={{ width: "3.25rem" }}>순위</th>
            <th className={styles.rankingTableHeader}>지원자</th>
            <th className={styles.rankingTableHeader} style={{ textAlign: "right" }}>적합도</th>
          </tr>
        </thead>
        <tbody>
          {displayedApplicants.map((app, index) => {
            const isSelected = app.id === selectedId;
            const rank = page * pageSize + index + 1;
            return (
              <tr
                key={app.id}
                id={`ranking-row-${app.id}`}
                className={`${styles.rankingRow} ${isSelected ? styles.selectedRankingRow : ""}`}
                onClick={() => onSelect(app.id)}
              >
                <td className={`${styles.rankingCell} ${styles.rankNum}`}>
                  {rank}위
                </td>
                <td className={styles.rankingCell}>
                  <div className={styles.applicantCodeText}>{app.real_name || app.masked_code}</div>
                  <span className={styles.applicantCareerMini}>{app.career}</span>
                </td>
                <td className={styles.rankingCell} style={{ textAlign: "right" }}>
                  <span className={styles.rankScore}>{app.total_score.toFixed(1)}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[#E6EAF0]">
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#D4D9E1] hover:bg-[#F8FAFC] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed text-[#475467] transition-all"
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            aria-label="이전 페이지"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-[#475467] select-none">
            {page * pageSize + 1}위 ~ {Math.min(limitedApplicants.length, (page + 1) * pageSize)}위
          </span>
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-[#D4D9E1] hover:bg-[#F8FAFC] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed text-[#475467] transition-all"
            onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={page >= totalPages - 1}
            aria-label="다음 페이지"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
