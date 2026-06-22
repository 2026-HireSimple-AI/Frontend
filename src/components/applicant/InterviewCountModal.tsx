import React, { useState, useEffect } from "react";
import { X, Users } from "lucide-react";
import CountSelector from "./CountSelector";
import InterviewCountModalFooter from "./InterviewCountModalFooter";
// @ts-ignore
import styles from "../../styles/InterviewCountModal.module.css";

interface ApplicantItem {
  id: number;
  masked_code: string;
  total_score: number;
}

interface InterviewCountModalProps {
  isOpen: boolean;
  applicants: ApplicantItem[];
  defaultCount?: number;
  minCount?: number;
  maxCount?: number;
  onClose: () => void;
  onConfirm: (selectedApplicantIds: number[]) => Promise<void>;
}

export default function InterviewCountModal({
  isOpen,
  applicants = [],
  defaultCount,
  minCount = 1,
  maxCount: propMaxCount,
  onClose,
  onConfirm
}: InterviewCountModalProps) {
  // Try fallback to localStorage if defaultCount is undefined or 1
  const savedLimit = typeof window !== "undefined" ? localStorage.getItem("selected_ranking_limit") : null;
  const resolvedDefault = defaultCount !== undefined && defaultCount !== 1
    ? defaultCount 
    : (savedLimit ? Number(savedLimit) : 5);

  const [interviewCount, setInterviewCount] = useState<number>(resolvedDefault);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto calculate maxCount as specified:
  // - If applicants.length >= 3, maxCount = 3
  // - If applicants.length < 3, maxCount = applicants.length
  // Lift this boundary if the default limit is 5 or 20
  const baseMax = applicants.length >= 3 ? 3 : applicants.length;
  const computedMaxCount = propMaxCount !== undefined 
    ? propMaxCount 
    : (applicants.length > 0 ? Math.min(Math.max(resolvedDefault, baseMax), applicants.length) : Math.max(resolvedDefault, baseMax));

  // Set default count to minCount if necessary when modal is opened or applicants count changes
  useEffect(() => {
    if (isOpen) {
      if (applicants.length === 0) {
        setInterviewCount(0);
      } else {
        setInterviewCount(Math.min(resolvedDefault, computedMaxCount || 1));
      }
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [isOpen, applicants.length, computedMaxCount, resolvedDefault]);

  if (!isOpen) return null;

  const isEmpty = applicants.length === 0;

  // Validation function
  const validateCount = (count: number): boolean => {
    if (isEmpty) {
      setErrorMessage("면접 질문을 생성할 지원자가 없습니다.");
      return false;
    }
    if (isNaN(count) || count < minCount) {
      setErrorMessage("최소 1명 이상 선택해 주세요.");
      return false;
    }
    if (count > computedMaxCount) {
      setErrorMessage(`최대 ${computedMaxCount}명까지 선택할 수 있습니다.`);
      return false;
    }
    if (count > applicants.length) {
      setErrorMessage("분석된 지원자 수보다 많이 선택할 수 없습니다.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleDecrease = () => {
    const nextCount = Math.max(minCount, interviewCount - 1);
    setInterviewCount(nextCount);
    validateCount(nextCount);
  };

  const handleIncrease = () => {
    const nextCount = Math.min(computedMaxCount, interviewCount + 1);
    setInterviewCount(nextCount);
    validateCount(nextCount);
  };

  const handleChangeCount = (count: number) => {
    setInterviewCount(count);
    validateCount(count);
  };

  const handleConfirm = async () => {
    if (!validateCount(interviewCount)) {
      return;
    }

    setIsLoading(true);
    try {
      // 1. Sort applicants by total_score descending.
      const sorted = [...applicants].sort((a, b) => b.total_score - a.total_score);
      // 2. Select the top N applicants.
      const selected = sorted.slice(0, interviewCount).map((a) => a.id);
      
      // 3. Pass selectedApplicantIds to the next page / parent onConfirm.
      await onConfirm(selected);
    } catch (error) {
      console.error("Error during confirm N applicants", error);
      setErrorMessage("면접 진입 도중 요류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isConfirmDisabled = isEmpty || !!errorMessage || interviewCount < minCount || interviewCount > computedMaxCount;

  return (
    <div className={styles.overlay} id="interview-count-modal-overlay">
      <div className={styles.modal} id="interview-count-modal-container">
        {/* CloseButton */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
          id="interview-count-modal-close-btn"
        >
          <X size={20} />
        </button>

        {/* ModalIcon */}
        <div className={styles.iconWrap} id="interview-count-modal-icon">
          <Users size={32} />
        </div>

        {/* ModalTitle */}
        <h3 className={styles.title} id="interview-count-modal-title">
          면접 인원 설정
        </h3>

        {/* ModalDescription */}
        <p className={styles.description} id="interview-count-modal-desc">
          선택할 인원수를 설정해주세요.
        </p>

        {isEmpty ? (
          /* Empty State */
          <div className="py-6 text-center select-none text-red-500 font-bold text-xs" id="interview-count-modal-empty-state">
            <p>면접 질문을 생성할 지원자가 없습니다.</p>
            <p className="mt-1 text-gray-500 font-medium">지원자 분석을 먼저 진행해 주세요.</p>
          </div>
        ) : (
          /* Count Selector */
          <>
            <CountSelector
              count={interviewCount}
              minCount={minCount}
              maxCount={computedMaxCount}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              onChangeCount={handleChangeCount}
            />

            {/* Error Message */}
            {errorMessage && (
              <div className={styles.errorMessage} id="interview-count-modal-error">
                {errorMessage}
              </div>
            )}

            {/* ConfirmText */}
            {!errorMessage && (
              <p className={styles.confirmText} id="interview-count-modal-confirm-text">
                {interviewCount}명의 면접 질문을 생성할까요?
              </p>
            )}
          </>
        )}

        {/* ModalFooter */}
        <InterviewCountModalFooter
          count={interviewCount}
          isLoading={isLoading}
          onCancel={onClose}
          onConfirm={handleConfirm}
          disabled={isConfirmDisabled}
        />

        {/* HelperText */}
        <div className={styles.helperText} id="interview-count-modal-helper-text">
          적합도 점수가 높은 지원자부터 질문이 생성됩니다.
        </div>
      </div>
    </div>
  );
}
