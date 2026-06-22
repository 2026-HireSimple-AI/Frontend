import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";

interface TotalWeightWarningProps {
  totalWeight: number;
  isValid: boolean;
}

export default function TotalWeightWarning({ totalWeight, isValid }: TotalWeightWarningProps) {
  return (
    <div className={`${styles.warningBox} ${isValid ? styles.warningBoxSuccess : ""}`}>
      
      {/* 왼쪽 메인 경고 가이드 */}
      <div className={styles.warningContent}>
        {isValid ? (
          <CheckCircle2 size={18} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={18} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
        )}
        
        <div className="flex flex-col gap-0.5 select-none">
          {isValid ? (
            <p className={`${styles.warningText} ${styles.warningTextSuccess}`}>
              가중치 총합 구성이 정상적입니다 (100%).
            </p>
          ) : (
            <>
              <p className={styles.warningText}>
                가중치 총합은 100%여야 합니다 (현재 {totalWeight}%).
              </p>
              <p className="text-[10px] text-[#707887] font-medium leading-relaxed">
                각 항목의 대분류 가중치를 조정하여 100%를 맞춰주세요.
              </p>
            </>
          )}
        </div>
      </div>

      {/* 우측 분수 비율 상태 캡슐 */}
      <div className={styles.totalBox}>
        <span className={styles.totalBoxText}>가중치 총합</span>
        <span className={`text-[13px] font-extrabold ${isValid ? "text-[#16A34A]" : "text-[#EF4444]"}`}>
          {totalWeight}%
        </span>
        <span className="text-[10px] font-bold text-[#98A0AE]">/ 100</span>
      </div>

    </div>
  );
}
