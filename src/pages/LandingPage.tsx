// 이 파일은 서비스 진입 랜딩 페이지입니다.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import s from "./LandingPage.module.css";

const MOCK_QUESTIONS = [
  { type: "역량", text: "React 기반 프로젝트에서 상태관리를 어떻게 설계하셨나요?", status: "준수", danger: false },
  { type: "기술검증", text: "PostgreSQL 인덱스 최적화 경험이 있으시면 설명해주세요.", status: "준수", danger: false },
  { type: "행동", text: "팀 내 의견 충돌이 있었을 때 어떻게 조율하셨나요?", status: "준수", danger: false },
  { type: "행동", text: "결혼 계획이 있으신가요?", status: "심각", danger: true },
];

const STEPS = [
  {
    icon: "📄",
    iconClass: s.iconBlue,
    step: "STEP 01",
    title: "채용공고 등록",
    desc: "URL을 붙여넣으면 AI가 자격요건·기술스택·주요업무를 자동으로 추출합니다.",
  },
  {
    icon: "👤",
    iconClass: s.iconPurple,
    step: "STEP 02",
    title: "이력서 업로드",
    desc: "지원자 이력서를 업로드하면 블라인드 처리 후 적합도를 자동 분석합니다.",
  },
  {
    icon: "💬",
    iconClass: s.iconGreen,
    step: "STEP 03",
    title: "면접 질문 생성",
    desc: "공고와 이력서를 기반으로 맞춤 질문을 생성하고 공정채용 법령을 즉시 검수합니다.",
  },
];

const FEATURES = [
  {
    icon: "🛡️",
    iconClass: s.iconBlue,
    title: "공정채용 법령 자동 검수",
    desc: "채용절차법 제4조의3 기반으로 결혼·나이·가족관계 등 위반 질문을 실시간 탐지하고 대체 질문을 제안합니다.",
  },
  {
    icon: "🔍",
    iconClass: s.iconPurple,
    title: "RAG 기반 법령 검색",
    desc: "최신 법령 문서를 벡터 DB에 저장하고, 면접 질문 생성 시 관련 조항을 실시간 검색해 컨텍스트로 활용합니다.",
  },
  {
    icon: "🎭",
    iconClass: s.iconGreen,
    title: "블라인드 채용 지원",
    desc: "이력서 업로드 시 개인정보를 자동 마스킹하여 APPLICANT_001 코드로 관리합니다.",
  },
  {
    icon: "📊",
    iconClass: s.iconOrange,
    title: "PDF 출력 및 기록 관리",
    desc: "생성된 면접 질문을 PDF로 저장하고 공고별·지원자별 이력을 대시보드에서 관리합니다.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const stored = localStorage.getItem("loggedInUser");
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch { setUser({}); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <div className={s.page}>

      {/* NAV */}
      <nav className={s.nav}>
        <div className={s.navLogo}>
          <div className={s.navLogoIcon}>H</div>
          <span className={s.navLogoText}>HireSimple AI</span>
        </div>
        <div className={s.navActions}>
          {user ? (
            <>
              <button className={s.btnNavSecondary} onClick={() => navigate("/dashboard")}>
                {user.name || user.email || "내 대시보드"}
              </button>
              <button className={s.btnNavSecondary} onClick={handleLogout} style={{ marginLeft: 4 }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className={s.btnNavSecondary} onClick={() => navigate("/login")}>
                로그인
              </button>
              <button className={s.btnNavPrimary} onClick={() => navigate("/analysis/new")}>
                무료로 시작하기
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroBadge}>
          <span className={s.heroBadgeDot} />
          <span className={s.heroBadgeText}>공정채용 법령 자동 검수 탑재</span>
        </div>

        <h1 className={s.heroTitle}>
          채용 면접 질문,<br />
          <span className={s.heroTitleAccent}>AI가 설계하고 법령까지 검수</span>합니다
        </h1>

        <p className={s.heroDesc}>
          공고문을 넣으면 이력서 분석부터 맞춤 면접 질문 생성,<br />
          채용절차법 준수 검수까지 한 번에 처리합니다.
        </p>

        <div className={s.heroActions}>
          <button className={s.btnPrimary} onClick={() => navigate("/analysis/new")}>
            지금 바로 시작하기 →
          </button>
          {!user && (
            <button className={s.btnSecondary} onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>

        {/* 목업 카드 */}
        <div className={s.heroMockup}>
          <div className={s.mockupBar}>
            <span className={`${s.mockupDot} ${s.mockupDotRed}`} />
            <span className={`${s.mockupDot} ${s.mockupDotYellow}`} />
            <span className={`${s.mockupDot} ${s.mockupDotGreen}`} />
            <span className={s.mockupLabel}>면접 질문 생성 결과 — APPLICANT_001</span>
          </div>
          <div className={s.mockupBody}>
            {MOCK_QUESTIONS.map((q, i) => (
              <div key={i} className={s.mockupRow}>
                <span className={s.mockupType}>{q.type}</span>
                <span className={s.mockupText}>{q.text}</span>
                <span className={q.danger ? s.badgeDanger : s.badgeOk}>{q.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={s.stats}>
        <div className={s.statsGrid}>
          <div>
            <div className={s.statNum}>3분</div>
            <div className={s.statLabel}>공고 등록 → 면접 질문 완성</div>
          </div>
          <div>
            <div className={s.statNum}>100%</div>
            <div className={s.statLabel}>채용절차법 자동 검수</div>
          </div>
          <div>
            <div className={s.statNum}>0원</div>
            <div className={s.statLabel}>기본 기능 무료 제공</div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className={s.steps}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>3단계로 끝나는 채용 프로세스</h2>
          <p className={s.sectionDesc}>공고 등록부터 면접 질문 출력까지, 평균 3분</p>
        </div>
        <div className={s.stepsGrid}>
          {STEPS.map((item) => (
            <div key={item.step} className={s.stepCard}>
              <div className={`${s.stepIconWrap} ${item.iconClass}`}>
                {item.icon}
              </div>
              <div className={s.stepNum}>{item.step}</div>
              <h3 className={s.stepTitle}>{item.title}</h3>
              <p className={s.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={s.features}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>왜 HireSimple AI인가요?</h2>
          <p className={s.sectionDesc}>채용 담당자가 반복하던 일을 AI가 대신합니다</p>
        </div>
        <div className={s.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={s.featureCard}>
              <div className={`${s.featureIcon} ${f.iconClass}`}>
                {f.icon}
              </div>
              <div className={s.featureBody}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={s.cta}>
        <h2 className={s.ctaTitle}>지금 바로 첫 면접 질문을 생성해보세요</h2>
        <p className={s.ctaDesc}>
          회원가입 없이도 공고 등록과 질문 생성을 무료로 체험할 수 있습니다.
        </p>
        <div className={s.ctaActions}>
          <button className={s.btnCtaPrimary} onClick={() => navigate("/analysis/new")}>
            무료로 시작하기 →
          </button>
          {!user && (
            <button className={s.btnCtaSecondary} onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={s.footerLogo}>
          <div className={s.footerLogoIcon}>H</div>
          <span className={s.footerLogoText}>HireSimple AI</span>
        </div>
        <span className={s.footerCopy}>© 2026 HireSimple AI. 공정채용을 위한 AI 면접 질문 생성 플랫폼.</span>
      </footer>

    </div>
  );
}
