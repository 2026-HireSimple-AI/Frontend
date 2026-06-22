/**
 * 이 파일은 채용 공고 URL을 입력받는 카드 컴포넌트(JobPostingUrlCard)입니다.
 * - 제목: 공고문 URL 입력 (H3)
 * - 설명: 채용 공고가 있는 페이지의 URL을 입력해주세요. (Caption)
 * - 입력 폼 규칙 준수: 인풋 세로 44px, 보더 #D4D9E1, 포커스 시 메인 네이비(#00194B)
 * - 에러 발생 시 하단에 인라인 에러 텍스트 표기
 */

import React from "react";
import { Link2, AlertCircle } from "lucide-react";

interface JobPostingUrlCardProps {
  jobUrl: string;
  onChangeJobUrl: (url: string) => void;
  errorMessage: string | null;
  disabled?: boolean;
}

export default function JobPostingUrlCard({
  jobUrl,
  onChangeJobUrl,
  errorMessage,
  disabled = false
}: JobPostingUrlCardProps) {
  return (
    <div className="bg-white border border-[#E6EAF0] rounded-2xl p-6 flex flex-col md:flex-row gap-5 hover:border-[#D4D9E1] transition-all duration-200">
      {/* 왼쪽 링크 아이콘 동그라미 */}
      <div className="w-12 h-12 rounded-full bg-[#F6F8FC] text-[#00194B] flex items-center justify-center flex-shrink-0">
        <Link2 size={22} />
      </div>

      {/* 오른쪽 카드 타이틀 & 인풋 영역 */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1 select-none">
          <h3 className="text-lg font-semibold text-[#1C1F26]">공고문 URL 입력</h3>
          <p className="text-sm text-[#707887]">채용 공고가 있는 페이지의 URL을 입력해주세요.</p>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <input
            id="job-posting-url-input"
            type="url"
            value={jobUrl}
            onChange={(e) => onChangeJobUrl(e.target.value)}
            placeholder="https://example.com/job-posting"
            disabled={disabled}
            className={`w-full h-11 px-4 border rounded-xl text-sm text-[#1C1F26] bg-white outline-none transition-all ${
              errorMessage 
                ? "border-[#EF4444] focus:border-[#EF4444]" 
                : "border-[#D4D9E1] focus:border-[#00194B]"
            } ${disabled ? "bg-[#F6F8FC] text-[#98A0AE] cursor-not-allowed border-[#E6EAF0]" : ""}`}
          />
          
          {/* 인라인 검증 오류 표기 */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-1.5 font-medium">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
