import React, { useState } from "react";
import { Sparkles, X, CheckSquare, ShieldCheck } from "lucide-react";
import { ApplicantDetail } from "../../api/applicantApi";

interface InterviewQuestionCreateModalProps {
  isOpen: boolean;
  selectedApplicants: Array<ApplicantDetail & { rank_no?: number; percentileText?: string }>;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function InterviewQuestionCreateModal({
  isOpen,
  selectedApplicants = [],
  onClose,
  onConfirm
}: InterviewQuestionCreateModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsPending(true);
    setErrorMessage("");
    try {
      await onConfirm();
    } catch (err: any) {
      console.error(err);
      setErrorMessage("질문지 벌크 생성 중 요류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  };

  const names = selectedApplicants.map((a) => a.masked_code).join(", ");

  return (
    <div
      className="fixed inset-0 bg-[#00194B]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      id="interview-question-create-modal"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-[#E6EAF0] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E6EAF0] bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#6D5DFC] animate-pulse" />
            <h3 className="font-extrabold text-[#111827] text-sm tracking-tight">
              AI 심층 면접 질문 구성 개시
            </h3>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-[#EEF3FA] rounded-xl p-4 flex gap-3">
            <div className="text-[#6D5DFC] shrink-0 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div className="select-none">
              <span className="text-xs font-extrabold text-[#00194B] block mb-1">
                대비 지원자 그룹 ({selectedApplicants.length}명)
              </span>
              <p className="text-xs font-mono font-bold text-slate-700 tracking-tight leading-relaxed">
                {names || "선택된 지원자가 없습니다."}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#475467] leading-relaxed flex flex-col gap-2 font-medium">
            <p>
              각 지원자의 <strong>이력서 핵심 보유 기술, 프로젝트 경험, 자격 조건</strong> 비교 분석 결과를 바탕으로 개인 맞춤형 AI 면접 질문지(각 5개 기출)를 다중 구성합니다.
            </p>
            <p>
              질문 세트는 각 지원자의 약점/리스크(우려 사항 검증) 지표와 직무 부합 우수성을 입증할 수 있는 핵심 문항들로 정제됩니다.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded p-2.5 text-xs font-bold font-mono">
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-[#E6EAF0]">
          <button
            type="button"
            className="px-4 py-2 border border-[#D4D9E1] rounded-xl text-xs font-bold text-[#475467] hover:bg-white select-none transition"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-[#00194B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#002D80] disabled:bg-gray-300 disabled:cursor-not-allowed select-none transition"
            onClick={handleConfirm}
            disabled={isPending || selectedApplicants.length === 0}
          >
            {isPending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-amber-300" />
                <span>질문지 생성 시작</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
