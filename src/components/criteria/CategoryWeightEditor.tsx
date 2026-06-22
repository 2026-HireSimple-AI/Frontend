import React from "react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";

interface CategoryWeightEditorProps {
  value: number;
  onChange: (val: number) => void;
  criterionType: string;
}

export default function CategoryWeightEditor({
  value,
  onChange,
  criterionType
}: CategoryWeightEditorProps) {
  const isWork = criterionType === "주요 업무" || criterionType === "주요업무";
  const isQual = criterionType === "자격 조건" || criterionType === "자격조건";

  // 기본 트랙 테마 색상 결정
  let activeColor = "#FF9D3B"; // Orange
  if (isWork) {
    activeColor = "#00194B"; // Navy
  } else if (isQual) {
    activeColor = "#22C55E"; // Green
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(0, Math.min(100, Number(e.target.value)));
    onChange(val);
  };

  return (
    <div className={styles.weightCell}>
      
      {/* 1. 슬라이더 바 파트 */}
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={handleSliderChange}
          className={styles.slider}
          style={{
            background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${value}%, #EEF2F6 ${value}%, #EEF2F6 100%)`
          }}
        />
        <div className={styles.sliderLabel}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* 2. 하부 숫자 정교 조절 장치 */}
      <div className={styles.numberInputWrapper}>
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={handleNumberChange}
          className={styles.numberInput}
        />
        <span className={styles.percentText}>%</span>
      </div>

    </div>
  );
}
