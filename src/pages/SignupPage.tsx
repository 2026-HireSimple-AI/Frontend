/**
 * 이 파일은 사용자 회원가입 페이지(SignupPage)입니다.
 * - 이메일, 패스워드, 성함, 회사명을 입력 받습니다.
 * - 가입 완료 시 일러 배너를 노출하고 로그인 페이지로 안내합니다.
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Building, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim() || !company.trim()) {
      alert("모든 필수 입력 필드를 기입해 주십시오.");
      return;
    }

    setIsSubmit(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 로컬 스토리지 등에 가상 가입 저장 후 성공 상태 전환
    const registerUser = {
      email: email.trim(),
      name: name.trim(),
      company_name: company.trim()
    };
    
    // 데모 편의성을 위해 단시간 내 로그인 시 활용 가능하게 임시 기입
    localStorage.setItem("tmp_registered", JSON.stringify(registerUser));
    setIsSuccess(true);
    setIsSubmit(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="max-w-md w-full bg-white border border-[#E6EAF0] rounded-2xl p-8 shadow-sm flex flex-col gap-6">
        
        {isSuccess ? (
          /* 회원가입 완료 축하 레이아웃 */
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 text-[#22C55E] flex items-center justify-center">
              <CheckCircle2 size={40} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C1F26]">회원가입이 완료되었습니다!</h2>
              <p className="text-xs text-[#707887] mt-1.5 leading-relaxed">
                채용담당자 <strong>{name}</strong> 님의 소중한 가입을 환영합니다.<br />
                등록하신 회사 <strong>{company}</strong>를 기반으로 분석 계정이 연결되었습니다.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full h-11 bg-[#00194B] hover:bg-[#002D80] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              로그인 화면으로 이동하여 접속하기
            </button>
          </div>
        ) : (
          /* 회원가입 폼 레이아웃 */
          <>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#00194B] text-white flex items-center justify-center mx-auto mb-2 font-bold text-lg shadow">H</div>
              <h2 className="text-xl font-bold text-[#1C1F26] tracking-tight">Hire Simple AI 무료 회원가입</h2>
              <p className="text-xs text-[#707887] mt-1">간편 가입 후 AI를 활용해 채용 공고와 복수의 이력서를 완벽 조화 시켜 보세요.</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              {/* 성함 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#344054]">성함 *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3.5 text-[#98A0AE]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="김채용"
                    className="w-full h-11 pl-9 pr-3 border border-[#D4D9E1] focus:border-[#00194B] rounded-xl text-xs text-[#1C1F26] outline-none bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#344054]">회사용 이메일 계정 *</label>
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

              {/* 비밀번호 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#344054]">비밀번호 설정 *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-3.5 text-[#98A0AE]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="최소 6자 이상"
                    className="w-full h-11 pl-9 pr-3 border border-[#D4D9E1] focus:border-[#00194B] rounded-xl text-xs text-[#1C1F26] outline-none bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 회사명 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#344054]">소속 기업 혹은 단체명 *</label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-3.5 text-[#98A0AE]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="(예: 주식회사 에이아이텍)"
                    className="w-full h-11 pl-9 pr-3 border border-[#D4D9E1] focus:border-[#00194B] rounded-xl text-xs text-[#1C1F26] outline-none bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmit}
                className="w-full h-11 bg-[#00194B] hover:bg-[#002D80] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors mt-2"
              >
                {isSubmit ? "계정 대기열 생성 중..." : "위 약관 동의 및 가입 실행"}
              </button>
            </form>

            <div className="text-center border-t border-[#E6EAF0] pt-4 select-none flex items-center justify-center gap-1.5 text-xs text-[#707887]">
              <span>이미 가입하셨습니까?</span>
              <Link to="/login" className="text-[#6D5DFC] font-bold hover:underline">로그인 페이지</Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
