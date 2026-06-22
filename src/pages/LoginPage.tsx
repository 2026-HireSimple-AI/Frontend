/**
 * 이 파일은 사용자 로그인 페이지(LoginPage)입니다.
 * - 이메일과 비밀번호 입력이 가능하며, 사용자 검토 향상을 돕기 위해 prefill 원클릭 자동 로그인 설정을 내장합니다.
 * - 로그인 성공 시 로컬 세션('loggedInUser')에 저장한 후 원래 라우트로 리다이렉트합니다.
 */

import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Mail, Building, Key, Sparkles, LogIn } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/analysis/new";

  const [email, setEmail] = useState("recruiter@company.com");
  const [password, setPassword] = useState("password1234");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);

  // 명세 내 로그인 함수 (Mock 호환성)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorText("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmit(true);
    setErrorText(null);

    // API 통신 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "recruiter@company.com" && password === "password1234") {
      const mockSession = {
        id: 1,
        email: "recruiter@company.com",
        name: "김채용",
        company_name: "테스트컴퍼니",
        role: "recruiter"
      };
      
      localStorage.setItem("loggedInUser", JSON.stringify(mockSession));
      setIsSubmit(false);
      navigate(redirectUrl);
    } else {
      setErrorText("가입 정보를 찾을 수 없습니다. 예시 패스워드('password1234')를 입력 후 원클릭 로그인해 보십시오.");
      setIsSubmit(false);
    }
  };

  // 1초 원클릭 자동완성 로그인 장치 제공 (데모 친화성)
  const handleQuickDemoLogin = () => {
    setEmail("recruiter@company.com");
    setPassword("password1234");
    const mockSession = {
      id: 1,
      email: "recruiter@company.com",
      name: "김채용",
      company_name: "테스트컴퍼니",
      role: "recruiter"
    };
    localStorage.setItem("loggedInUser", JSON.stringify(mockSession));
    navigate(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="max-w-md w-full bg-white border border-[#E6EAF0] rounded-2xl p-8 shadow-sm flex flex-col gap-6">
        
        {/* 설명 헤더 */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#00194B] text-white flex items-center justify-center mx-auto mb-2 font-bold text-lg select-none shadow">H</div>
          <h2 className="text-xl font-bold text-[#1C1F26] tracking-tight">Hire Simple AI 채용담당자 로그인</h2>
          <p className="text-xs text-[#707887] mt-1">평가 분석 데이터를 영구 저적하고 분석 이력을 관리하려면 로그인해 주십시오.</p>
        </div>

        {/* 원클릭 테스트 계정 유인 상자 */}
        <div 
          onClick={handleQuickDemoLogin}
          className="bg-[#EEF3FA] border border-[#00194B]/10 rounded-xl p-3 text-left cursor-pointer flex items-center justify-between hover:bg-[#EEF3FA]/80 transition-colors"
        >
          <div>
            <span className="text-[10px] font-bold text-[#6D5DFC] uppercase tracking-wide block">Easy Demo Mode</span>
            <span className="text-xs font-semibold text-[#00194B] mt-0.5">원클릭 테스트 계정으로 즉시 로그인하기</span>
          </div>
          <Sparkles size={16} className="text-[#6D5DFC] fill-[#6D5DFC]/20 animate-pulse" />
        </div>

        {/* 폼 양식 */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          {/* 이메일 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054]">담당자 계정 이메일</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3.5 text-[#98A0AE]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full h-11 pl-9 pr-3 border border-[#D4D9E1] focus:border-[#00194B] rounded-xl text-xs text-[#1C1F26] outline-none bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* 비번 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054]">비밀번호</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3.5 text-[#98A0AE]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password1234"
                className="w-full h-11 pl-9 pr-3 border border-[#D4D9E1] focus:border-[#00194B] rounded-xl text-xs text-[#1C1F26] outline-none bg-white transition-colors"
                required
              />
            </div>
          </div>

          {errorText && (
            <div className="text-xs text-[#EF4444] font-medium mt-1">
              * {errorText}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmit}
            className="w-full h-11 bg-[#00194B] hover:bg-[#002D80] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors mt-2"
          >
            {isSubmit ? "계정정보 검증 중..." : "로그인 수행하기"}
          </button>
        </form>

        {/* 푸터 문구 */}
        <div className="text-center border-t border-[#E6EAF0] pt-4 select-none flex items-center justify-center gap-1.5 text-xs text-[#707887]">
          <span>계정이 없으십니까?</span>
          <Link to="/signup" className="text-[#6D5DFC] font-bold hover:underline">회원가입하기</Link>
        </div>

      </div>
    </div>
  );
}
