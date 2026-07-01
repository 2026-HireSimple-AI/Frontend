import React, { useState, useEffect } from "react";
import { GripVertical, Star, Trash2, Edit2, Check, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { InterviewQuestion } from "../../api/interviewQuestionApi";
import ComplianceWarningPanel from "./ComplianceWarningPanel";
import { checkComplianceLocally, getSuggestedReplacement, getComplianceReason } from "../../utils/complianceCheck";

interface EditableQuestionRowProps {
  question: InterviewQuestion;
  index: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChangeQuestionText: (id: number, text: string) => void;
  onImportanceChange?: (id: number, val: number) => void;
  onTypeChange?: (id: number, type: string) => void;
  onDelete: (id: number) => void | Promise<void>;
  onReplaceWithRecommended: (id: number) => void;
}

const EditableQuestionRow: React.FC<EditableQuestionRowProps> = ({
  question,
  index,
  isEditing,
  onToggleEdit,
  onChangeQuestionText,
  onImportanceChange,
  onTypeChange,
  onDelete,
  onReplaceWithRecommended
}) => {
  const [localText, setLocalText] = useState(question.question_text);

  useEffect(() => {
    setLocalText(question.question_text);
  }, [question.question_text]);

  const handleBlur = () => {
    if (localText.trim() !== question.question_text) {
      onChangeQuestionText(question.id, localText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (localText.trim() !== question.question_text) {
        onChangeQuestionText(question.id, localText.trim());
      }
      onToggleEdit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  };

  // 실시간 키워드 검사 (입력 중에도 즉시 반영)
  const { status: liveStatus, matchedKeyword } = checkComplianceLocally(localText);
  const effectiveStatus = liveStatus !== "준수" ? liveStatus : question.compliance_status;
  const isViolating = effectiveStatus === "경고" || effectiveStatus === "심각" || effectiveStatus === "미준수";

  // 권장 수정안: 실시간 감지된 키워드 기반 → 없으면 DB값 사용
  const liveRevisedText = matchedKeyword ? getSuggestedReplacement(matchedKeyword) : "";
  const liveReason = matchedKeyword ? getComplianceReason(matchedKeyword) : "";
  const displayRevisedText = liveRevisedText || question.revised_question_text || "";
  const displayReason = liveReason || (question as any).compliance_reason || "";

  // Quick category badges style mapping
  const getBadgeStyleClass = (type: string) => {
    const norm = type.replace("검증", "검정");
    if (norm.includes("행동")) return "bg-blue-50 text-blue-700 border border-blue-200";
    if (norm.includes("역량")) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (norm.includes("우려")) return "bg-red-50 text-red-700 border border-red-200";
    if (norm.includes("기술")) return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-purple-50 text-purple-700 border border-purple-200";
  };

  const typesList = ["행동", "역량", "우려검증", "기술검증", "기타"];

  return (
    <>
      <tr 
        className={`border-b border-slate-150 transition-colors ${
          isViolating ? "bg-red-50/10 hover:bg-red-50/20" : "hover:bg-slate-50/50"
        }`}
        id={`editable-row-${question.id}`}
      >
        {/* 1. Grip / Grab (번호) */}
        <td className="py-3 px-3 w-12 text-center" id={`drag-cell-${question.id}`}>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-slate-300 cursor-grab hover:text-slate-500">
              <GripVertical size={14} />
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-2 py-1 rounded min-w-[24px] inline-block text-center">
              {index + 1}
            </span>
          </div>
        </td>

        {/* 2. 질문 본문 */}
        <td className="py-3 px-4 text-left">
          {isEditing ? (
            <div className="flex flex-col gap-1 w-full">
              <textarea
                value={localText}
                onChange={handleTextChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="새로운 면접 질문 내용을 여기에 기재해 주세요."
                className="w-full text-xs font-medium text-slate-800 p-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[64px]"
                id={`textarea-edit-${question.id}`}
              />
              <span className="text-[10px] text-blue-500 font-semibold select-none">
                * 질문을 작성한 후 셀 영역 밖을 클릭하시거나 완료 버튼을 눌러주세요.
              </span>
            </div>
          ) : (
            <div className="flex flex-col text-xs font-medium text-slate-700 leading-relaxed pr-2">
              <p>
                {isViolating && <span className="text-red-600 font-bold mr-1">(원본 질문)</span>}
                {question.question_text}
              </p>
            </div>
          )}
        </td>

        {/* 3. 질문 유형 Dropdown or Badge */}
        <td className="py-3 px-3 text-center whitespace-nowrap">
          {isEditing && onTypeChange ? (
            <select
              value={question.question_type}
              onChange={(e) => onTypeChange(question.id, e.target.value)}
              className="text-xs font-bold text-slate-600 border border-slate-200 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {typesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : (
            <span className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold ${getBadgeStyleClass(question.question_type)}`}>
              {question.question_type}
            </span>
          )}
        </td>

        {/* 4. 중요도 (3-star) */}
        <td className="py-3 px-3 text-center">
          <div className="flex items-center justify-center gap-0.5">
            {[1, 2, 3].map((starIdx) => {
              const isFilled = starIdx <= question.importance;
              return (
                <button
                  key={starIdx}
                  type="button"
                  onClick={() => onImportanceChange && onImportanceChange(question.id, starIdx)}
                  className={`p-0.5 focus:outline-none transition-transform active:scale-125 ${
                    onImportanceChange ? "cursor-pointer hover:scale-110" : "cursor-default"
                  }`}
                  aria-label={`${starIdx} Stars`}
                >
                  <Star 
                    size={14} 
                    className={isFilled ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                  />
                </button>
              );
            })}
          </div>
        </td>

        {/* 5. 검수 결과 */}
        <td className="py-3 px-3 text-center whitespace-nowrap">
          {effectiveStatus === "심각" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold text-red-700 bg-red-100 border border-red-300 rounded-md select-none">
              <ShieldAlert size={12} className="text-red-600" />
              <span>금지</span>
            </span>
          ) : effectiveStatus === "경고" || effectiveStatus === "미준수" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 rounded-md select-none">
              <AlertTriangle size={12} className="text-orange-500" />
              <span>경고</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50/70 border border-emerald-100 rounded-md select-none">
              <CheckCircle size={12} className="text-emerald-500 fill-emerald-100" />
              <span>준수</span>
            </span>
          )}
        </td>

        {/* 6. 관리 (편집 및 삭제) */}
        <td className="py-3 px-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={onToggleEdit}
              title={isEditing ? "완료" : "편집"}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isEditing
                  ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-600"
              }`}
            >
              {isEditing ? <Check size={13} /> : <Edit2 size={13} />}
            </button>
            <button
              type="button"
              onClick={() => onDelete(question.id)}
              title="삭제"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </td>
      </tr>

      {/* 7. Non-compliant legal warning row */}
      {isViolating && (
        <tr>
          <td colSpan={6} className="bg-[#FFFAFA] px-6 py-1 border-b border-slate-150">
            <ComplianceWarningPanel
              originalQuestionText={localText}
              revisedQuestionText={displayRevisedText}
              complianceReason={displayReason}
              onReplace={() => {
                if (displayRevisedText) {
                  setLocalText(displayRevisedText);
                  onChangeQuestionText(question.id, displayRevisedText);
                } else {
                  onReplaceWithRecommended(question.id);
                }
              }}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default EditableQuestionRow;
