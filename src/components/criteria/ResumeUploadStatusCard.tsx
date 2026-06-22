import React, { useRef, useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Trash2 } from "lucide-react";

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  status: string; // "마스킹 완료" | "처리 중" | "업로드 중" | "에러"
}

interface ResumeUploadStatusCardProps {
  uploadedFiles: UploadedFile[];
  onUploadFiles: (files: File[]) => void;
  onDeleteFile?: (id: number) => void;
  uploadStatusMessage?: string | null;
  isUploading: boolean;
}

export default function ResumeUploadStatusCard({
  uploadedFiles,
  onUploadFiles,
  onDeleteFile,
  uploadStatusMessage,
  isUploading
}: ResumeUploadStatusCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      onUploadFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      onUploadFiles(files);
    }
  };

  // 상태 배지 매퍼
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "마스킹 완료":
        return "bg-green-50 text-[#22C55E] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-md";
      case "처리 중":
        return "bg-orange-50 text-orange-500 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse";
      case "업로드 중":
        return "bg-blue-50 text-blue-500 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse";
      default:
        return "bg-gray-50 text-gray-400 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md";
    }
  };

  // 확장자 아이콘 컴포넌트
  const getFileIcon = (name: string) => {
    const ext = name.toLowerCase().split('.').pop();
    if (ext === 'pdf') {
      return (
        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
          PDF
        </div>
      );
    }
    if (ext === 'docx' || ext === 'doc') {
      return (
        <div className="w-8 h-8 rounded-lg bg-[#BACFFC] text-[#00194B] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
          DOCX
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
        HWP
      </div>
    );
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E6EAF0] rounded-2xl p-6 shadow-sm select-none font-sans flex flex-col gap-4">
      {/* 타이틀 및 가이드라인 */}
      <div>
        <h3 className="text-sm font-bold text-[#1C1F26]">이력서 업로드</h3>
        <p className="text-[11px] text-[#707887] mt-0.5">평가 기준 확인 후 이력서를 업로드하세요. 최대 5명.</p>
      </div>

      {/* 안심 마스킹 동의 바 */}
      <div className="flex items-center gap-2 p-2.5 bg-[#EDFDF5] border border-[#BACFFC]/20 rounded-lg text-[10px] text-[#22C55E] font-medium leading-relaxed">
        <CheckCircle size={12} className="flex-shrink-0" />
        <span>업로드 즉시 개인정보 자동 마스킹 · 이름 · 연락처 · 이메일 · 주소 익명 처리 후 분석</span>
      </div>

      {/* 에러 메시지 노출 */}
      {uploadStatusMessage && (
        <div className="flex items-start gap-1.5 p-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-[#EF4444] font-medium">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span>{uploadStatusMessage}</span>
        </div>
      )}

      {/* 실 분할 레이아웃: 업로드 박스 + 업로드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 드래그앤드랍 박스 */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
            isDragActive 
              ? "border-[#00194B] bg-[#EEF3FA]/30" 
              : "border-[#D4D9E1] hover:border-[#00194B]/50 hover:bg-[#F8FAFC]"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept=".pdf,.docx,.doc,.hwp"
          />

          <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#475467]">
            <Upload size={18} />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#1C1F26]">
              파일을 드래그하거나 클릭해서 선택
            </p>
            <p className="text-[10px] text-[#98A0AE] mt-1">
              PDF • DOC • HWP • 파일당 20MB 이하
            </p>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 bg-white border border-[#D4D9E1] rounded-lg text-[10px] font-semibold text-[#344054] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            파일 선택
          </button>
        </div>

        {/* 업로드 파일 결과 리스트 (우측 배치) */}
        <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
          {uploadedFiles && uploadedFiles.length > 0 ? (
            uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E6EAF0] rounded-xl hover:border-[#CBD5E1] transition-all gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1C1F26] truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[#707887] font-mono mt-0.5">
                      {file.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={getStatusBadge(file.status)}>
                    {file.status}
                  </span>
                  
                  {onDeleteFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                      title="지우기"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 text-[#98A0AE] border border-dashed border-[#E6EAF0] rounded-xl bg-[#F6F8FC]/40 select-none">
              <FileText size={24} className="stroke-[1.5] text-gray-300 mb-1" />
              <p className="text-[10px] font-medium">등록된 이력서가 없습니다.</p>
              <p className="text-[9px] text-gray-400 mt-0.5">이력서 원본을 올려 역량 검출을 대기시키십시오.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
