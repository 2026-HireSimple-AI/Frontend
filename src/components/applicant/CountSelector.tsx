import React from "react";
// @ts-ignore
import styles from "../../styles/InterviewCountModal.module.css";

interface CountSelectorProps {
  count: number;
  minCount: number;
  maxCount: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChangeCount: (count: number) => void;
}

export default function CountSelector({
  count,
  minCount,
  maxCount,
  onDecrease,
  onIncrease,
  onChangeCount
}: CountSelectorProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Strip everything that is not a numeric digit
    const cleaned = val.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      onChangeCount(0); // permit temporary empty state, but clamp on blur or let parent validate
      return;
    }
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      onChangeCount(num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigational and control keys
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End"
    ];
    
    // Command combinations like Cmd+A, Ctrl+C count as allowed too
    if (e.metaKey || e.ctrlKey || allowedKeys.includes(e.key)) {
      return;
    }

    // Rely on simple regex to verify if key is a digit 0-9
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    if (isNaN(count) || count < minCount) {
      onChangeCount(minCount);
    } else if (count > maxCount) {
      onChangeCount(maxCount);
    }
  };

  return (
    <div className={styles.countSelector} id="interview-count-selector">
      <button
        type="button"
        className={styles.countButton}
        onClick={onDecrease}
        disabled={count <= minCount}
        id="interview-count-decrease-btn"
        aria-label="Decrease candidate count"
      >
        －
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className={styles.countInput}
        value={count === 0 ? "" : count}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        id="interview-count-input"
        aria-label="Interview count input"
      />

      <button
        type="button"
        className={styles.countButton}
        onClick={onIncrease}
        disabled={count >= maxCount}
        id="interview-count-increase-btn"
        aria-label="Increase candidate count"
      >
        ＋
      </button>
    </div>
  );
}
