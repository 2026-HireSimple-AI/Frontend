import React, { useState, useEffect, useCallback } from "react";
import { X, Plus, Edit3, Trash2, ArrowRight, CheckCircle, ShieldAlert, AlertTriangle } from "lucide-react";
import { InterviewQuestion, deleteInterviewQuestion, checkQuestionCompliance } from "../../api/interviewQuestionApi";
import QuestionTypeTabs from "./QuestionTypeTabs";
import EditableQuestionTable from "./EditableQuestionTable";
import QuestionEditModalFooter from "./QuestionEditModalFooter";

interface QuestionEditModalProps {
  isOpen: boolean;
  questions: InterviewQuestion[];
  onClose: () => void;
  onSave: (updatedQuestions: InterviewQuestion[]) => Promise<void>;
}

export default function QuestionEditModal({
  isOpen,
  questions = [],
  onClose,
  onSave
}: QuestionEditModalProps) {
  // 1. Maintain local state for draft questions
  const [draftQuestions, setDraftQuestions] = useState<InterviewQuestion[]>([]);
  const [activeEditingId, setActiveEditingId] = useState<number | null>(null);
  const [activeType, setActiveType] = useState<string>("전체");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 2. Load questions into draft on modal open + LLM 검수 실행
  useEffect(() => {
    if (!isOpen) return;

    const cloned = questions.map(q => ({
      ...q,
      question_type: q.question_type === "기술검정" ? "기술검증" : q.question_type
    }));
    setDraftQuestions(cloned);
    setActiveEditingId(null);
    setActiveType("전체");
    setErrorMessage("");
    setIsSaving(false);

    // 비동기로 각 질문 LLM 검수 (DB compliance_status가 경고/심각인 것만)
    cloned.forEach(async (q) => {
      if (q.compliance_status === "경고" || q.compliance_status === "심각" || !(q as any).revised_question_text) {
        const result = await checkQuestionCompliance(q.question_text);
        setDraftQuestions(prev => prev.map(dq => {
          if (dq.id !== q.id) return dq;
          if (result.compliance_status === "준수") {
            return { ...dq, compliance_status: "준수" as any, revised_question_text: null };
          }
          return {
            ...dq,
            compliance_status: result.compliance_status as any,
            revised_question_text: dq.revised_question_text || result.revised_question_text,
            compliance_reason: (dq as any).compliance_reason || result.compliance_reason
          } as any;
        }));
      }
    });
  }, [isOpen, questions]);

  if (!isOpen) return null;

  // Calculate tabs count based on draftQuestions
  const getTabCounts = () => {
    return {
      전체: draftQuestions.length,
      행동: draftQuestions.filter(q => q.question_type === "행동").length,
      역량: draftQuestions.filter(q => q.question_type === "역량").length,
      우려검증: draftQuestions.filter(q => q.question_type === "우려검증" || q.question_type === "우려검정").length,
      기술검증: draftQuestions.filter(q => q.question_type === "기술검증" || q.question_type === "기술검정").length,
      기타: draftQuestions.filter(q => q.question_type === "기타").length,
    };
  };

  // 3. Filtering logic
  const filteredDraftQuestions = draftQuestions.filter(q => {
    if (activeType === "전체") return true;
    if (activeType === "우려검증") return q.question_type === "우려검증" || q.question_type === "우려검정";
    if (activeType === "기술검증") return q.question_type === "기술검증" || q.question_type === "기술검정";
    return q.question_type === activeType;
  });

  // 5. Change Handlers
  const handleChangeQuestionText = async (id: number, newText: string) => {
    // 즉시 텍스트 반영 (UX)
    setDraftQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, question_text: newText } : q
    ));

    // LLM 검수 (비동기)
    const result = await checkQuestionCompliance(newText);
    setDraftQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      return {
        ...q,
        question_text: newText,
        compliance_status: result.compliance_status as any,
        revised_question_text: result.compliance_status === "준수" ? null : result.revised_question_text,
        compliance_reason: result.compliance_status === "준수" ? null : result.compliance_reason
      } as any;
    }));
  };

  const handleImportanceChange = (id: number, val: number) => {
    setDraftQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, importance: val };
      }
      return q;
    }));
  };

  const handleTypeChange = (id: number, newType: string) => {
    setDraftQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, question_type: newType };
      }
      return q;
    }));
  };

  // 6. Add question row
  const handleAddNewQuestion = () => {
    const tempId = -Math.floor(Math.random() * 99999) - 1;
    const newQ: InterviewQuestion = {
      id: tempId,
      applicant_id: questions[0]?.applicant_id || 1,
      question_type: activeType === "전체" ? "행동" : activeType,
      question_text: "",
      importance: 2,
      compliance_status: "준수",
      created_by: "USER",
      revised_question_text: null
    };

    setDraftQuestions(prev => [...prev, newQ]);
    setActiveEditingId(tempId);
  };

  // 7. Delete question row (DB + 화면)
  const handleDeleteQuestion = async (id: number) => {
    if (id > 0) {
      await deleteInterviewQuestion(id);
    }
    setDraftQuestions(prev => prev.filter(q => q.id !== id));
  };

  // 8. Replace with recommended revised text
  const handleReplaceWithRecommended = (id: number) => {
    setDraftQuestions(prev => prev.map(q => {
      if (q.id === id && q.revised_question_text) {
        return {
          ...q,
          question_text: q.revised_question_text,
          compliance_status: "준수",
          revised_question_text: null,
          compliance_reason: null
        } as any;
      }
      return q;
    }));
  };

  // 9. Reset action
  const handleReset = () => {
    if (window.confirm?.("현재 모든 편집 내용을 버리고 초기 데이터로 되돌리시겠습니까?") === false) {
      // Fallback if inside iframe where confirm might fail or be bypassed
    }
    const cloned = questions.map(q => ({
      ...q,
      question_type: q.question_type === "기술검정" ? "기술검증" : q.question_type
    }));
    setDraftQuestions(cloned);
    setActiveType("전체");
    setErrorMessage("");
  };

  // 10. Save handler
  const handleSave = async () => {
    if (draftQuestions.length === 0) {
      setErrorMessage("수정할 면접 질문 리스트가 비어 있어 저장할 수 없습니다.");
      return;
    }

    // Double check if any questions are empty
    const hasEmpty = draftQuestions.some(q => !q.question_text.trim());
    if (hasEmpty) {
      setErrorMessage("질문 란이 비어 있는 항목이 있습니다. 빈 내용을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await onSave(draftQuestions);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "면접 질문 수정 결과 저장 도중 에러가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity" id="modal-overlay">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-xl border border-slate-200 overflow-hidden relative flex flex-col" id="modal-container">
        
        {/* Header Title Area */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white" id="modal-header">
          <div className="text-left flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-800">생성된 면접 질문 수정</h4>
              <span className="bg-[#EFF8FF] text-[#155EEF] font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-[#B2DDFF]">
                총 {draftQuestions.length}개
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              면접 질문을 수정, 추가, 삭제할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            id="btn-close-modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab List & Add Button Action Row */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/10 gap-4" id="modal-subbar">
          <QuestionTypeTabs
            activeType={activeType}
            questionTypeCounts={getTabCounts()}
            onChangeType={setActiveType}
          />

          <button
            type="button"
            onClick={handleAddNewQuestion}
            className="inline-flex items-center gap-1 bg-[#EFF8FF] text-[#155EEF] border border-[#B2DDFF] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#D1E9FF] hover:border-[#155EEF] transition-all cursor-pointer select-none"
            id="btn-add-new-question"
          >
            <Plus size={14} />
            <span>질문 추가</span>
          </button>
        </div>

        {/* Table Body Area */}
        <div className="p-6 flex-1 overflow-y-auto bg-white min-h-[300px]" id="modal-table-container">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-800 border border-red-100 p-3 rounded-xl text-xs font-semibold text-left select-none" id="modal-inline-error">
              <AlertTriangle size={14} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <EditableQuestionTable
            questions={filteredDraftQuestions}
            activeEditingId={activeEditingId}
            onToggleEdit={(id) => setActiveEditingId(curr => curr === id ? null : id)}
            onChangeQuestionText={handleChangeQuestionText}
            onImportanceChange={handleImportanceChange}
            onTypeChange={handleTypeChange}
            onDeleteQuestion={handleDeleteQuestion}
            onReplaceWithRecommended={handleReplaceWithRecommended}
          />
        </div>

        {/* Modal Notice and Actions Footer */}
        <QuestionEditModalFooter
          isSaving={isSaving}
          onCancel={onClose}
          onReset={handleReset}
          onSave={handleSave}
          disabledSave={draftQuestions.length === 0}
        />

      </div>
    </div>
  );
}
