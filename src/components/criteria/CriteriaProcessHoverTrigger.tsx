import React, { useState, useRef } from "react";
import { Lightbulb, ChevronRight } from "lucide-react";
// @ts-ignore
import styles from "../../styles/CriteriaReviewPage.module.css";

interface ProcessStep {
  title: string;
  desc: string;
}

interface CriteriaProcessHoverTriggerProps {
  processSteps?: ProcessStep[];
  delayMs?: number;
}

export default function CriteriaProcessHoverTrigger({
  processSteps,
  delayMs = 2000
}: CriteriaProcessHoverTriggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const defaultSteps: ProcessStep[] = [
    {
      title: "주요 내용 추출",
      desc: "공고문에서 핵심 업무, 요구사항, 우대사항 등 주요 내용을 추출"
    },
    {
      title: "역량 분류 및 정의",
      desc: "추출한 내용을 기반으로 필요 역량을 분류하고 평가 항목으로 정의"
    },
    {
      title: "중요도 산정",
      desc: "업무의 중요도와 빈도, 난이도 등을 고려하여 가중치 초안 산정"
    },
    {
      title: "가중치 최적화",
      desc: "항목 간 균형과 한계를 고려하여 최종 가중치 조정"
    }
  ];

  const steps = processSteps || defaultSteps;

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
      className="relative self-end sm:self-auto select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${styles.processTrigger} text-[#1C1F26] text-xs font-semibold flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6EAF0] rounded-xl hover:bg-[#F6F8FC] cursor-pointer transition-colors shadow-sm`}>
        <Lightbulb size={14} className="text-[#00194B]" />
        <span>평가 기준 도출 과정</span>
      </div>

      {isVisible && (
        <div 
          className="absolute right-0 top-full mt-2 w-[340px] md:w-[600px] bg-white border border-[#E6EAF0] rounded-2xl p-6 shadow-xl z-50 text-left font-sans animate-fade-in"
          style={{ transformOrigin: "top right" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={16} className="text-[#00194B] fill-[#00194B]/10" />
            <h4 className="text-sm font-bold text-[#1C1F26]">평가 기준 도출 과정</h4>
          </div>
          <p className="text-[11px] text-[#707887] mb-6">
            공고문을 다음과 같은 절차로 분석하여 평가 기준을 도출했습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col bg-[#F8FAFC] border border-[#E6EAF0] p-3 rounded-xl relative">
                {/* 단계 숫자 번호 원형 배지 */}
                <div 
                  className="w-5 h-5 rounded-full bg-[#00194B] text-white flex items-center justify-center text-[10px] font-bold font-mono absolute -top-2.5 left-3"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {idx + 1}
                </div>

                <div className="mt-1.5">
                  <h5 className="text-xs font-bold text-[#1C1F26]">{step.title}</h5>
                  <p className="text-[10px] text-[#707887] leading-relaxed mt-1.5">{step.desc}</p>
                </div>

                {/* 화살표 가이드 (모바일 제외 md 이상인 경우 마지막 요소 제외) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2.5 top-[40%] translate-y-[-50%] z-10 text-[#98A0AE]">
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
