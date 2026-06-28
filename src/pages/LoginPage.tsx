/**
 * 이 파일은 사용자 로그인 페이지(LoginPage)입니다.
 * - 이메일과 비밀번호 입력이 가능하며, 사용자 검토 향상을 돕기 위해 prefill 원클릭 자동 로그인 설정을 내장합니다.
 * - 로그인 성공 시 로컬 세션('loggedInUser')에 저장한 후 원래 라우트로 리다이렉트합니다.
 */

import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Mail, Sparkles } from "lucide-react";
import { login, saveToken } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/analysis/new";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorText("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmit(true);
    setErrorText(null);

    try {
      // 실제 API 호출
      const authData = await login({ email, password });
      
      // 토큰 + 유저 정보 저장
      saveToken(authData);
      
      navigate(redirectUrl);
    } catch (err: any) {
      setErrorText(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="max-w-md w-full bg-white border border-[#E6EAF0] rounded-2xl p-8 shadow-sm flex flex-col gap-6">
        
        {/* 헤더 */}
        <div className="text-center">
          <div onClick={() => navigate("/analysis/new")}
              className="w-12 h-12 rounded-xl bg-[#00194B] text-white flex items-center justify-center mx-auto mb-2 font-bold text-lg select-none shadow cursor-pointer hover:bg-[#002D80] transition-colors"
            >H</div>
          <h2 className="text-xl font-bold text-[#1C1F26] tracking-tight">Hire Simple AI 채용담당자 로그인</h2>
          <p className="text-xs text-[#707887] mt-1">평가 분석 데이터를 영구 저장하고 분석 이력을 관리하려면 로그인해 주십시오.</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054]">비밀번호</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3.5 text-[#98A0AE]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
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
            {isSubmit ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 푸터 */}
        <div className="text-center border-t border-[#E6EAF0] pt-4 flex items-center justify-center gap-1.5 text-xs text-[#707887]">
          <span>계정이 없으십니까?</span>
          <Link to="/signup" className="text-[#6D5DFC] font-bold hover:underline">회원가입하기</Link>
        </div>

      </div>
    </div>
  );
}