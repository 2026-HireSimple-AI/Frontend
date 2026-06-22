import React from "react";
import { Info, HelpCircle } from "lucide-react";

interface BottomNoticeProps {
  message?: string;
  className?: string;
}

export default function BottomNotice({ message, className }: BottomNoticeProps) {
  const defaultText = "위 평가 기준이 공고문의 내용과 부합하는지 확인해 주세요. 수정이 필요하면 ‘수정하기’ 버튼을 통해 조정할 수 있습니다.";
  const text = message || defaultText;

  return (
    <div className={`flex items-start gap-3 bg-[#EEF3FA] border border-[#BACFFC]/20 rounded-xl p-4 text-xs text-[#00194B] font-medium leading-relaxed shadow-xs w-full lg:max-w-[70%] md:max-w-[72%] font-sans select-none ${className || ""}`}>
      <HelpCircle size={16} className="text-[#00194B] flex-shrink-0 mt-0.5 fill-[#00194B]/10 animate-pulse" />
      <div className="flex-1">
        <span>{text}</span>
      </div>
    </div>
  );
}
