import React from "react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";
import CriteriaTypeCard from "./CriteriaTypeCard";
import DetailCriteriaEditor from "./DetailCriteriaEditor";
import CategoryWeightEditor from "./CategoryWeightEditor";
import { TypeCriterion } from "./CriteriaWeightTable";

interface CriteriaEditRowProps {
  key?: React.Key;
  criterion: TypeCriterion;
  onChangeCategoryWeight: (val: number) => void;
  onChangeDetailText: (id: number, text: string) => void;
  onChangeDetailWeight: (id: number, weight: number) => void;
  onAddDetail: () => void;
  onDeleteDetail: (id: number) => void;
}

export default function CriteriaEditRow({
  criterion,
  onChangeCategoryWeight,
  onChangeDetailText,
  onChangeDetailWeight,
  onAddDetail,
  onDeleteDetail
}: CriteriaEditRowProps) {
  return (
    <div className={styles.row}>
      
      {/* 1. 카테고리 카드 렌더링셀 */}
      <div className={styles.typeCell}>
        <CriteriaTypeCard criterionType={criterion.criterion_type} />
      </div>

      {/* 2. 세부 평가 기준란 목록 에디터 */}
      <DetailCriteriaEditor
        detailCriteria={criterion.detail_criteria}
        onChangeDetailText={onChangeDetailText}
        onChangeDetailWeight={onChangeDetailWeight}
        onAddDetail={onAddDetail}
        onDeleteDetail={onDeleteDetail}
      />

      {/* 3. 우측 대분류 가중치 비중 바 슬라이더/넘버 세트 */}
      <CategoryWeightEditor
        value={criterion.type_weight}
        onChange={onChangeCategoryWeight}
        criterionType={criterion.criterion_type}
      />

    </div>
  );
}
