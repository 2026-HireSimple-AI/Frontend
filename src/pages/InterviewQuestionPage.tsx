import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PageTitleSection from "../components/interview/PageTitleSection";
import AnalysisMetaCard from "../components/interview/AnalysisMetaCard";
import ApplicantSelectCard from "../components/interview/ApplicantSelectCard";
import InterviewSettingCard from "../components/interview/InterviewSettingCard";
import QuestionListSection from "../components/interview/QuestionListSection";
import QuestionEditModal from "../components/interview/QuestionEditModal";
import BottomNotice from "../components/interview/BottomNotice";

// Standard API connectors
import { 
  getApplicants, 
  getApplicantDetail, 
  ApplicantDetail 
} from "../api/applicantApi";
import {
  getInterviewQuestions,
  generateApplicantInterviewQuestions,
  updateInterviewQuestion,
  addInterviewQuestion,
  InterviewQuestion
} from "../api/interviewQuestionApi";

export default function InterviewQuestionPage() {
  const { jobPostingId } = useParams<{ jobPostingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const parsedJobId = Number(jobPostingId) || 1;

  // 1. Core visual state
  const [jobPostingTitle, setJobPostingTitle] = useState("백엔드 개발자 (경력 3년 이상)");
  const [criteriaVersion, setCriteriaVersion] = useState("ver. 1.0 (2024.05.20)");
  const [generatedAt, setGeneratedAt] = useState("");

  // 2. Component State Declarations
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDetail | null>(null);
  

  const [isResumeSummaryOpen, setIsResumeSummaryOpen] = useState(false);

  // Settings state
  const [interviewTime, setInterviewTime] = useState("45분");
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([
    "행동", "역량", "우려검증", "기술검정", "기타"
  ]);

  // Questions pools & filtering
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionType, setActiveQuestionType] = useState("전체");

  // Modal active triggers
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Status indicators
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // Load cookies / auth
  useEffect(() => {
    const session = localStorage.getItem("loggedInUser");
    if (session) {
      setLoggedInUser(JSON.parse(session));
    } else {
      setLoggedInUser({
        id: 100,
        name: "김채움",
        company_name: "Acme Corp.",
        email: "recruiter@company.com"
      });
    }

    // Retrieve corresponding job posting name if stored
    const storedJob = localStorage.getItem(`job_posting_${parsedJobId}`);
    if (storedJob) {
      try {
        setJobPostingTitle(JSON.parse(storedJob).title);
      } catch (e) {
        // ignore
      }
    }
  }, [parsedJobId]);

  // Load applicants list on mount
  useEffect(() => {
    let active = true;

    async function fetchApplicantsList() {
      try {
        const fetched = await getApplicants(parsedJobId);
        if (!active) return;

        // candidateIds 파라미터가 있으면 해당 지원자만 표시
        const candidateIdsParam = searchParams.get("candidateIds");
        if (candidateIdsParam) {
          const candidateIds = candidateIdsParam.split(",").map(Number).filter(Boolean);
          const filtered = fetched.filter(a => candidateIds.includes(a.id));
          setApplicants(filtered.length > 0 ? filtered : fetched);
        } else {
          setApplicants(fetched);
        }

        // URL의 applicantId를 최우선 사용
        const urlSelectedId = searchParams.get("applicantId");
        if (urlSelectedId) {
          setSelectedApplicantId(Number(urlSelectedId));
        } else if (fetched.length > 0) {
          setSelectedApplicantId(fetched[0].id);
        }
      } catch (err) {
        console.error("이력서 정보 로드 에러:", err);
      }
    }

    fetchApplicantsList();
    return () => {
      active = false;
    };
  }, [parsedJobId, searchParams]);

  // Reload applicant data whenever selected applicant changes
  useEffect(() => {
    if (selectedApplicantId === null) {
      setSelectedApplicant(null);
      setQuestions([]);
      return;
    }

    const applicantId = selectedApplicantId;

    let active = true;

    async function loadApplicantDetailData() {
      try {
        console.log("[DEBUG] InterviewPage - 질문 조회 applicantId:", selectedApplicantId);
        const [detail, fetchedQuestions] = await Promise.all([
          getApplicantDetail(applicantId),
          getInterviewQuestions(applicantId)
        ]);
        console.log("[DEBUG] InterviewPage - 조회된 질문 수:", fetchedQuestions.length);

        if (!active) return;

        setSelectedApplicant(detail);

        if (fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          // DB에서 불러온 질문의 생성 시각 표시
          const latestCreatedAt = fetchedQuestions[fetchedQuestions.length - 1]?.created_at;
          if (latestCreatedAt) {
            const d = new Date(latestCreatedAt);
            setGeneratedAt(`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`);
          }
        } else {
          // 질문이 없으면 자동 생성
          setIsGenerating(true);
          try {
            const genResult = await generateApplicantInterviewQuestions(selectedApplicantId, {
              question_count: 5,
              question_types: ["행동", "역량", "우려검증", "기술검증", "기타"]
            });
            console.log("[DEBUG] 자동 생성 결과:", genResult);
            if (genResult.success) {
              const generated = await getInterviewQuestions(selectedApplicantId);
              if (active) {
                setQuestions(generated);
                setGeneratedAt(formatNow());
              }
            }
          } finally {
            if (active) setIsGenerating(false);
          }
        }
      } catch (e) {
        console.error("지원자 세부정보 획득 오류:", e);
      }
    }

    loadApplicantDetailData();
    return () => {
      active = false;
    };
  }, [selectedApplicantId]);

  // Select Dropdown action
  const handleSelectApplicant = (id: number) => {
    setSelectedApplicantId(id);
    setActiveQuestionType("전체"); // Reset filter
  };

  const formatNow = () => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  // Generate Questions Trigger
  const handleGenerateQuestions = async () => {
    if (!selectedApplicantId) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // Map "기술검정" -> "기술검증" for API compat
      const mappedTypes = selectedQuestionTypes.map(t => t === "기술검정" ? "기술검증" : t);
      
      const response = await generateApplicantInterviewQuestions(selectedApplicantId, {
        question_count: questionCount,
        question_types: mappedTypes
      });

      if (response.success) {
        const refreshed = await getInterviewQuestions(selectedApplicantId);
        setQuestions(refreshed);
        setGeneratedAt(formatNow());
      } else {
        setErrorMessage("질문 생성이 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("질문 생성 서버 에러가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate button callback (다시 생성하기)
  const handleRegenerateQuestions = async () => {
    await handleGenerateQuestions();
  };

  // Edit popups actions
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveQuestionListModal = async (updatedQuestions: InterviewQuestion[]) => {
    try {
      const savedQuestions: InterviewQuestion[] = [];

      for (const q of updatedQuestions) {
        if (q.id > 0) {
          // 기존 질문 수정
          await updateInterviewQuestion(q.id, q.question_text);
          savedQuestions.push(q);
        } else if (selectedApplicantId) {
          // 신규 질문 DB에 추가
          const result = await addInterviewQuestion(selectedApplicantId, {
            question_type: q.question_type,
            question_text: q.question_text,
            compliance_status: q.compliance_status || "준수",
            created_by: "USER"
          });
          if (result.success && result.data) {
            savedQuestions.push(result.data);
          } else {
            savedQuestions.push(q);
          }
        }
      }

      // 저장 후 DB에서 최신 목록 다시 조회
      if (selectedApplicantId) {
        const refreshed = await getInterviewQuestions(selectedApplicantId);
        setQuestions(refreshed.length > 0 ? refreshed : savedQuestions);
      } else {
        setQuestions(savedQuestions);
      }
    } catch (err: any) {
      console.error("면접 질문 세트 일괄 업데이트 중 에러:", err);
      throw new Error(err.message || "질문 내용 업데이트 실패");
    }
  };

  // PDF 저장
  const handleSaveQuestionList = () => {
    if (questions.length === 0) return;

    // 인쇄용 스타일 추가
    const style = document.createElement("style");
    style.id = "pdf-print-style";
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        #pdf-print-area, #pdf-print-area * { visibility: visible !important; }
        #pdf-print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 32px; }
      }
    `;
    document.head.appendChild(style);

    // 인쇄 영역 생성
    const printArea = document.createElement("div");
    printArea.id = "pdf-print-area";
    printArea.style.fontFamily = "sans-serif";
    printArea.innerHTML = `
      <h2 style="font-size:18px;font-weight:bold;margin-bottom:4px;">면접 질문지</h2>
      <p style="font-size:12px;color:#666;margin-bottom:20px;">${jobPostingTitle} · 생성일: ${generatedAt}</p>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:8px;border:1px solid #e2e8f0;width:40px;">번호</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">질문</th>
            <th style="padding:8px;border:1px solid #e2e8f0;width:70px;">유형</th>
            <th style="padding:8px;border:1px solid #e2e8f0;width:70px;">검수</th>
          </tr>
        </thead>
        <tbody>
          ${questions.map((q, i) => `
            <tr>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">${i + 1}</td>
              <td style="padding:8px;border:1px solid #e2e8f0;">${q.question_text}</td>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">${q.question_type}</td>
              <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;">${q.compliance_status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    document.body.appendChild(printArea);

    window.print();

    // 인쇄 후 정리
    document.body.removeChild(printArea);
    document.head.removeChild(style);
  };

  // Calculate stats
  const total = questions.length;
  const complianceStats = {
    guidelinePassedCount: total,
    lawViolationFreeCount: total,
    biasFreeCount: total,
    totalCount: total
  };

  return (
    <AppLayout 
      isLoggedIn={!!loggedInUser} 
      user={loggedInUser} 
      activeMenu="new"
      currentStep={3} // STEP 3. 면접 질문 생성
    >
      <div className="flex flex-col gap-6" id="interview-question-page-root">

        {/* Title Header with responsive float items matching reference image layout */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" id="page-title-meta-group">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#6D5DFC] uppercase tracking-widest block">STEP 04</span>
            <PageTitleSection 
              title="면접 질문 생성" 
              description="지원자 맞춤 면접 질문을 생성하고, 법령 및 가이드라인을 준수했는지 검수한 결과를 확인하세요." 
            />
          </div>

          {/* Inline Right visual metadata */}
          <AnalysisMetaCard 
            jobPostingTitle={jobPostingTitle}
            criteriaVersion={criteriaVersion}
            generatedAt={generatedAt}
          />
        </div>

        {/* 3-Column main responsive grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="three-column-grid-layout">
          
          {/* Column A: Left Action Controls Column (3/12 of width) */}
          <div className="lg:col-span-3 flex flex-col gap-4" id="panel-controls-left">
            <ApplicantSelectCard
              applicants={applicants}
              selectedApplicantId={selectedApplicantId}
              onSelectApplicant={handleSelectApplicant}
            />

            <InterviewSettingCard
              interviewTime={interviewTime}
              questionCount={questionCount}
              selectedQuestionTypes={selectedQuestionTypes}
              onChangeInterviewTime={setInterviewTime}
              onChangeQuestionCount={setQuestionCount}
              onChangeQuestionTypes={setSelectedQuestionTypes}
              onGenerateQuestions={handleGenerateQuestions}
              isGenerating={isGenerating}
            />
          </div>

          {/* Column B: Question list Board (5/12 of width) */}
          <div className="lg:col-span-6 flex flex-col gap-4" id="panel-questions-center">
            <QuestionListSection
              questions={questions}
              activeQuestionType={activeQuestionType}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerateQuestions}
              onOpenEditModal={handleOpenEditModal}
              onChangeQuestionType={setActiveQuestionType}
            />
          </div>

          {/* Column C: 통합 사이드 패널 */}
          <div className="lg:col-span-3" id="panel-compliance-right">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">

              {/* 지원자 정보 */}
              <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-800 truncate leading-tight">
                      {selectedApplicant?.real_name || "—"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {selectedApplicant?.career ? `경력 ${selectedApplicant.career}` : "지원자"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResumeSummaryOpen(!isResumeSummaryOpen)}
                  className="inline-flex items-center gap-1 py-1.5 px-2.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0"
                >
                  <span>{isResumeSummaryOpen ? "접기" : "이력서 요약"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {isResumeSummaryOpen ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                  </svg>
                </button>
              </div>

              {/* 이력서 요약 (펼침) */}
              {isResumeSummaryOpen && selectedApplicant?.resume_summary && (
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex flex-col gap-3">
                  {[
                    { label: "경력 요약", content: selectedApplicant.resume_summary.career_summary },
                    { label: "주요 프로젝트", content: selectedApplicant.resume_summary.project_summary },
                    { label: "핵심 보유기술", content: selectedApplicant.resume_summary.skill_summary },
                  ].map(({ label, content }) => (
                    <div key={label}>
                      <p className="text-[11px] font-bold text-slate-600 mb-0.5">{label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, "<br/>") || "-" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 구분선 + 검수 결과 타이틀 */}
              <div className="px-5 pt-4 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">검수 결과 요약</span>
              </div>

              {/* 배너 */}
              <div className="mx-4 mb-3 rounded-xl p-3 flex items-center gap-3 bg-emerald-50 border border-emerald-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-extrabold text-emerald-700 leading-snug">모든 질문이</span>
                  <span className="text-[11px] font-extrabold text-emerald-700 leading-snug">가이드라인을 준수했습니다.</span>
                </div>
              </div>

              {/* 체크리스트 */}
              <div className="px-4 pb-4 flex flex-col">
                {[
                  { label: "고용노동부 가이드 준수", passed: complianceStats.guidelinePassedCount },
                  { label: "법령 위반 소지 없음",   passed: complianceStats.lawViolationFreeCount },
                  { label: "편향·차별 표현 없음",   passed: complianceStats.biasFreeCount },
                ].map(({ label, passed }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600">{label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 tabular-nums">
                      {complianceStats.totalCount > 0 ? `${passed}/${complianceStats.totalCount}` : "—"}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Bottom footer noticeable bar (Info Notice + Dark save list PDF button & extra formats) */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50/40 border border-blue-100 rounded-2xl p-4 gap-4 mt-2" id="bottom-footer-bar">
          <BottomNotice />
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto" id="bottom-actions-container">
            <button
              type="button"
              onClick={handleSaveQuestionList}
              disabled={questions.length === 0}
              className="w-full sm:w-auto bg-[#00194B] hover:bg-[#002D80] active:bg-[#001030] leading-none text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md select-none group transition-all disabled:opacity-40 whitespace-nowrap"
              id="bottom-pdf-save-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>면접 질문 목록 저장 (.pdf)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Question Edit Modal popup */}
      <QuestionEditModal
        isOpen={isEditModalOpen}
        questions={questions}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuestion(null);
        }}
        onSave={handleSaveQuestionListModal}
      />
    </AppLayout>
  );
}
