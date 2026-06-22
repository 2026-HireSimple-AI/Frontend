import React, { useState, useRef } from "react";
import { Info } from "lucide-react";

interface ReasonItem {
  title: string;
  desc: string;
}

interface CriteriaReasonHoverTriggerProps {
  reasonItems?: ReasonItem[];
  delayMs?: number;
}

export default function CriteriaReasonHoverTrigger({
  reasonItems,
  delayMs = 2000
}: CriteriaReasonHoverTriggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const defaultReasons: ReasonItem[] = [
    {
      title: "주요 업무",
      desc: "공고문 내 주요업무 비중이 가장 높아 핵심 역량으로 가장 높은 가중치 설정"
    },
    {
      title: "자격 조건",
      desc: "필수 기술 스택 숙련도를 평가하여 직무 수행 가능성 판단"
    },
    {
      title: "우대 사항",
      desc: "우대사항 충족 시 조직 적합도 향상 및 추가 기여 가능성 고려"
    }
  ];

  const reasons = reasonItems || defaultReasons;

  const handleMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    hoverTimer.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-block select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="inline-flex items-center justify-center cursor-pointer text-[#98A0AE] hover:text-[#00194B] align-middle ml-1">
        <Info size={13} className="stroke-[2.5]" />
      </span>

      {isVisible && (
        <div 
          className="absolute left-0 top-full mt-2 w-[280px] bg-white border border-[#E6EAF0] rounded-xl p-4 shadow-xl z-50 text-left font-sans animate-fade-in"
          style={{ transformOrigin: "top left" }}
        >
          <h4 className="text-[11px] font-bold text-[#6D5DFC] uppercase tracking-wider mb-2">설정 근거</h4>
          <div className="flex flex-col gap-2.5">
            {reasons.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 border-b border-[#F6F8FC] pb-2 last:border-0 last:pb-0">
                <span className="text-[11px] font-bold text-[#1C1F26]">{item.title}</span>
                <span className="text-[10px] text-[#707887] leading-relaxed">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
