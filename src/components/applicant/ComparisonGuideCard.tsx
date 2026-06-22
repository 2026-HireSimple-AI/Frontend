import React from "react";
import { TrendingUp, FileText, Percent, Database, Info } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface GuideItem {
  icon: React.ReactNode;
  label: string;
  description: string;
}

export default function ComparisonGuideCard() {
  const guideItems: GuideItem[] = [
    {
      icon: <TrendingUp size={14} />,
      label: "종합 적합도",
      description: "모든 평가 항목을 종합한 최종 점수"
    },
    {
      icon: <FileText size={14} />,
      label: "상세 점수",
      description: "평가 항목별 점수와 가중 반영 점수"
    },
    {
      icon: <Percent size={14} />,
      label: "기술 스택 적합도",
      description: "요구 기술 대비 보유 기술 비율"
    },
    {
      icon: <Database size={14} />,
      label: "기술 스택",
      description: "보유한 주요 기술 스택 목록"
    }
  ];

  return (
    <div className={styles.guideCard} id="comparison-guide-card">
      <h4 className={styles.guideTitle}>비교 항목 안내</h4>
      <p className={styles.guideDesc}>
        선택한 지원자들의 평가 항목별 점수와 기술 스택 보유 현황을 한눈에 비교할 수 있습니다.
      </p>
      <div>
        {guideItems.map((item, index) => (
          <div key={index} className={styles.guideItem}>
            <div className={styles.guideIconWrapper}>
              {item.icon}
            </div>
            <div className="flex-grow select-none">
              <span className={styles.guideLabel}>{item.label}</span>
              <p className={styles.guideValue}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
