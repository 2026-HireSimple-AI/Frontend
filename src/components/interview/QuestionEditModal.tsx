import React, { useState, useEffect } from "react";
import { X, Plus, Edit3, Trash2, ArrowRight, CheckCircle, ShieldAlert, AlertTriangle } from "lucide-react";
import { InterviewQuestion, deleteInterviewQuestion } from "../../api/interviewQuestionApi";
import QuestionTypeTabs from "./QuestionTypeTabs";
import EditableQuestionTable from "./EditableQuestionTable";
import QuestionEditModalFooter from "./QuestionEditModalFooter";

// 컴포넌트 밖에 정의해야 useEffect에서 참조 가능
function runLocalComplianceCheck(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("마감 기한") || lower.includes("우선순위") || lower.includes("우선 순위") || lower.includes("마감기한")) {
    return {
      status: "미준수" as const,
      revised: "업무상 여러 마감 시한이 겹쳐 충돌이 발생한 시점에, 업무의 우선순위를 어떻게 수치적 또는 이성적으로 판단하여 추진하셨는지 구체적 사례를 들어주세요.",
      reason: "직원의 개인적인 성향, 습관적 행동, 단순 여가 시간 관리 등을 추측할 수 있는 서술형 질문에 그칠 우려가 있으므로, 업무 역량 및 객관적 리소싱 관점 위주로 다듬어야 직무 연관성을 높이고 왜곡된 선입견을 최소화할 수 있습니다."
    };
  }

  if (
    lower.includes("결혼") ||
    lower.includes("출산") ||
    lower.includes("나이") ||
    lower.includes("가족") ||
    lower.includes("애인") ||
    lower.includes("남자친구") ||
    lower.includes("여자친구") ||
    lower.includes("부모님") ||
    lower.includes("종교") ||
    lower.includes("고향")
  ) {
    return {
      status: "미준수" as const,
      revised: "우리 직무 수행 시 협력적인 동료들과 함께 원활하게 소통하고 다른 의견들을 수렴하며 시너지를 제고해 온 본인만의 커뮤니케이션 노하우가 있다면 설명해주세요.",
      reason: "개인 신상정보(나이, 가족관계, 성별, 혼인 여부) 및 직무와 무관한 사적 기호는 채용절차법 상 수집이 엄격히 금지된 항목으로, 자칫 면접관의 주관적이고 차별적인 왜곡이 발생하지 않도록 근본적으로 예방해야 합니다."
    };
  }

  return { status: "준수" as const, revised: null, reason: null };
}

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

  // 2. Load questions into draft on modal open
  useEffect(() => {
    if (isOpen) {
      // 모달 열릴 때 법령 위반 질문에 권장 수정안 자동 생성
      const cloned = questions.map(q => {
        const normalized = { ...q, question_type: q.question_type === "기술검정" ? "기술검증" : q.question_type };
        const check = runLocalComplianceCheck(q.question_text);
        if (check.status === "준수") {
          // 현재 텍스트가 법령 통과 → DB 상태 무시하고 준수로 표시
          return { ...normalized, compliance_status: "준수" as any, revised_question_text: null };
        }
        // 위반 질문 → 권장 수정안 채우기
        return {
          ...normalized,
          revised_question_text: q.revised_question_text || check.revised,
          compliance_reason: (q as any).compliance_reason || check.reason
        } as any;
      });
      setDraftQuestions(cloned);
      setActiveEditingId(null);
      setActiveType("전체");
      setErrorMessage("");
      setIsSaving(false);
    }
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
  const handleChangeQuestionText = (id: number, newText: string) => {
    const compliance = runLocalComplianceCheck(newText);

    setDraftQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          question_text: newText,
          compliance_status: compliance.status === "미준수" ? "경고" as any : "준수",
          revised_question_text: compliance.revised,
          compliance_reason: compliance.reason
        } as any;
      }
      return q;
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
