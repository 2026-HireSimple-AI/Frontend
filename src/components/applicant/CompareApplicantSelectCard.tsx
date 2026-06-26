import React, { useState } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { ApplicantSummary } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface CompareApplicantSelectCardProps {
  applicants: ApplicantSummary[];
  selectedApplicantIds: number[];
  onToggleApplicant: (id: number) => void;
  errorMessage?: string;
}

export default function CompareApplicantSelectCard({
  applicants = [],
  selectedApplicantIds = [],
  onToggleApplicant,
  errorMessage
}: CompareApplicantSelectCardProps) {
  const [limit, setLimit] = useState<number>(20); // 기본값 20명으로 설정하여 꺽쇠 기본 활성화 지원
  const [page, setPage] = useState<number>(0);

  const pageSize = 5;

  // 전체 지원자 정정렬
  const sortedApplicants = [...applicants].sort((a, b) => b.total_score - a.total_score);
  
  // limit에 맞춰 리스트 획정
  const limitedApplicants = limit === 0 ? sortedApplicants : sortedApplicants.slice(0, limit);

  // 현재 서브 페이지 (5명 단위 분할)
  const totalPages = Math.ceil(limitedApplicants.length / pageSize);
  const paginatedApplicants = limitedApplicants.slice(page * pageSize, (page + 1) * pageSize);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setPage((prev) => Math.max(0, prev - 1));
    } else {
      setPage((prev) => Math.min(totalPages - 1, prev + 1));
    }
  };

  return (
    <div className={styles.selectCard} id="compare-applicant-select-card">
      <div className={styles.selectHeader}>
        <span className={styles.selectTitle}>비교 지원자 선택</span>
        
        {/* 리스너 변경 시 페이지 리셋 */}
        <select
          className="text-[11px] border border-[#D4D9E1] rounded px-1.5 py-0.5 bg-white text-[#475467] font-bold"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(0);
          }}
          id="comparison-limit-selector"
        >
          <option value={5}>5명 보기</option>
          <option value={20}>20명 보기</option>
          <option value={0}>전체보기</option>
        </select>
      </div>
      
      <p className={styles.selectDesc}>
        최대 3명까지 선택하여 비교할 수 있습니다.
      </p>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded px-2.5 py-1 text-[11px] font-bold mb-2 animate-shake" id="select-max-limit-error">
          ⚠️ {errorMessage}
        </div>
      )}

      {paginatedApplicants.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#98A0AE] flex flex-col items-center gap-1">
          <HelpCircle size={18} />
          <span>분석된 지원자가 없습니다.</span>
        </div>
      ) : (
        <table className={styles.applicantTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader} style={{ width: "24px" }}></th>
              <th className={styles.tableHeader} style={{ width: "32px" }}>순위</th>
              <th className={styles.tableHeader}>지원자</th>
              <th className={`${styles.tableHeader} ${styles.scoreCell}`} style={{ textAlign: "right" }}>종합 적합도</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicants.map((app, index) => {
              const isChecked = selectedApplicantIds.includes(app.id);
              const globalRank = page * pageSize + index + 1;

              return (
                <tr
                  key={app.id}
                  className={`${styles.applicantRow} ${isChecked ? styles.checkedRow : ""}`}
                  onClick={() => onToggleApplicant(app.id)}
                >
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isChecked}
                      onChange={() => {}} // Row onClick handles the action
                    />
                  </td>
                  <td className={`${styles.cell} ${styles.cellRank}`}>
                    {globalRank}
                  </td>
                  <td className={styles.cell}>
                    <span className={styles.cellCode}>{app.real_name || app.masked_code}</span>
                    <span className={styles.cellCareer}>{app.career}</span>
                  </td>
                  <td className={`${styles.cell} ${styles.cellScore}`}>
                    <span className="text-[#3B82F6] font-extrabold">{app.total_score.toFixed(1)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 페이지네이션 인터페이스 */}
      {totalPages > 1 && (
        <div className={styles.pagedControls} id="compare-select-pagination">
          <button
            type="button"
            className={styles.pagedButton}
            onClick={() => handlePageChange("prev")}
            disabled={page === 0}
            aria-label="Previous five candidates"
          >
            <ChevronLeft size={12} />
          </button>
          <span className={styles.pagedIndicator}>
            {page * pageSize + 1}위 ~ {Math.min(limitedApplicants.length, (page + 1) * pageSize)}위
          </span>
          <button
            type="button"
            className={styles.pagedButton}
            onClick={() => handlePageChange("next")}
            disabled={page >= totalPages - 1}
            aria-label="Next five candidates"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
