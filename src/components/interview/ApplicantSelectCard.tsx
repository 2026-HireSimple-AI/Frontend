import React from "react";

interface ApplicantSelectCardProps {
  applicants: Array<{ id: number; masked_code: string; real_name?: string; career: string }>;
  selectedApplicantId: number | null;
  onSelectApplicant: (id: number) => void;
}

export default function ApplicantSelectCard({
  applicants = [],
  selectedApplicantId,
  onSelectApplicant,
}: ApplicantSelectCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs" id="applicant-select-card-container">
      <h3 className="text-sm font-bold text-slate-800 mb-3" id="applicant-select-card-title">지원자 선택</h3>

      <div className="relative" id="applicant-select-dropdown-container">
        <select
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-700 cursor-pointer appearance-none shadow-xs transition-colors"
          value={selectedApplicantId || ""}
          onChange={(e) => onSelectApplicant(Number(e.target.value))}
          id="applicant-select-native"
        >
          {applicants.length === 0 && (
            <option value="" disabled>지원자 없음</option>
          )}
          {applicants.map((app) => (
            <option key={app.id} value={app.id}>
              {app.real_name || app.masked_code}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
