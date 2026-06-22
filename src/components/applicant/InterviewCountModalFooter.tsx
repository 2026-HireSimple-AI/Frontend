import React from "react";
// @ts-ignore
import styles from "../../styles/InterviewCountModal.module.css";

interface InterviewCountModalFooterProps {
  count: number;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function InterviewCountModalFooter({
  count,
  isLoading,
  onCancel,
  onConfirm,
  disabled = false
}: InterviewCountModalFooterProps) {
  return (
    <div className={styles.footer} id="interview-count-modal-footer">
      <button
        type="button"
        className={styles.cancelButton}
        onClick={onCancel}
        disabled={isLoading}
        id="interview-count-modal-cancel-btn"
      >
        취소
      </button>

      <button
        type="button"
        className={styles.confirmButton}
        onClick={onConfirm}
        disabled={isLoading || disabled}
        id="interview-count-modal-confirm-btn"
      >
        {isLoading ? "준비 중..." : "확인"}
      </button>
    </div>
  );
}
