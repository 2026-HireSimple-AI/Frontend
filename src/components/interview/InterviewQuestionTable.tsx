import React from "react";
import { Star, CheckCircle, Edit2 } from "lucide-react";
import { InterviewQuestion } from "../../api/interviewQuestionApi";

interface InterviewQuestionTableProps {
  questions: InterviewQuestion[];
  onOpenEditModal: (question: InterviewQuestion) => void;
}

export default function InterviewQuestionTable({
  questions = [],
  onOpenEditModal
}: InterviewQuestionTableProps) {
  
  // Custom type-specific styling classes
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "행동":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "역량":
        return "bg-green-50 text-green-600 border border-green-100";
      case "우려검증":
        return "bg-red-50 text-red-600 border border-red-100";
      case "기술검증":
      case "기술검정":
        return "bg-orange-50 text-orange-600 border border-orange-100";
      default: // 기타
        return "bg-purple-50 text-purple-600 border border-purple-100";
    }
  };

  const renderStars = (importance: number) => {
    const totalStars = 3;
    const count = importance || 1;
    
    return (
      <div className="flex items-center justify-center gap-0.5">
        {Array.from({ length: totalStars }, (_, idx) => {
          const isFilled = idx < count;
          return (
            <Star
              key={idx}
              size={13}
              className={isFilled ? "text-amber-400 fill-amber-400" : "text-slate-200"}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="overflow-hidden w-full bg-white border border-slate-100 rounded-xl shadow-xs" id="interview-question-table-scroll-container">
      <table className="w-full text-left border-collapse table-auto" id="interview-question-table-element">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 text-center w-16">번호</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 text-left">질문</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 text-center w-24">유형</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 text-center w-24">중요도</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 text-center w-28">검수 결과</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 text-center w-24">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {questions.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-sm text-slate-400 text-center bg-white font-medium">
                아직 생성된 면접 질문이 없습니다.
              </td>
            </tr>
          ) : (
            questions.map((q, idx) => (
              <tr 
                key={q.id} 
                className="hover:bg-slate-50/40 transition-colors"
                id={`question-row-${q.id}`}
              >
                {/* 1. 번호 */}
                <td className="py-4 px-4 text-center text-xs font-semibold text-slate-400" id={`cell-num-${q.id}`}>
                  {idx + 1}
                </td>

                {/* 2. 질문 */}
                <td className="py-4 px-4 text-xs font-medium text-slate-700 leading-relaxed" id={`cell-question-${q.id}`}>
                  <div className="flex flex-col text-left pr-4">
                    <span>{q.question_text}</span>
                    {q.revised_question_text && (
                      <span className="text-[10px] text-zinc-400 font-semibold mt-1">
                        * 직접 수정한 질문입니다.
                      </span>
                    )}
                  </div>
                </td>

                {/* 3. 유형 */}
                <td className="py-4 px-4 text-center whitespace-nowrap" id={`cell-type-${q.id}`}>
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${getTypeBadgeStyles(q.question_type)}`}>
                    {q.question_type}
                  </span>
                </td>

                {/* 4. 중요도 */}
                <td className="py-4 px-4 text-center" id={`cell-importance-${q.id}`}>
                  {renderStars(q.importance)}
                </td>

                {/* 5. 검수 결과 */}
                <td className="py-4 px-4 text-center whitespace-nowrap" id={`cell-compliance-${q.id}`}>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50/40 border border-emerald-100 px-2 py-1 rounded-md">
                    <CheckCircle size={12} className="text-emerald-500 fill-emerald-100" />
                    <span>준수</span>
                  </div>
                </td>

                {/* 6. 관리 (수정 버튼) */}
                <td className="py-4 px-4 text-center whitespace-nowrap" id={`cell-action-${q.id}`}>
                  <button
                    type="button"
                    onClick={() => onOpenEditModal(q)}
                    className="h-8 px-3 rounded-lg border border-[#D4D9E1] text-[#1C1F26] bg-white text-xs font-semibold hover:bg-[#F6F8FC] cursor-pointer transition-all active:scale-95 shadow-2xs inline-flex items-center gap-1 justify-center mx-auto"
                    title="질문 수정하기"
                  >
                    <Edit2 size={12} className="text-[#707887]" />
                    <span>수정</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
