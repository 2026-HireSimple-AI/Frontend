/**
 * 이 파일은 전체 페이지 레이아웃(AppLayout)을 정의합니다.
 * 왼쪽에는 사이드바(Sidebar), 오른쪽에는 헤더(Header) 및 메인 콘텐츠 영역이 배치됩니다.
 * 디자인 가이드라인 준수:
 * - 데스크톱 전용 엔터프라이즈 SaaS 레이아웃 최적화
 * - 헤더 구성: 상단 소형 텍스트 카테고리(Process Label) + 하단 대형 가로형 단계 표시기(Step Navigation). 브레드크럼(Breadcrumb) 사용 금지.
 */

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  activeMenu: "new" | "manage" | string;
  isLoggedIn: boolean;
  user: {
    id: number;
    name: string;
    company_name: string;
    email?: string;
  } | null;
  onLogout?: () => void;
  // 현재 단계 (0: 분석 생성, 1: 평가 기준 검증, 2: 지원자 적합도 분석, 3: 면접 질문 생성)
  currentStep?: number;
}

export default function AppLayout({
  children,
  activeMenu,
  isLoggedIn,
  user,
  onLogout,
  currentStep = 0
}: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // 헤더 가이드의 단계명칭 선언
  const steps = [
    { name: "평가 기준 검증", number: 1 },
    { name: "지원자 적합도 분석", number: 2 },
    { name: "면접 질문 생성", number: 3 }
  ];

  const handleLogoutClick = () => {
    localStorage.removeItem("loggedInUser");
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F6F8FC] overflow-hidden font-sans">
      {/* 1. 사이드바 - 왼쪽 고정 */}
      <Sidebar
        isLoggedIn={isLoggedIn}
         user={user}
        activeMenu={activeMenu}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={onLogout}
      />

      {/* 2. 메인 콘텐츠 및 헤더 영역 - 오른쪽 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* 2-1. 헤더 (Header) 영역 */}
        <header className="bg-white border-b border-[#E6EAF0] px-8 py-4 flex items-center justify-between select-none w-full gap-4">
          <div className="flex flex-col gap-1.5">
            {/* 상단 라벨 (Process Label - 12px, 500, #707887) */}
            <div className="text-[12px] font-medium text-[#707887]">
              {currentStep === 0 ? "분석 생성 단계" : "채용 평가 분석"}
            </div>

            {/* 대형 가로형 단계 네비게이션 */}
            <div className="flex items-center gap-4 flex-wrap">
              <span 
                className={`text-[15px] font-semibold transition-colors ${
                  currentStep === 0 ? "text-[#00194B] font-bold" : "text-[#98A0AE]"
                }`}
              >
                공고문 등록 {currentStep === 0 && <span className="text-[#6D5DFC] text-xs font-bold font-mono ml-1">START</span>}
              </span>
              
              <span className="text-[#98A0AE] text-sm font-light">→</span>

              {steps.map((step, idx) => {
                const stepNumber = idx + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                
                return (
                  <React.Fragment key={step.name}>
                    <div 
                      className="flex items-center gap-1.5"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      <span 
                        className={`text-[15px] font-semibold transition-colors ${
                          isActive 
                            ? "text-[#00194B] font-bold" 
                            : isCompleted 
                              ? "text-[#475467]" 
                              : "text-[#98A0AE]"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <span className="text-[#98A0AE] text-sm font-light">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 우측 로그인/회원가입 인증 영역 */}
          <div>
            {isLoggedIn ? (
              <div className="flex items-center gap-3 select-none">
                <span className="text-xs font-medium text-[#344054]">
                  <strong className="text-[#00194B] font-bold">{user?.name || "채용담당자"}</strong> 님 환영합니다
                </span>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="h-9 px-3.5 rounded-xl border border-[#D4D9E1] text-[#1C1F26] bg-white text-xs font-bold hover:bg-[#F6F8FC] hover:text-red-600 cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 select-none">
                {/* 로그인 (Secondary Button) */}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="h-10 px-5 rounded-xl border border-[#D4D9E1] text-[#1C1F26] bg-white text-xs font-semibold hover:bg-[#F6F8FC] cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  로그인
                </button>

                {/* 회원가입 (Primary Button) */}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="h-10 px-5 rounded-xl text-white bg-[#00194B] text-xs font-bold hover:bg-[#002D80] cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 2-2. 페이지 메인 내용 */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 box-border">
          {children}
        </main>
      </div>
    </div>
  );
}
