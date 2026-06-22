import React from "react";

interface QuestionTypeTabsProps {
  activeType?: string; // "전체", "행동", "역량", "우려검증", "기술검증", "기타"
  activeQuestionType?: string;
  questionTypeCounts: Record<string, number>;
  onChangeType?: (type: string) => void;
  onChangeQuestionType?: (type: string) => void;
}

export default function QuestionTypeTabs({
  activeType,
  activeQuestionType,
  questionTypeCounts = {},
  onChangeType,
  onChangeQuestionType
}: QuestionTypeTabsProps) {
  const currentActiveType = activeType || activeQuestionType || "전체";
  const currentOnChangeType = onChangeType || onChangeQuestionType || (() => {});
  const tabs = ["전체", "행동", "역량", "우려검증", "기술검증", "기타"];

  return (
    <div className="flex flex-wrap gap-1.5" id="modal-tab-container">
      {tabs.map((type) => {
        // Handle potential naming mismatch in counts
        const countKey = type;
        const legacyKey = type === "기술검증" ? "기술검정" : type;
        const count = questionTypeCounts[countKey] !== undefined 
          ? questionTypeCounts[countKey] 
          : (questionTypeCounts[legacyKey] || 0);

        const isActive = currentActiveType === type || (type === "기술검증" && currentActiveType === "기술검정");

        return (
          <button
            key={type}
            type="button"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all select-none border ${
              isActive
                ? "bg-[#EFF8FF] text-[#155EEF] border-[#155EEF] font-bold"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
            }`}
            onClick={() => currentOnChangeType(type)}
            id={`modal-tab-${type}`}
          >
            <span>{type}</span>
            <span className={`ml-1 text-[10px] ${isActive ? "text-[#155EEF] font-bold" : "text-slate-400 font-semibold"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
