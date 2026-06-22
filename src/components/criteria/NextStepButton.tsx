import React from "react";
import { Play, Loader2 } from "lucide-react";

interface NextStepButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

export default function NextStepButton({
  isDisabled = false,
  isLoading = false,
  onClick
}: NextStepButtonProps) {
  return (
    <div className="flex flex-col items-end gap-1 font-sans select-none w-56 md:w-64" id="criteria-review-next-step-btn-wrapper">
      <button
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className="h-11 w-full bg-[#00194B] hover:bg-[#002D80] disabled:bg-[#98A0AE] text-white rounded-xl text-xs font-bold cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow hover:-translate-y-0.5"
      >
        {isLoading ? (
          <Loader2 size={13} className="animate-spin text-white" />
        ) : (
          <Play size={11} className="fill-white text-white" />
        )}
        <span>{isLoading ? "이동 중..." : "분석 진행하기"}</span>
      </button>
      <span className="text-[10px] text-[#707887] font-semibold tracking-tight pr-1">
        다음 단계: 지원자 적합도 분석
      </span>
    </div>
  );
}
