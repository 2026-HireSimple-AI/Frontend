/**
 * 이 파일은 분석을 개시하는 하단 핵심 버튼 컴포넌트(StartAnalysisButton)입니다.
 * - 버튼 텍스트 동적 분기 규칙:
 *   A. 공고문 URL이 없을 때 -> 비활성화 상태
 *      텍스트: "분석을 시작하려면 채용 공고를 입력해주세요"
 *   B. 공고문 URL이 존재하고 이력서가 없을 때 -> 활성화 상태
 *      텍스트: "채용 공고 분석 시작하기"
 *   C. 공고문 URL이 존재하고 이력서가 최소 1개 이상 존재할 때 -> 활성화 상태
 *      텍스트: "적합도 분석 시작하기"
 *   D. 로딩 중(isLoading이 true일 때) -> 비활성화 상태이며 텍스트: "처리 중..."
 * - 엔터프라이즈 스타일 가이드라인을 준수합니다.
 */

import React from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

interface StartAnalysisButtonProps {
  jobUrl: string;
  selectedFiles: File[];
  isLoading: boolean;
  onClick: () => void;
}

export default function StartAnalysisButton({
  jobUrl,
  selectedFiles,
  isLoading,
  onClick
}: StartAnalysisButtonProps) {
  const hasJobUrl = jobUrl.trim().length > 0;
  const hasResumes = selectedFiles.length > 0;

  // 비활성화 여부 판정 (로딩 중이거나 공고 URL이 없으면 버튼 비활성화)
  const isDisabled = !hasJobUrl || isLoading;

  // 도출할 버튼 텍스트 규칙 계산
  let buttonText = "";
  if (isLoading) {
    buttonText = "처리 중...";
  } else if (!hasJobUrl) {
    buttonText = "분석을 시작하려면 채용 공고를 입력해주세요";
  } else if (!hasResumes) {
    buttonText = "채용 공고 분석 시작하기";
  } else {
    buttonText = "적합도 분석 시작하기";
  }

  return (
    <div className="w-full select-none mt-4">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-base transition-all duration-200 cursor-pointer ${
          isDisabled
            ? "bg-[#E6EAF0] text-[#98A0AE] cursor-not-allowed border border-[#E6EAF0]/40"
            : "bg-[#00194B] text-white hover:bg-[#002D80] active:scale-[0.99] shadow-md border border-[#00194B]/20"
        }`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin text-white" />
        ) : hasResumes && hasJobUrl ? (
          <Sparkles size={18} className="text-[#6D5DFC] fill-[#6D5DFC]/20 animate-pulse" />
        ) : null}

        <span>{buttonText}</span>

        {!isDisabled && !isLoading && <ArrowRight size={16} className="text-white/80" />}
      </button>
    </div>
  );
}
