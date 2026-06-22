import React from "react";
import { CheckSquare } from "lucide-react";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

interface SaveQuestionListButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export default function SaveQuestionListButton({
  isLoading,
  onClick
}: SaveQuestionListButtonProps) {
  return (
    <button
      type="button"
      className={styles.saveButton}
      onClick={onClick}
      disabled={isLoading}
      id="save-question-list-btn"
    >
      <CheckSquare size={16} className={isLoading ? "animate-pulse" : ""} />
      <span>{isLoading ? "저장 중..." : "면접 질문 목록 저장"}</span>
    </button>
  );
}
