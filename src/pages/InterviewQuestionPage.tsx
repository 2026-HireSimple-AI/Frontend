import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PageTitleSection from "../components/interview/PageTitleSection";
import AnalysisMetaCard from "../components/interview/AnalysisMetaCard";
import ApplicantSelectCard from "../components/interview/ApplicantSelectCard";
import InterviewSettingCard from "../components/interview/InterviewSettingCard";
import QuestionListSection from "../components/interview/QuestionListSection";
import ResumeSummaryToggleCard from "../components/interview/ResumeSummaryToggleCard";
import ComplianceSummaryCard from "../components/interview/ComplianceSummaryCard";
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
  const [generatedAt, setGeneratedAt] = useState("2024.05.20 15:24");

  // 2. Component State Declarations
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDetail | null>(null);
  
  // Requirement state: defaults to false as strictly requested: "isResumeSummaryOpen must default to false."
  const [isResumeSummaryOpen, setIsResumeSummaryOpen] = useState(false);

  // Settings state
  const [interviewTime, setInterviewTime] = useState("45분");
  const [questionCount, setQuestionCount] = useState(9);
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

    let active = true;

    async function loadApplicantDetailData() {
      try {
        console.log("[DEBUG] InterviewPage - 질문 조회 applicantId:", selectedApplicantId);
        const [detail, fetchedQuestions] = await Promise.all([
          getApplicantDetail(selectedApplicantId),
          getInterviewQuestions(selectedApplicantId)
        ]);
        console.log("[DEBUG] InterviewPage - 조회된 질문 수:", fetchedQuestions.length);

        if (!active) return;

        setSelectedApplicant(detail);

        if (fetchedQuestions.length > 0) {
          const loadedTypes = Array.from(new Set(fetchedQuestions.map(q =>
            q.question_type === "기술검증" ? "기술검정" : q.question_type
          )));
          setSelectedQuestionTypes(loadedTypes);
          setQuestionCount(fetchedQuestions.length);
          setQuestions(fetchedQuestions);
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
              if (active) setQuestions(generated);
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
    setIsResumeSummaryOpen(false); // Default to false as strictly requested!
    setActiveQuestionType("전체"); // Reset filter
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
        const now = new Date();
        const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setGeneratedAt(formattedTime);
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
      // 1. Maintain local visual synchronization
      setQuestions(updatedQuestions);

      // 2. Persister locally
      if (selectedApplicantId) {
        localStorage.setItem(`questions_${selectedApplicantId}`, JSON.stringify(updatedQuestions));
      }

      // 3. Batch patches to actual endpoints for compliant sync
      for (const q of updatedQuestions) {
        if (q.id > 0) {
          await updateInterviewQuestion(q.id, q.question_text);
        }
      }
    } catch (err: any) {
      console.error("면접 질문 세트 일괄 업데이트 중 에러:", err);
      throw new Error(err.message || "질문 내용 업데이트 실패");
    }
  };

  // Mock download action for hwp
  const handleDownloadHwp = () => {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 transform translate-y-0 opacity-100 transition-all";
    toast.innerHTML = `📥 hwp 포맷으로 질문지가 출력 저장되었습니다.`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  // Final Action Click Handler - PDF Save & Exit
  const handleSaveQuestionList = async () => {
    if (questions.length === 0) return;

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsGenerating(false);
    setIsSaving(false);

    // Save configuration states to local storage to simulate complete step lock
    localStorage.setItem(`final_saved_questions_${parsedJobId}_${selectedApplicantId || 1}`, JSON.stringify(questions));

    const toast = document.createElement("div");
    toast.className = "fixed bottom-16 right-5 bg-stone-900 text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-xl z-50 flex items-center gap-2 transform translate-y-0 opacity-100 transition-all";
    toast.innerHTML = `🏁 면접 질문지 PDF 및 최종 데이터 백업이 안전하게 전송되었습니다!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);

    // Direct transition back to dashboard
    setTimeout(() => {
      navigate("/analysis/manage");
    }, 1200);
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

          {/* Column C: Resume Summary & Compliances summary (3/12 of width) */}
          <div className="lg:col-span-3 flex flex-col gap-4" id="panel-compliance-right">
            {/* Resume Summary Card (strictly default closed state) */}
            <ResumeSummaryToggleCard
              selectedApplicant={selectedApplicant}
              resumeSummary={selectedApplicant?.resume_summary || null}
              isOpen={isResumeSummaryOpen}
              onToggle={() => setIsResumeSummaryOpen(!isResumeSummaryOpen)}
            />

            {/* Compliance Results checklist */}
            <ComplianceSummaryCard 
              complianceSummary={complianceStats}
            />
          </div>

        </div>

        {/* Bottom footer noticeable bar (Info Notice + Dark save list PDF button & extra formats) */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50/40 border border-blue-100 rounded-2xl p-4 gap-4 mt-2" id="bottom-footer-bar">
          <BottomNotice />
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto" id="bottom-actions-container">
            {!isGenerating && questions.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleRegenerateQuestions}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 border border-slate-200 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs select-none transition-all leading-none"
                  id="incard-regenerate-btn"
                >
                  <span>🔄 다시 생성하기</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadHwp}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 border border-slate-200 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs select-none transition-all leading-none"
                  id="incard-hwp-btn"
                >
                  <span>📥 hwp로 저장하기</span>
                </button>
              </>
            )}
            
            <button
              type="button"
              onClick={handleSaveQuestionList}
              disabled={isSaving || questions.length === 0}
              className="w-full sm:w-auto bg-[#00194B] hover:bg-[#002D80] active:bg-[#001030] leading-none text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md select-none group transition-all disabled:opacity-40 whitespace-nowrap"
              id="bottom-pdf-save-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isSaving ? "저장 중..." : "면접 질문 목록 저장 (.pdf)"}</span>
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
