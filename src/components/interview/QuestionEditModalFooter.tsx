import React from "react";
import { Info } from "lucide-react";

interface QuestionEditModalFooterProps {
  isSaving: boolean;
  onCancel: () => void;
  onReset: () => void;
  onSave: () => void;
  disabledSave?: boolean;
}

export default function QuestionEditModalFooter({
  isSaving,
  onCancel,
  onReset,
  onSave,
  disabledSave = false
}: QuestionEditModalFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 gap-4" id="modal-footer-wrapper">
      
      {/* Left part: legal compliance memo */}
      <div className="flex items-center gap-1.5 text-left text-slate-500 font-semibold" id="modal-footer-left-notice">
        <Info size={14} className="text-blue-500 flex-shrink-0" />
        <span className="text-[11px]">
          수정 또는 추가한 질문은 저장 후 자동으로 법령 검수가 수행됩니다.
        </span>
      </div>

      {/* Right part: Action buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto" id="modal-footer-right-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="h-10 px-4 rounded-xl text-xs font-semibold border border-[#D4D9E1] bg-white text-[#344054] hover:bg-[#F6F8FC] transition-colors cursor-pointer disabled:opacity-50"
          id="btn-modal-cancel"
        >
          취소
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isSaving}
          className="h-10 px-4 rounded-xl text-xs font-semibold border border-[#D4D9E1] bg-white text-[#344054] hover:bg-[#F6F8FC] transition-colors cursor-pointer disabled:opacity-50"
          id="btn-modal-reset"
        >
          변경사항 초기화
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || disabledSave}
          className="h-10 px-5 rounded-xl text-xs font-bold bg-[#00194B] text-white hover:bg-[#002D80] transition-colors cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center justify-center gap-2"
          id="btn-modal-save"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>저장 중...</span>
            </>
          ) : (
            <span>저장하기</span>
          )}
        </button>
      </div>

    </div>
  );
}
