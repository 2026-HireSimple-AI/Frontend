import React from "react";
import { Briefcase, User, Star } from "lucide-react";
// @ts-ignore
import styles from "../../styles/CriteriaEditModal.module.css";

interface CriteriaTypeCardProps {
  criterionType: string;
}

export default function CriteriaTypeCard({ criterionType }: CriteriaTypeCardProps) {
  const isWork = criterionType === "주요 업무" || criterionType === "주요업무";
  const isQual = criterionType === "자격 조건" || criterionType === "자격조건";
  const isPref = criterionType === "우대 사항" || criterionType === "우대사항";

  let cardClass = styles.typeCardPrimary;
  let Icon = Briefcase;

  if (isWork) {
    cardClass = styles.typeCardPrimary;
    Icon = Briefcase;
  } else if (isQual) {
    cardClass = styles.typeCardSuccess;
    Icon = User;
  } else if (isPref) {
    cardClass = styles.typeCardWarning;
    Icon = Star;
  }

  return (
    <div className={`${styles.typeCard} ${cardClass}`}>
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
        <Icon size={16} className="text-current" />
      </div>
      <span>{criterionType}</span>
    </div>
  );
}
