import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

export interface DetailScoreItem {
  criterion_type: string;
  score: number;
  weight: number;
  weighted_score: number;
}

interface ComparisonDetailScoreTableProps {
  detailScores: DetailScoreItem[];
}

export default function ComparisonDetailScoreTable({
  detailScores = []
}: ComparisonDetailScoreTableProps) {

  const finalRows = detailScores.length > 0 ? detailScores : [
    { criterion_type: "자격 조건", score: 80, weight: 30, weighted_score: 8.0 },
    { criterion_type: "주요업무", score: 85, weight: 20, weighted_score: 17.0 },
    { criterion_type: "기술스택", score: 78, weight: 40, weighted_score: 31.2 },
    { criterion_type: "우대사항", score: 65, weight: 10, weighted_score: 6.5 },
  ];

  // ✅ criterion_type 기준으로 그룹핑
  const grouped: { type: string; items: DetailScoreItem[] }[] = [];
  finalRows.forEach((item) => {
    const existing = grouped.find(g => g.type === item.criterion_type);
    if (existing) {
      existing.items.push(item);
    } else {
      grouped.push({ type: item.criterion_type, items: [item] });
    }
  });

  const totalWeight = finalRows.reduce((sum, item) => sum + (item.weight || 0), 0);
  const totalWeightedScore = finalRows.reduce((sum, item) => sum + (item.weighted_score || 0), 0);

  return (
    <div className={styles.detailTableWrapper} id="comparison-detail-table-wrapper">
      <h4 className={styles.detailTableTitle}>상세 점수</h4>
      <table className={styles.detailTable}>
        <thead>
          <tr>
            <th className={styles.detailTableHeader}>평가 항목</th>
            <th className={`${styles.detailTableHeader} ${styles.detailValueRight}`}>점수 (100)</th>
            <th className={`${styles.detailTableHeader} ${styles.detailValueRight}`}>가중치</th>
            <th className={`${styles.detailTableHeader} ${styles.detailValueRight}`}>가중 반영 점수 (100)</th>
          </tr>
        </thead>
        <tbody>
          {grouped.map((group) =>
            group.items.map((item, itemIdx) => (
              <tr key={`${group.type}-${itemIdx}`} className={styles.detailRow}>
                {/* ✅ 첫 번째 행에만 criterion_type 표시, rowSpan으로 묶기 */}
                {itemIdx === 0 && (
                  <td
                    className={`${styles.detailCell} ${styles.detailCellBold}`}
                    rowSpan={group.items.length}
                    style={{ verticalAlign: "middle", borderRight: "1px solid #E6EAF0" }}
                  >
                    {group.type}
                  </td>
                )}
                <td className={`${styles.detailCell} ${styles.detailValueRight} ${styles.detailCellText}`}>
                  {item.score}
                </td>
                <td className={`${styles.detailCell} ${styles.detailValueRight}`}>
                  {item.weight}%
                </td>
                <td className={`${styles.detailCell} ${styles.detailValueRight} ${styles.detailCellBold}`}>
                  {item.weighted_score.toFixed(1)}
                </td>
              </tr>
            ))
          )}
          {/* 가중치 합계 */}
          <tr className={styles.detailRow} style={{ borderTop: "2px solid #E6EAF0" }}>
            <td className={`${styles.detailCell} ${styles.detailCellBold}`}>가중치 합계</td>
            <td className={styles.detailCell}></td>
            <td className={`${styles.detailCell} ${styles.detailValueRight} ${styles.detailCellBold}`}>
              {totalWeight}%
            </td>
            <td className={styles.detailCell}></td>
          </tr>
          {/* 가중 반영 점수합 */}
          <tr className={styles.detailRow}>
            <td className={`${styles.detailCell} ${styles.detailCellBold}`} colSpan={2}>
              가중 반영 점수합<br />
              <span className="text-[10px] text-gray-400 font-normal">(100점 만점)</span>
            </td>
            <td className={styles.detailCell}></td>
            <td className={`${styles.detailCell} ${styles.detailValueRight} text-orange-500`}>
              <span className="text-orange-500 font-black text-sm">{totalWeightedScore.toFixed(1)}</span>
              <span className="text-[10px] text-gray-400 font-medium">/100</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}