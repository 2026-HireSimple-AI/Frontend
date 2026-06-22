import React from "react";
import { Info } from "lucide-react";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

export default function BottomNotice() {
  return (
    <div className={styles.bottomNotice} id="bottom-notice-info-bar">
      <Info size={16} className="text-[#175CD3] flex-shrink-0 stroke-[2.5]" />
      <span className="text-xs font-semibold text-[#344054] text-left leading-relaxed">
        질문은 중요도 순으로 정렬되어 있습니다. 면접 시간과 흐름에 맞게 순서를 조정하여 활용하세요.
      </span>
    </div>
  );
}
