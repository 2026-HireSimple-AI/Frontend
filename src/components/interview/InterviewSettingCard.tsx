import React from "react";
import { Sparkles, Minus, Plus } from "lucide-react";

interface InterviewSettingCardProps {
  interviewTime: string; // "30분", "45분", "60분", "90분"
  questionCount: number;
  selectedQuestionTypes: string[];
  onChangeInterviewTime: (time: string) => void;
  onChangeQuestionCount: (count: number) => void;
  onChangeQuestionTypes: (types: string[]) => void;
  onGenerateQuestions: () => void;
  isGenerating?: boolean; // make optional to be safe
}

export default function InterviewSettingCard({
  interviewTime = "45분",
  questionCount = 9,
  selectedQuestionTypes = [],
  onChangeInterviewTime,
  onChangeQuestionCount,
  onChangeQuestionTypes,
  onGenerateQuestions,
  isGenerating = false
}: InterviewSettingCardProps) {

  const timeOptions = [
    { label: "30분", range: "5~7개", min: 5, max: 7, recommend: "5 ~ 7개" },
    { label: "45분", range: "8~10개", min: 8, max: 10, recommend: "8 ~ 10개" },
    { label: "60분", range: "10~14개", min: 10, max: 14, recommend: "10 ~ 14개" },
    { label: "90분", range: "15~20개", min: 15, max: 20, recommend: "15 ~ 20개" }
  ];

  const currentOption = timeOptions.find(opt => opt.label === interviewTime) || timeOptions[1];

  const handleTimeSelect = (label: string) => {
    if (isGenerating) return;
    onChangeInterviewTime(label);
    
    // Automatically set default count to mid-point of the selected time range
    const chosen = timeOptions.find(opt => opt.label === label);
    if (chosen) {
      onChangeQuestionCount(chosen.min + Math.round((chosen.max - chosen.min) / 2));
    }
  };

  const handleDecrease = () => {
    if (isGenerating) return;
    if (questionCount > 1) {
      onChangeQuestionCount(questionCount - 1);
    }
  };

  const handleIncrease = () => {
    if (isGenerating) return;
    if (questionCount < 30) {
      onChangeQuestionCount(questionCount + 1);
    }
  };

  const handleCheckboxToggle = (type: string) => {
    if (isGenerating) return;
    let nextTypes = [...selectedQuestionTypes];
    if (nextTypes.includes(type)) {
      if (nextTypes.length > 1) {
        nextTypes = nextTypes.filter(t => t !== type);
      }
    } else {
      nextTypes.push(type);
    }
    onChangeQuestionTypes(nextTypes);
  };

  const typeDefinitions = [
    { value: "행동", display: "행동 (Behavior)" },
    { value: "역량", display: "역량 (Competency)" },
    { value: "우려검증", display: "우려검증 (Risk Verification)" },
    { value: "기술검정", display: "기술검정 (Technical)" },
    { value: "기타", display: "기타 (General)" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5" id="interview-setting-card-container">
      <h3 className="text-sm font-bold text-slate-800" id="interview-setting-card-title">면접 설정</h3>

      {/* 1. 면접 시간 */}
      <div id="setting-time-picker-area">
        <label className="text-xs font-bold text-slate-700 block mb-2 select-none text-left">면접 시간</label>
        <div className="grid grid-cols-4 gap-1.5" id="time-options-grid">
          {timeOptions.map((opt) => {
            const isActive = opt.label === interviewTime;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleTimeSelect(opt.label)}
                disabled={isGenerating}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isActive
                    ? "border-blue-600 bg-blue-50/70 text-blue-700 font-bold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-800"
                }`}
                id={`time-option-btn-${opt.label}`}
              >
                <span className="text-xs leading-none">{opt.label}</span>
                <span className={`text-[9px] mt-1 font-semibold ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                  {opt.range}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 생성할 질문 개수 */}
      <div id="setting-count-picker-area">
        <label className="text-xs font-bold text-slate-700 block mb-2 select-none text-left">생성할 질문 개수</label>
        <div className="flex border border-slate-200 rounded-xl items-center justify-between p-1" id="count-picker-layout">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={isGenerating || questionCount <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 cursor-pointer"
            aria-label="Decrease count"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-bold text-slate-800" id="question-count-display-text">
            {questionCount}개
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={isGenerating || questionCount >= 30}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 cursor-pointer"
            aria-label="Increase count"
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold mt-1.5 text-left select-none">
          권장 범위 : {currentOption.recommend}
        </p>
      </div>

      {/* 3. 질문 유형(키워드) */}
      <div id="setting-types-area">
        <label className="text-xs font-bold text-slate-700 block mb-2 select-none text-left">질문 유형(키워드)</label>
        <div className="flex flex-col gap-2.5" id="setting-types-list">
          {typeDefinitions.map((type) => {
            const isChecked = selectedQuestionTypes.includes(type.value);
            return (
              <label
                key={type.value}
                className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer select-none text-left"
                id={`type-label-${type.value}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxToggle(type.value)}
                  disabled={isGenerating}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>{type.display}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. 질문 생성하기 버튼 */}
      <div className="pt-2 flex flex-col gap-2" id="action-generation-wrapper">
        <button
          type="button"
          onClick={onGenerateQuestions}
          disabled={isGenerating}
          className="w-full bg-[#00194B] hover:bg-[#002D80] active:bg-[#001030] text-white py-3.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-75"
          id="generate-button-trigger"
        >
          <Sparkles size={14} />
          <span>{isGenerating ? "질문 생성 중..." : "질문 생성하기"}</span>
        </button>
        <p className="text-[10px] text-slate-400 font-medium text-center select-none">
          생성에는 약 20~40초가 소요됩니다.
        </p>
      </div>
    </div>
  );
}
