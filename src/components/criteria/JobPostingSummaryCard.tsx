import React, { useState, useEffect } from "react";
import { FileText, Pencil, Check, X } from "lucide-react";

interface JobPostingSummaryCardProps {
  jobPostingTitle: string;
  onEditJobPosting?: (newTitle: string) => void;
}

export default function JobPostingSummaryCard({
  jobPostingTitle,
  onEditJobPosting
}: JobPostingSummaryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(jobPostingTitle || "공고문 1");

  useEffect(() => {
    setTitleInput(jobPostingTitle || "공고문 1");
  }, [jobPostingTitle]);

  const handleSave = () => {
    if (titleInput.trim()) {
      if (onEditJobPosting) {
        onEditJobPosting(titleInput);
      }
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E6EAF0] rounded-2xl p-5 flex items-start gap-4 shadow-sm select-none font-sans">
      <div className="w-12 h-12 rounded-xl bg-[#EEF3FA] text-[#00194B] flex items-center justify-center flex-shrink-0">
        <FileText size={24} />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {/* 공고문 타이틀 바 */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1.5 w-full max-w-[200px]">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  } else if (e.key === "Escape") {
                    setTitleInput(jobPostingTitle);
                    setIsEditing(false);
                  }
                }}
                className="h-7 px-2 border border-[#6D5DFC] focus:outline-none rounded text-xs text-[#1C1F26] w-full"
                autoFocus
              />
              <button 
                onClick={handleSave} 
                className="p-1 bg-green-50 text-green-600 hover:bg-green-100 rounded"
              >
                <Check size={12} />
              </button>
              <button 
                onClick={() => {
                  setTitleInput(jobPostingTitle);
                  setIsEditing(false);
                }} 
                className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-[#EEF3FA] border border-[#D4D9E1] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1C1F26]">
              <span>{jobPostingTitle || "공고문 1"}</span>
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-1 text-gray-500 hover:text-[#00194B] rounded cursor-pointer ml-1"
                title="이름 수정하기"
              >
                <Pencil size={11} />
              </button>
            </div>
          )}
        </div>

        {/* 설명 */}
        <p className="text-xs text-[#707887] leading-normal font-medium">
          공고문의 주요 내용과 요구사항을 분석하여 평가 기준과 가중치를 설정했습니다.
        </p>
      </div>
    </div>
  );
}
