import React from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface FormattedPosting {
  category: string;
  content: string[] | string;
}

interface JobPostingAnalysisResultCardProps {
  formattedPostings: FormattedPosting[];
  isRefreshing: boolean;
  onRetryExtract: () => void;
  errorMessage?: string | null;
}

export default function JobPostingAnalysisResultCard({
  formattedPostings,
  isRefreshing,
  onRetryExtract,
  errorMessage
}: JobPostingAnalysisResultCardProps) {
  // 배지 스타일 매퍼
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "자격 조건":
      case "자격조건":
        return "bg-[#EEF2F6] text-[#475467] border border-[#CBD5E1]";
      case "주요 업무":
      case "주요업무":
        return "bg-[#EEF3FA] text-[#00194B] border border-[#BACFFC]";
      case "우대 사항":
      case "우대사항":
        return "bg-[#FDF2F2] text-[#EF4444] border border-[#FCA5A5]";
      default:
        return "bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]";
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E6EAF0] rounded-2xl p-6 shadow-sm select-none font-sans flex flex-col gap-5 h-[420px]">
      {/* 카드 상부 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#00194B] fill-[#00194B]/10" />
          <h3 className="text-sm font-bold text-[#1C1F26]">공고문 핵심 분석 결과</h3>
        </div>

        <button
          onClick={onRetryExtract}
          disabled={isRefreshing}
          className="px-3.5 h-[34px] bg-[#00194B] hover:bg-[#002D80] disabled:bg-[#98A0AE] text-white rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors shadow-sm"
          id="retry-extract-btn"
        >
          <RefreshCw size={12} className={`text-white ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "다시 추출 중..." : "다시 추출하기"}</span>
        </button>
      </div>

      {/* 에러 노출 */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#EF4444] font-medium animate-pulse">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 분석 카테고리 본문 리스트 */}
      <div className="flex flex-col gap-4 min-h-[140px] flex-1 overflow-hidden">
        {isRefreshing ? (
          // 다시 추출하는 동안에 보여주는 Skeleton UI 로딩 효과
          <div className="flex flex-col gap-4 py-2 h-full overflow-y-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-4 border-b border-[#F6F8FC]/60 pb-3 last:border-0 last:pb-0 animate-pulse">
                <div className="w-[90px] h-[32px] bg-[#E2E8F0] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#E2E8F0] rounded-md w-11/12" />
                  <div className="h-3 bg-[#E2E8F0] rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-4 h-full overflow-y-auto pr-1"
          >
            {formattedPostings && formattedPostings.length > 0 ? (
              formattedPostings.map((post, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-b border-[#F6F8FC] pb-3 last:border-0 last:pb-0 flex-shrink-0">
                  {/* 카테고리 태그 */}
                  <div className={`w-[90px] h-[32px] self-start flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 ${getBadgeStyle(post.category)}`}>
                    {post.category}
                  </div>
                  
                  {/* 내용 설명 - 개별 스크롤 추가 */}
                  <div className="flex-1 max-h-[72px] overflow-y-auto pr-1">
                    <ul className="text-xs text-[#344054] font-medium leading-relaxed">
                  {(Array.isArray(post.content) ? post.content : [post.content]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#98A0AE] h-full flex items-center justify-center">
                공고 분석 정보가 비어있습니다.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

