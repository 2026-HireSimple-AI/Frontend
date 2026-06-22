import React, { useState, useRef } from "react";
import { Info } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

export default function ApplicantAnalysisHoverTrigger() {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // 2.5초 (2-3초 수치 범위) 딜레이 타이머 등록
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // 즉시 숨김
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id="applicant-analysis-help-trigger"
    >
      <button 
        className={styles.infoIcon}
        aria-label="평가 가중치 안내 정보"
        type="button"
      >
        <Info size={18} />
      </button>

      {isVisible && (
        <div className={styles.tooltipPanel} id="delayed-tooltip-panel">
          <h4 className={styles.tooltipTitle}>📊 평가지표 배점 가중치</h4>
          <div className={styles.tooltipItem}>
            <span>자격 요건 적합도</span>
            <span className={styles.tooltipItemValue}>30%</span>
          </div>
          <div className={styles.tooltipItem}>
            <span>기술 스택 적합도</span>
            <span className={styles.tooltipItemValue}>20%</span>
          </div>
          <div className={styles.tooltipItem}>
            <span>주요업무 적합도</span>
            <span className={styles.tooltipItemValue}>30%</span>
          </div>
          <div className={styles.tooltipItem}>
            <span>우대사항 적합도</span>
            <span className={styles.tooltipItemValue}>20%</span>
          </div>
          <p className={styles.tooltipFooter}>
            * 각 대분류 항목의 가중 반영 결과의 합산으로 종합 점수가 연산 출력됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
