import React from "react";
import { DetailScoreItem } from "../../api/applicantApi";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface DetailScoreTableProps {
  scoreItems: DetailScoreItem[];
  totalScore: number;
}

export default function DetailScoreTable({
  scoreItems,
  totalScore
}: DetailScoreTableProps) {
  // 그룹화된 자격 조건, 주요업무, 우대사항 등 수집 및 행 개수 파악
  const groups: Record<string, DetailScoreItem[]> = {};
  scoreItems.forEach((item) => {
    const cat = item.criterion_type;
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(item);
  });

  const categories = ["자격 조건", "주요업무", "우대사항"];

  // 가중치 합 및 가중 반영 점수 합 계산과정검증
  const totalWeight = scoreItems.reduce((acc, cur) => acc + cur.weight, 0);
  const calculatedTotalWeightedScore = totalScore / 10;

  return (
    <div className="overflow-x-auto w-full" id="detail-score-table-wrapper">
      <table className={styles.detailScoreTable} id="evaluation-criteria-detail-table">
        <thead>
          <tr>
            <th className={styles.detailTableHeader} style={{ borderTopLeftRadius: "0.5rem" }}>평가 항목</th>
            <th className={styles.detailTableHeader}>세부 평가 항목</th>
            <th className={styles.detailTableHeader}>AI 점수 (100)</th>
            <th className={styles.detailTableHeader}>반영 비율 (%)</th>
            <th className={styles.detailTableHeader} style={{ textAlign: "right", borderTopRightRadius: "0.5rem" }}>가중 반영 점수 (10점 만점)</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((catName) => {
            const items = groups[catName] || [];
            if (items.length === 0) return null;

            return items.map((item, idx) => {
              const isFirst = idx === 0;

              return (
                <tr key={`${catName}-${idx}`} className={styles.detailTableRow}>
                  {isFirst && (
                    <td 
                      className={`${styles.detailTableCell} ${styles.categoryGroupCell}`}
                      rowSpan={items.length}
                    >
                      <span>{catName}</span>
                      <span className={styles.categoryWeightSub}>
                        비중: {item.type_weight}%
                      </span>
                    </td>
                  )}
                  <td className={`${styles.detailTableCell} ${styles.detailTextCell}`}>
                    {item.detail}
                  </td>
                  <td className={`${styles.detailTableCell} ${styles.scoreCell}`}>
                    {item.score}점
                  </td>
                  <td className={`${styles.detailTableCell} ${styles.weightCellText}`}>
                    {item.weight}%
                  </td>
                  <td className={`${styles.detailTableCell} ${styles.weightedScoreCell}`}>
                    {/* 가중 점수는 score * (weight / 100) / 10 로 계산되거나 데이터 매핑값 출력 */}
                    {item.weighted_score.toFixed(1)}점
                  </td>
                </tr>
              );
            });
          })}

          {/* 합계 요약 줄 */}
          <tr className={styles.totalRow}>
            <td className={styles.detailTableCell} colSpan={2} style={{ borderBottomLeftRadius: "0.5rem" }}>
              가중 합계
            </td>
            <td className={styles.detailTableCell}>
              -
            </td>
            <td className={`${styles.detailTableCell} ${styles.weightCellText}`}>
              {totalWeight}%
            </td>
            <td className={`${styles.detailTableCell} ${styles.weightedScoreCell}`} style={{ borderBottomRightRadius: "0.5rem" }}>
              {calculatedTotalWeightedScore.toFixed(2)} / 10점
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
