/**
 * 이 파일은 이력서 업로드를 처리하는 카드 컴포넌트(ResumeUploadCard)입니다.
 * - 제목: 이력서 업로드 (H3)
 * - 설명: 여러 명의 이력서를 한 번에 업로드할 수 있습니다. (Caption)
 * - 드래그 앤 드롭 영역 및 파일 선택 인터페이스 내장
 * - 가이드 텍스트: PDF, DOCX, HWP 파일 지원 / 최대 200MB
 * - 파일 선택 개수 변경 대응 및 파일 제거 유틸 구성
 */

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";

interface ResumeUploadCardProps {
  selectedFiles: File[];
  onChangeFiles: (files: File[]) => void;
  uploadErrorMessage: string | null;
  disabled?: boolean;
}

export default function ResumeUploadCard({
  selectedFiles,
  onChangeFiles,
  uploadErrorMessage,
  disabled = false
}: ResumeUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 클릭하여 직접 파일 선택 핸들러
  const handleBoxClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  // 신규 적층 방식이거나 덮어쓰기 방식으로 세팅 가능
  // 여기서는 중복 제거 및 누적 선택이 되도록 핸들링
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      // 기존에 올라온 파일과 중복 이름 걸러내기
      const combined = [...selectedFiles];
      newFiles.forEach((file) => {
        if (!combined.some((f) => f.name === file.name)) {
          combined.push(file);
        }
      });
      onChangeFiles(combined);
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러들
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      const allowedExtensions = [".pdf", ".docx", ".hwp"];
      
      // 유효 파일 검사 (확장자 필터링)
      const validFiles = droppedFiles.filter((file) => {
        const nameLower = file.name.toLowerCase();
        return allowedExtensions.some((ext) => nameLower.endsWith(ext));
      });

      if (validFiles.length > 0) {
        const combined = [...selectedFiles];
        validFiles.forEach((file) => {
          if (!combined.some((f) => f.name === file.name)) {
            combined.push(file);
          }
        });
        onChangeFiles(combined);
      }
    }
  };

  // 선택한 파일 개별 제거
  const handleRemoveFile = (indexToRemove: number) => {
    onChangeFiles(selectedFiles.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-white border border-[#E6EAF0] rounded-2xl p-6 flex flex-col md:flex-row gap-5 hover:border-[#D4D9E1] transition-all duration-200">
      {/* 1. 왼쪽 클라우드 업로드 아이콘 동그라미 */}
      <div className="w-12 h-12 rounded-full bg-[#F6F8FC] text-[#00194B] flex items-center justify-center flex-shrink-0">
        <UploadCloud size={22} />
      </div>

      {/* 2. 오른쪽 메인 영역 */}
      <div className="flex-1 flex flex-col gap-4">
        {/* 설명 헤더 */}
        <div className="flex flex-col gap-1 select-none">
          <h3 className="text-lg font-semibold text-[#1C1F26]">이력서 업로드</h3>
          <p className="text-sm text-[#707887]">여러 명의 이력서를 한 번에 업로드할 수 있습니다.</p>
        </div>

        {/* 파일 선택 버튼 (네이티브 input 숨김) */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.hwp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {/* 드래그 앤 드롭 박스 */}
        <div
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 min-h-[160px] text-center transition-all ${
            disabled 
              ? "bg-[#F6F8FC] border-[#E6EAF0] cursor-not-allowed text-[#98A0AE]" 
              : isDragOver
                ? "bg-[#EEF3FA] border-[#6D5DFC] text-[#6D5DFC]"
                : "bg-[#F6F8FC] border-[#D4D9E1] hover:bg-[#EEF3FA] hover:border-[#00194B]"
          } cursor-pointer select-none`}
        >
          <UploadCloud 
            size={40} 
            className={`transition-colors ${
              isDragOver ? "text-[#6D5DFC]" : "text-[#98A0AE] group-hover:text-[#00194B]"
            }`} 
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#344054]">
              {disabled ? "채용 분석을 진행 중입니다" : "이력서를 드래그하여 업로드하거나 클릭하여 파일 선택"}
            </span>
            <span className="text-xs text-[#707887]">
              PDF, DOCX, HWP 파일 지원 / 최대 200MB
            </span>
          </div>
        </div>

        {/* 대량 업로드 결과 목록 및 선택 개수 안내 */}
        <div className="flex flex-col gap-2 mt-1">
          {/* 선택 개수 마커 */}
          <div className="flex items-center gap-2 text-sm font-semibold text-[#344054] select-none">
            <FileText size={16} className="text-[#00194B]" />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {selectedFiles.length === 0 ? "이력서 없음" : `${selectedFiles.length}개 파일 선택됨`}
            </span>
          </div>

          {/* 선택된 파일 목록 */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-2 border border-[#E6EAF0] rounded-xl bg-[#F6F8FC]/50">
              {selectedFiles.map((file, idx) => (
                <div 
                  key={`${file.name}_${idx}`}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#E6EAF0] rounded-lg text-xs font-medium text-[#344054] shadow-sm max-w-xs"
                >
                  <FileText size={14} className="text-[#98A0AE] flex-shrink-0" />
                  <span className="truncate flex-1">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
                    title="파일 제외"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 인라인 개별 업로드 에러 메시지 */}
          {uploadErrorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-1 font-medium select-none">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{uploadErrorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
