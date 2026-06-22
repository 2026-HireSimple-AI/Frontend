import React from "react";
import { Plus, Trash2 } from "lucide-react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";
import { DetailCriterion } from "./CriteriaWeightTable";

interface DetailCriteriaEditorProps {
  detailCriteria: DetailCriterion[];
  onChangeDetailText: (id: number, text: string) => void;
  onChangeDetailWeight: (id: number, weight: number) => void;
  onAddDetail: () => void;
  onDeleteDetail: (id: number) => void;
}

export default function DetailCriteriaEditor({
  detailCriteria,
  onChangeDetailText,
  onChangeDetailWeight,
  onAddDetail,
  onDeleteDetail
}: DetailCriteriaEditorProps) {
  return (
    <div className={styles.detailCell}>
      {detailCriteria && detailCriteria.length > 0 ? (
        detailCriteria.map((detailItem) => (
          <div key={detailItem.id} className={styles.detailInputRow}>
            {/* 세부 인풋 설명란 */}
            <input
              type="text"
              value={detailItem.detail}
              onChange={(e) => onChangeDetailText(detailItem.id, e.target.value)}
              placeholder="상세 평가 지표를 입력하세요"
              className={styles.detailInput}
            />

            {/* 개별 세부 가중치 비중 (%) */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={detailItem.weight}
                onChange={(e) => onChangeDetailWeight(detailItem.id, Number(e.target.value))}
                className={styles.detailWeightInput}
              />
              <span className="text-[10px] font-bold text-gray-400">%</span>
            </div>

            {/* 삭제용 휴지통 */}
            <button
              onClick={() => onDeleteDetail(detailItem.id)}
              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="상세 기준 삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-2 text-[11px] text-[#98A0AE] italic font-medium">
          등록된 상세 지표가 없습니다. 추가 버튼을 통해 등록하십시오.
        </div>
      )}

      {/* 추가 버튼 */}
      <button
        onClick={onAddDetail}
        type="button"
        className={styles.addDetailButton}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
