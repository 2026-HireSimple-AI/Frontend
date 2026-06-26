import React, { useState } from "react";
import { InterviewQuestion } from "../../api/interviewQuestionApi";
import EditableQuestionRow from "./EditableQuestionRow";

interface EditableQuestionTableProps {
  questions: InterviewQuestion[];
  activeEditingId: number | null;
  onToggleEdit: (id: number) => void;
  onChangeQuestionText: (id: number, text: string) => void;
  onImportanceChange?: (id: number, val: number) => void;
  onTypeChange?: (id: number, type: string) => void;
  onDeleteQuestion: (id: number) => void | Promise<void>;
  onReplaceWithRecommended: (id: number) => void;
}

export default function EditableQuestionTable({
  questions = [],
  activeEditingId,
  onToggleEdit,
  onChangeQuestionText,
  onImportanceChange,
  onTypeChange,
  onDeleteQuestion,
  onReplaceWithRecommended
}: EditableQuestionTableProps) {
  return (
    <div className="overflow-hidden w-full bg-white border border-slate-200 rounded-xl shadow-3xs" id="editable-question-table-scroller">
      <table className="w-full text-left border-collapse table-auto" id="editable-questions-table">
        <thead className="border-b border-slate-200 bg-slate-50/50">
          <tr>
            <th className="py-3 px-3 text-xs font-bold text-slate-500 text-center w-20">번호</th>
            <th className="py-3 px-4 text-xs font-bold text-slate-500 text-left">질문</th>
            <th className="py-3 px-3 text-xs font-bold text-slate-500 text-center w-28">유형</th>
            <th className="py-3 px-3 text-xs font-bold text-slate-500 text-center w-28">중요도</th>
            <th className="py-3 px-3 text-xs font-bold text-slate-500 text-center w-28">검수 결과</th>
            <th className="py-3 px-3 text-xs font-bold text-slate-500 text-center w-24">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {questions.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-xs text-slate-400 text-center bg-white font-semibold">
                필터에 일치하거나 수정할 면접 질문이 없습니다.
              </td>
            </tr>
          ) : (
            questions.map((q, idx) => (
              <EditableQuestionRow
                key={q.id}
                question={q}
                index={idx}
                isEditing={activeEditingId === q.id}
                onToggleEdit={() => onToggleEdit(q.id)}
                onChangeQuestionText={onChangeQuestionText}
                onImportanceChange={onImportanceChange}
                onTypeChange={onTypeChange}
                onDelete={onDeleteQuestion}
                onReplaceWithRecommended={onReplaceWithRecommended}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
