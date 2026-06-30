import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, Users, MessageSquare, ArrowRight, Zap, BarChart3, Lock } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.target.classList.toggle("opacity-0", !e.isIntersecting)),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">HireSimple AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/analysis/new")}
            className="text-sm text-white font-semibold px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            무료로 시작하기
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* 배경 그라데이션 블롭 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <Zap size={12} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">공정채용 법령 자동 검수 탑재</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            채용 면접 질문,<br />
            <span className="text-blue-600">AI가 설계하고 법령까지 검수</span>합니다
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto">
            공고문을 넣으면 이력서 분석부터 맞춤 면접 질문 생성, 채용절차법 준수 검수까지
            한 번에 처리합니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/analysis/new")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-base shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
            >
              지금 바로 시작하기
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-base transition-colors"
            >
              로그인
            </button>
          </div>
        </div>

        {/* 히어로 목업 카드 */}
        <div className="relative max-w-2xl mx-auto mt-16">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-400 font-medium">면접 질문 생성 결과</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { type: "역량", text: "React 기반 프로젝트에서 상태관리를 어떻게 설계하셨나요?", status: "준수", color: "text-green-600 bg-green-50" },
                { type: "행동", text: "팀 내 의견 충돌이 있었을 때 어떻게 조율하셨나요?", status: "준수", color: "text-green-600 bg-green-50" },
                { type: "기술검증", text: "PostgreSQL 인덱스 최적화 경험이 있으시면 설명해주세요.", status: "준수", color: "text-green-600 bg-green-50" },
                { type: "행동", text: "결혼 계획이 있으신가요?", status: "심각", color: "text-red-600 bg-red-50" },
              ].map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 whitespace-nowrap mt-0.5">{q.type}</span>
                  <span className="text-sm text-slate-700 flex-1 text-left leading-relaxed">{q.text}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap mt-0.5 ${q.color}`}>{q.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">3단계로 끝나는 채용 프로세스</h2>
            <p className="text-slate-500">공고 등록부터 면접 질문 출력까지, 평균 5분</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: <FileText size={22} className="text-blue-600" />,
                title: "공고문 등록",
                desc: "채용 공고 URL을 붙여넣으면 AI가 자동으로 자격요건·기술스택·주요업무를 추출합니다.",
                color: "bg-blue-50"
              },
              {
                step: "02",
                icon: <Users size={22} className="text-indigo-600" />,
                title: "이력서 업로드",
                desc: "지원자 이력서를 업로드하면 블라인드 처리 후 적합도를 자동 분석합니다.",
                color: "bg-indigo-50"
              },
              {
                step: "03",
                icon: <MessageSquare size={22} className="text-purple-600" />,
                title: "면접 질문 생성",
                desc: "공고와 이력서를 기반으로 맞춤 질문을 생성하고 공정채용 법령 준수 여부를 즉시 검수합니다.",
                color: "bg-purple-50"
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">STEP {item.step}</div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">왜 HireSimple AI인가요?</h2>
            <p className="text-slate-500">채용 담당자가 반복하던 일을 AI가 대신합니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: <ShieldCheck size={20} className="text-green-600" />,
                bg: "bg-green-50",
                title: "공정채용 법령 자동 검수",
                desc: "채용절차법 제4조의3 기반으로 결혼·나이·가족관계 등 위반 질문을 실시간으로 탐지하고 대체 질문을 제안합니다."
              },
              {
                icon: <BarChart3 size={20} className="text-blue-600" />,
                bg: "bg-blue-50",
                title: "RAG 기반 법령 검색",
                desc: "최신 법령 문서를 벡터 DB에 저장하고, 면접 질문 생성 시 실시간으로 관련 조항을 검색해 컨텍스트로 활용합니다."
              },
              {
                icon: <Users size={20} className="text-indigo-600" />,
                bg: "bg-indigo-50",
                title: "블라인드 채용 지원",
                desc: "이력서 업로드 시 개인정보를 자동 마스킹하여 APPLICANT_001 형태의 코드로 관리합니다."
              },
              {
                icon: <Lock size={20} className="text-purple-600" />,
                bg: "bg-purple-50",
                title: "PDF 출력 및 기록 관리",
                desc: "생성된 면접 질문을 PDF로 저장하고, 공고별·지원자별 이력을 대시보드에서 관리합니다."
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            지금 바로 첫 면접 질문을<br />생성해보세요
          </h2>
          <p className="text-blue-100 mb-8 text-base leading-relaxed">
            회원가입 없이도 공고 등록과 질문 생성을 무료로 체험할 수 있습니다.
          </p>
          <button
            onClick={() => navigate("/analysis/new")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl text-base shadow-lg hover:bg-blue-50 transition-colors hover:scale-[1.02]"
          >
            무료로 시작하기
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-100 bg-white text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
            <ShieldCheck size={10} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-700">HireSimple AI</span>
        </div>
        <p className="text-xs text-slate-400">© 2026 HireSimple AI. 공정채용을 위한 AI 면접 질문 생성 플랫폼.</p>
      </footer>
    </div>
  );
}
