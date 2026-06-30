import React, { useState, useEffect } from "react";
import { RotateCcw, X, AlertCircle } from "lucide-react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";
import { TypeCriterion, DetailCriterion } from "./CriteriaWeightTable";
import CriteriaEditRow from "./CriteriaEditRow";
import TotalWeightWarning from "./TotalWeightWarning";
import ModalFooter from "./ModalFooter";

interface CriteriaEditModalProps {
  isOpen: boolean;
  criteriaList: TypeCriterion[];
  onClose: () => void;
  onSave: (updatedList: TypeCriterion[]) => void;
}

export default function CriteriaEditModal({
  isOpen,
  criteriaList,
  onClose,
  onSave
}: CriteriaEditModalProps) {
  // 드래프트 상태 관리
  const [draftCriteriaList, setDraftCriteriaList] = useState<TypeCriterion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 모달이 열리면 draft 복사 동기화
  useEffect(() => {
    if (isOpen) {
      if (criteriaList && criteriaList.length > 0) {
        // 객체의 깊은 복사 (Deep Copy)를 통해 원본 Props 데이터 훼손 방지
        const cloned: TypeCriterion[] = JSON.parse(JSON.stringify(criteriaList));
        setDraftCriteriaList(cloned);
      } else {
        setDraftCriteriaList([]);
      }
      setIsSaving(false);
      setErrorMessage(null);
    }
  }, [isOpen, criteriaList]);

  if (!isOpen) return null;

  // 가중치 누적치 기하학합 계산
  const totalWeight = draftCriteriaList.reduce((acc, curr) => acc + (curr.type_weight || 0), 0);
  const isValid = totalWeight === 100;

  // 초기화 버튼 동작 (원래 prop 전달받은 원소대로 원복)
  const handleReset = () => {
    const cloned: TypeCriterion[] = JSON.parse(JSON.stringify(criteriaList));
    setDraftCriteriaList(cloned);
    setErrorMessage(null);
  };

  // 대분류 가중치 수정 처리 (하위 세부 항목에 비례 배분)
  const handleChangeCategoryWeight = (typeId: number, val: number) => {
    setDraftCriteriaList(prev =>
      prev.map(cat => {
        if (cat.id === typeId) {
          const detailCount = cat.detail_criteria.length;
          if (detailCount === 0) {
          return { ...cat, type_weight: val };
          }

          const currentSum = cat.detail_criteria.reduce((sum, d) => sum + (d.weight || 0), 0);

          let updatedDetails: DetailCriterion[];
          if (currentSum === 0) {
            // 기존 합이 0인 경우 균등 분배
            const base = Math.floor(val / detailCount);
            let remainder = val % detailCount;
            updatedDetails = cat.detail_criteria.map((det, idx) => {
              const extra = idx < remainder ? 1 : 0;
              return { ...det, weight: base + extra };
            });
          } else {
            // 비례 배분 계산
            let allocatedSum = 0;
            const tempDetails = cat.detail_criteria.map((det) => {
              const portion = (det.weight / currentSum) * val;
              const rounded = Math.round(portion);
              allocatedSum += rounded;
              return { ...det, weight: rounded };
            });

            // 반올림 누적으로 인한 차이 보정
            const diff = val - allocatedSum;
            if (diff !== 0 && tempDetails.length > 0) {
              tempDetails[0].weight = Math.max(0, tempDetails[0].weight + diff);
            }
            updatedDetails = tempDetails;
          }

          return { ...cat, detail_criteria: updatedDetails, type_weight: val };
        }
        return cat;
      })
    );
  };

  // 세부 지표 텍스트 수정 처리
  const handleChangeDetailText = (typeId: number, detailId: number, text: string) => {
    setDraftCriteriaList(prev =>
      prev.map(cat => {
        if (cat.id === typeId) {
          const updatedDetails = cat.detail_criteria.map(det => {
            if (det.id === detailId) {
              return { ...det, detail: text };
            }
            return det;
          });
          return { ...cat, detail_criteria: updatedDetails };
        }
        return cat;
      })
    );
  };

  // 세부 지표 개별 가중치 입력 처리 (대분류 가중치를 이들의 합으로 자동 업데이트)
  const handleChangeDetailWeight = (typeId: number, detailId: number, val: number) => {
    setDraftCriteriaList(prev =>
      prev.map(cat => {
        if (cat.id === typeId) {
          const updatedDetails = cat.detail_criteria.map(det => {
            if (det.id === detailId) {
              return { ...det, weight: val };
            }
            return det;
          });
          const sumWeight = updatedDetails.reduce((sum, det) => sum + (det.weight || 0), 0);
          return { ...cat, detail_criteria: updatedDetails, type_weight: sumWeight };
        }
        return cat;
      })
    );
  };

  // 세부 지표 추가 처리 (합산 보존 및 디폴트 추가 가중치 반영)
  const handleAddDetail = (typeId: number) => {
    setDraftCriteriaList(prev =>
      prev.map(cat => {
        if (cat.id === typeId) {
          const randomId = Math.floor(Math.random() * 800000) + 100000;
          const currentCount = cat.detail_criteria.length;
          
          // 디폴트 추가 가중치
          const defaultNewWeight = 10;

          const newDetail: DetailCriterion = {
            id: randomId,
            detail: "",
            weight: defaultNewWeight
          };

          const updatedDetails = [...cat.detail_criteria, newDetail];
          const sumWeight = updatedDetails.reduce((sum, det) => sum + (det.weight || 0), 0);

          return {
            ...cat,
            detail_criteria: updatedDetails,
            type_weight: sumWeight
          };
        }
        return cat;
      })
    );
  };

  // 세부 지표 삭제 처리 (합산 갱신)
  const handleDeleteDetail = (typeId: number, detailId: number) => {
    setDraftCriteriaList(prev =>
      prev.map(cat => {
        if (cat.id === typeId) {
          const filteredDetails = cat.detail_criteria.filter(det => det.id !== detailId);
          const sumWeight = filteredDetails.reduce((sum, det) => sum + (det.weight || 0), 0);
          return { ...cat, detail_criteria: filteredDetails, type_weight: sumWeight };
        }
        return cat;
      })
    );
  };

  // 저장 처리 개시
  const handleSave = async () => {
    // 1차 유효성 밸리데이션 통과 검증
    if (!isValid) {
      setErrorMessage("가중치의 총합은 무조건 100%여야 저장이 성립합니다.");
      return;
    }

    // 빈칸 누락 세부 검출
    for (const cat of draftCriteriaList) {
      if (!cat.criterion_type.trim()) {
        setErrorMessage("평가 항목명이 완전하게 입력되어야 합니다.");
        return;
      }
      for (const det of cat.detail_criteria) {
        if (!det.detail.trim()) {
          setErrorMessage(`'${cat.criterion_type}' 안의 공백 세부 평가 지표를 완성하거나 삭제하십시오.`);
          return;
        }
      }
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      // 상위 Page 콜백 실행 후 자녀창 소팅 마감
      await onSave(draftCriteriaList);
    } catch (err: any) {
      setErrorMessage(err.message || "평가 기준 가중치 수정 업데이터 중 통신 장애가 터졌습니다.");
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* 1. 모달 메인 헤더 단락 */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>가중치 수정</h2>
            <p className={styles.description}>총합이 100%가 되도록 가중치를 설정해주세요.</p>
          </div>

          <div className={styles.headerActions}>
            {/* 초기화 트리거 배너 */}
            <button
              onClick={handleReset}
              className={styles.resetButton}
              type="button"
            >
              <RotateCcw size={12} />
              <span>초기화</span>
            </button>

            {/* X 소멸 아이콘 */}
            <button
              onClick={onClose}
              className={styles.closeButton}
              type="button"
              title="창 닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. 에디터 본문 구조 */}
        <div className={styles.table}>
          
          {/* 테이블 칼럼 헤더 바 */}
          <div className={styles.tableHeader}>
            <span>평가 항목</span>
            <span>세부 평가 기준</span>
            <span className="text-center">가중치 (%)</span>
          </div>

          {/* 에디팅 리스트 목록 */}
          {draftCriteriaList && draftCriteriaList.length > 0 ? (
            <div className="flex flex-col">
              {draftCriteriaList.map((criterion) => (
                <CriteriaEditRow
                  key={criterion.id}
                  criterion={criterion}
                  onChangeCategoryWeight={(val) => handleChangeCategoryWeight(criterion.id, val)}
                  onChangeDetailText={(detailId, text) => handleChangeDetailText(criterion.id, detailId, text)}
                  onChangeDetailWeight={(detailId, weight) => handleChangeDetailWeight(criterion.id, detailId, weight)}
                  onAddDetail={() => handleAddDetail(criterion.id)}
                  onDeleteDetail={(detailId) => handleDeleteDetail(criterion.id, detailId)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-gray-400 select-none">
              <p className="font-bold">수정할 평가 기준이 비어있습니다.</p>
              <p className="text-[10px] text-gray-300 mt-1">평가 기준을 먼저 공고문 파싱을 통해 도출하십시오.</p>
            </div>
          )}

        </div>

        {/* 3. 실시간 비율 가중치 도구 배너 경고 */}
        <TotalWeightWarning
          totalWeight={totalWeight}
          isValid={isValid}
        />

        {/* 4. 최종 취소/저장 액션 단락 */}
        <ModalFooter
          isValid={isValid && draftCriteriaList.length > 0}
          isSaving={isSaving}
          onCancel={onClose}
          onSave={handleSave}
          errorMessage={errorMessage}
        />

      </div>
    </div>
  );
}
