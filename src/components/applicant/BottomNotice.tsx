import React from "react";
import { ArrowRightCircle } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantAnalysisPage.module.css";

interface BottomNoticeProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function BottomNotice({ className, style }: BottomNoticeProps) {
  return (
    <div className={`${styles.bottomNotice} ${className || ""}`} style={style} id="bottom-transition-notice">
      <div className="w-8 h-8 rounded-full bg-[#EEF3FA] flex items-center justify-center text-[#6D5DFC] flex-shrink-0">
        <ArrowRightCircle size={18} />
      </div>
      <div>
        <span className="text-[10px] font-bold text-[#6D5DFC] block uppercase tracking-wider">NEXT STAGE</span>
        <p className={styles.noticeText}>
          다음 단계: 지원자와 맞춤 면접 질문을 생성하여 면접을 준비하세요.
        </p>
      </div>
    </div>
  );
}
