import React, { useState } from "react";
import { Sparkles, MessageSquare } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface GenerateInterviewButtonProps {
  onGenerate: () => Promise<void>;
  disabled?: boolean;
}

export default function GenerateInterviewButton({
  onGenerate,
  disabled = false
}: GenerateInterviewButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (isPending || disabled) return;
    setIsPending(true);
    try {
      await onGenerate();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      id="generate-interview-trigger-btn"
      className={styles.generateButton}
      onClick={handleClick}
      disabled={isPending || disabled}
    >
      {isPending ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>질문 구성 생성 중...</span>
        </>
      ) : (
        <>
          <Sparkles size={16} className="text-amber-300 animate-pulse" />
          <span>면접 질문 생성하기</span>
        </>
      )}
    </button>
  );
}
