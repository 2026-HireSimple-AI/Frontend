/**
 * 이 파일은 화면 맨 하단 시작 버튼밑에 안전 마커로 부착되는 보안 안내 컴포넌트(SecurityNotice)입니다.
 * - 텍스트: 업로드된 파일은 안전하게 처리되며, 분석 후 즉시 삭제됩니다.
 * - 아이콘: Lock / Shield 구조 매치
 */

import React from "react";
import { ShieldAlert } from "lucide-react";

interface SecurityNoticeProps {
  message?: string;
}

export default function SecurityNotice({
  message = "업로드된 파일은 안전하게 처리되며, 분석 후 즉시 삭제됩니다."
}: SecurityNoticeProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-[#707887] select-none text-center mt-3 py-1 font-medium">
      <ShieldAlert size={14} className="text-[#22C55E]" />
      <span>{message}</span>
    </div>
  );
}
