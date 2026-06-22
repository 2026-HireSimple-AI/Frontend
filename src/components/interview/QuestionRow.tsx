import React from "react";
import { Star, CheckCircle, AlertTriangle, Edit } from "lucide-react";
import { InterviewQuestion } from "../../api/interviewQuestionApi";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

interface QuestionRowProps {
  key?: any;
  question: InterviewQuestion;
  index: number;
  onOpenEditModal: (question: InterviewQuestion) => void;
}

export default function QuestionRow({
  question,
  index,
  onOpenEditModal
}: QuestionRowProps) {
  
  // Custom type-specific styling classes
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "행동":
        return "bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]";
      case "역량":
        return "bg-[#F5F8FF] text-[#3538CD] border border-[#C7D7FE]";
      case "우려검증":
        return "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]";
      case "기술검증":
        return "bg-[#FEF6EE] text-[#B93815] border border-[#F9DBAF]";
      default: // 기타
        return "bg-[#F9F5FF] text-[#6941C6] border border-[#E9D7FE]";
    }
  };

  const renderStars = (importance: number) => {
    const totalStars = 3;
    const count = importance || 1;
    
    return (
      <div className={styles.importanceStars} id={`row-stars-${question.id}`}>
        {Array.from({ length: totalStars }, (_, idx) => {
          const isFilled = idx < count;
          return (
            <Star
              key={idx}
              size={13}
              className={isFilled ? "text-[#FDB022] fill-[#FDB022]" : "text-[#D0D5DD]"}
            />
          );
        })}
      </div>
    );
  };

  return (
    <tr className={styles.questionRow} id={`question-row-${question.id}`}>
      {/* 1. 번호 */}
      <td className={styles.questionNumber} id={`cell-num-${question.id}`}>
        {index}
      </td>

      {/* 2. 질문 */}
      <td className="text-left py-3.5 pr-4" id={`cell-question-${question.id}`}>
        <div className="flex flex-col text-left">
          <span className={styles.questionText}>{question.question_text}</span>
          {question.revised_question_text && (
            <span className="text-[10px] text-[#A1A1AA] italic font-semibold mt-1">
              * 면접위원이 직접 가독성 수정을 반영함
            </span>
          )}
        </div>
      </td>

      {/* 3. 유형 */}
      <td className="text-center whitespace-nowrap" id={`cell-type-${question.id}`}>
        <span className={`${styles.questionTypeBadge} ${getTypeBadgeStyles(question.question_type)}`}>
          {question.question_type}
        </span>
      </td>

      {/* 4. 중요도 (Stars) */}
      <td className="text-center" id={`cell-importance-${question.id}`}>
        {renderStars(question.importance)}
      </td>

      {/* 5. 검수 결과 */}
      <td className="text-center whitespace-nowrap" id={`cell-compliance-${question.id}`}>
        {question.compliance_status === "준수" ? (
          <span className={`${styles.complianceStatus} text-[#16A34A]`} id={`compliance-badge-${question.id}`}>
            <CheckCircle size={14} className="text-[#22C55E] stroke-[2.5]" />
            <span>준수</span>
          </span>
        ) : (
          <span className={`${styles.complianceStatus} text-[#EF4444]`} id={`compliance-badge-${question.id}`}>
            <AlertTriangle size={14} className="text-[#EF4444] stroke-[2.5]" />
            <span>경고</span>
          </span>
        )}
      </td>

      {/* 6. 행 개별 수정 Action area */}
      <td className="text-right" id={`cell-action-${question.id}`}>
        <button
          type="button"
          className={styles.rowActionButton}
          onClick={() => onOpenEditModal(question)}
          title="질문 내용 수정하기"
          id={`row-edit-btn-${question.id}`}
        >
          <Edit size={14} />
        </button>
      </td>
    </tr>
  );
}
