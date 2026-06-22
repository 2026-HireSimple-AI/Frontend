/**
 * 이 파일은 페이지 우측 상단에 배치되는 인증 버튼 컴포넌트(TopAuthButtons)입니다.
 * - 로그인 상태(isLoggedIn)가 아니면 '로그인' 및 '회원가입' 버튼을 보여줍니다.
 * - 로그인 상태이면 현재 상태 또는 로그아웃 인라인 알림을 연동할 수 있습니다.
 * - 버튼 규칙 준수:
 *   1. 회원가입 (Primary Button): 배경 #00194B, 흰색 텍스트, 12px 라운딩
 *   2. 로그인 (Secondary Button): 흰색 배경, 회색 보더, 검정 텍스트, 12px 라운딩
 */

import React from "react";
import { LogIn, UserPlus } from "lucide-react";

interface TopAuthButtonsProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  userName?: string;
  onLogoutClick?: () => void;
}

export default function TopAuthButtons({
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  userName,
  onLogoutClick
}: TopAuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4 select-none">
        <span className="text-sm font-medium text-[#344054]">
          <strong className="text-[#00194B]">{userName || "채용담당자"}</strong> 님 환영합니다
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 select-none">
      {/* 로그인 (Secondary Button) */}
      <button
        onClick={onLoginClick}
        className="h-11 px-6 rounded-xl border border-[#D4D9E1] text-[#1C1F26] bg-white text-sm font-medium hover:bg-[#F6F8FC] cursor-pointer transition-all active:scale-95"
      >
        로그인
      </button>

      {/* 회원가입 (Primary Button) */}
      <button
        onClick={onSignupClick}
        className="h-11 px-6 rounded-xl text-white bg-[#00194B] text-sm font-semibold hover:bg-[#002D80] cursor-pointer transition-all active:scale-95 shadow-sm"
      >
        회원가입
      </button>
    </div>
  );
}
