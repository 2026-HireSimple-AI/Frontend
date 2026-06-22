/**
 * 이 파일은 분석 생성 대시보드의 중앙 히어로 섹션(HeroSection)입니다.
 * - 메인 타이틀: Hire Simple AI (H1 - 28px, Bold, #00194B)
 * - 설명 문구: 공고문과 이력서를 함께 분석하여 지원자 적합도를 평가하세요. (Body - 14px/18px, #344054 / #475467)
 * - 가로 중앙 정렬 배치
 */

import React from "react";

interface HeroSectionProps {
  title?: string;
  description?: string;
}

export default function HeroSection({
  title = "Hire Simple AI",
  description = "공고문과 이력서를 함께 분석하여\n지원자 적합도를 평가하세요."
}: HeroSectionProps) {
  return (
    <div className="text-center my-8 select-none">
      <span className="text-[10px] font-bold text-[#6D5DFC] uppercase tracking-widest block mb-2">STEP 01</span>
      {/* H1 Page Title 적용 */}
      <h1 className="text-[32px] md:text-[36px] font-bold text-[#00194B] tracking-tight leading-[44px] mb-3">
        {title}
      </h1>
      
      {/* Body 설명 텍스트 적용 */}
      <p className="text-[15px] md:text-[16px] text-[#475467] font-medium leading-[26px] whitespace-pre-line max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
}
