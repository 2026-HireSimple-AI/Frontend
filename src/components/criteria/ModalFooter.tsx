import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";

interface ModalFooterProps {
  isValid: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
  errorMessage?: string | null;
}

export default function ModalFooter({
  isValid,
  isSaving,
  onCancel,
  onSave,
  errorMessage
}: ModalFooterProps) {
  return (
    <div className="flex flex-col border-t border-[#E6EAF0]">
      {/* 백엔드 API 에러 인라인 안착점 개척 */}
      {errorMessage && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-xs text-[#EF4444] font-medium border-b border-red-100 select-none animate-fade-in">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 내부 실 배포 단락 */}
      <div className={styles.footer}>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className={styles.cancelButton}
          type="button"
        >
          취소
        </button>

        <button
          onClick={onSave}
          disabled={!isValid || isSaving}
          className={`${styles.saveButton} ${(!isValid || isSaving) ? styles.saveButtonDisabled : ""}`}
          type="button"
        >
          {isSaving ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>저장 중...</span>
            </>
          ) : (
            <span>저장</span>
          )}
        </button>
      </div>
    </div>
  );
}
