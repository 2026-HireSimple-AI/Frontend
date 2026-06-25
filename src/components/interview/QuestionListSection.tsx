import React from "react";
import QuestionTypeTabs from "./QuestionTypeTabs";
import InterviewQuestionTable from "./InterviewQuestionTable";
import { InterviewQuestion } from "../../api/interviewQuestionApi";

interface QuestionListSectionProps {
  questions: InterviewQuestion[];
  activeQuestionType: string;
  isGenerating: boolean;
  onRegenerate: () => void;
  onOpenEditModal: (question: InterviewQuestion) => void;
  onChangeQuestionType: (type: string) => void; // Include for seamless filtering
}

export default function QuestionListSection({
  questions = [],
  activeQuestionType = "전체",
  isGenerating = false,
  onRegenerate,
  onOpenEditModal,
  onChangeQuestionType
}: QuestionListSectionProps) {

  // Dynamic count calculator for categories
  const calculateCountsByCategories = (): Record<string, number> => {
    const rawCounts: Record<string, number> = {
      전체: questions.length,
      행동: 0,
      역량: 0,
      우려검증: 0,
      기술검정: 0,
      기타: 0
    };

    questions.forEach((q) => {
      const type = (q.question_type || "").replace(/\s/g, "");

      let normalizedType = type;
      if (type.includes("기술")) normalizedType = "기술검정";
      else if (type.includes("우려")) normalizedType = "우려검증";

      if (normalizedType in rawCounts) {
        rawCounts[normalizedType] += 1;
      } else {
        rawCounts["기타"] += 1;
      }
    });

    return rawCounts;
  };

  const counts = calculateCountsByCategories();

  // Filter questions for display
  const filteredQuestions = questions.filter((q) => {
    if (activeQuestionType === "전체") return true;

    const type = (q.question_type || "").replace(/\s/g, "");
    if (activeQuestionType === "기술검정") return type.includes("기술");
    if (activeQuestionType === "우려검증") return type.includes("우려");
    return type === activeQuestionType;
  });

  const isEmpty = questions.length === 0;

  // Handle edit action for the parent component edit modal with a placeholder first question if none loaded
  const handleEditClick = () => {
    if (questions.length > 0) {
      onOpenEditModal(questions[0]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5" id="question-list-section-card">
      {/* Title & Status Header */}
      <div className="flex items-center justify-between" id="question-list-header-wrap">
        <div className="flex items-center gap-2.5" id="question-list-title-badge-layout">
          <h3 className="text-base font-bold text-slate-800 leading-none">
            생성된 질문 리스트 <span className="text-slate-500">({questions.length})</span>
          </h3>
          {!isEmpty && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded border border-blue-200 select-none" id="status-badge-complete">
              생성 완료
            </span>
          )}
        </div>
      </div>

      {!isEmpty && (
        /* Tabs & 수정하기 bar */
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3" id="filters-and-edit-bar">
          <QuestionTypeTabs
            activeQuestionType={activeQuestionType}
            questionTypeCounts={counts}
            onChangeQuestionType={onChangeQuestionType}
          />

          <button
            type="button"
            onClick={handleEditClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-all shadow-2xs select-none"
            id="edit-questions-trigger-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>수정하기</span>
          </button>
        </div>
      )}

      {/* Embedded Questions List Table */}
      <div id="questions-table-placeholder">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-24 select-none" id="generation-loader-state">
            <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <h4 className="text-xs font-bold text-slate-800 mb-1">인공지능 질문을 조율하고 있습니다...</h4>
            <p className="text-[10px] text-slate-400 font-semibold">잠시만 기다려 주시면 법령 오소독스를 필터링한 질문이 생성됩니다.</p>
          </div>
        ) : (
          <InterviewQuestionTable
            questions={filteredQuestions}
            onOpenEditModal={onOpenEditModal}
          />
        )}
      </div>
    </div>
  );
}
