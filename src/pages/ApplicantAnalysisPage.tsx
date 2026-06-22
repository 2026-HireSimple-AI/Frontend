import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PageTitleSection from "../components/applicant/PageTitleSection";
import AnalysisMetaCard from "../components/applicant/AnalysisMetaCard";
import AnalysisTabNavigation from "../components/applicant/AnalysisTabNavigation";
import IndividualAnalysisTab from "../components/applicant/IndividualAnalysisTab";
import ApplicantComparisonTab from "../components/applicant/ApplicantComparisonTab";
import BottomNotice from "../components/applicant/BottomNotice";
import GenerateInterviewButton from "../components/applicant/GenerateInterviewButton";
import InterviewCountModal from "../components/applicant/InterviewCountModal";

// API 메소드 로드
import { 
  getApplicants, 
  getApplicantDetail, 
  ApplicantSummary, 
  ApplicantDetail 
} from "../api/applicantApi";
import { generateApplicantInterviewQuestions } from "../api/interviewQuestionApi";

// @ts-ignore
import styles from "../styles/ApplicantAnalysisPage.module.css";

export default function ApplicantAnalysisPage() {
  const { jobPostingId } = useParams<{ jobPostingId: string }>();
  const navigate = useNavigate();

  // 사용자 세션 및 상태정합성
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [jobTitle, setJobTitle] = useState("백엔드 개발자 채용");
  const [activeTab, setActiveTab] = useState<"individual" | "comparison">("individual");
  
  // 데이터 상태 세기
  const [applicants, setApplicants] = useState<ApplicantSummary[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDetail | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);

  const [rankingLimit, setRankingLimit] = useState<number>(() => {
    const saved = localStorage.getItem("selected_ranking_limit");
    return saved ? Number(saved) : 5;
  });

  // 최초 데이터 동기체인성 로드
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }

    const targetJob = localStorage.getItem(`job_posting_${jobPostingId}`);
    if (targetJob) {
      setJobTitle(JSON.parse(targetJob).title);
    }

    // 1. 지원자 목록 API 호출 연동
    const loadApplicantsData = async () => {
      try {
        setIsPageLoading(true);
        const jpId = jobPostingId ? Number(jobPostingId) : 1;
        const fetchedApplicants = await getApplicants(jpId);
        setApplicants(fetchedApplicants);

        // 첫 번째 지원자를 기본 선택하여 상세 조회
        if (fetchedApplicants.length > 0) {
          await handleApplicantSelection(fetchedApplicants[0].id);
        }
      } catch (err) {
        console.error("지원자 정보 조회 실패:", err);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadApplicantsData();
  }, [jobPostingId]);

  // 해당 지원자의 상세정보 조회
  const handleApplicantSelection = async (applicantId: number) => {
    try {
      setIsDetailLoading(true);
      const detail = await getApplicantDetail(applicantId);
      setSelectedApplicant(detail);
    } catch (err) {
      console.error("지원자 상세 조회 에러:", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 면접 질문지 일괄 생성 API 통화 및 완성 후 Step 4로 네비게이션 처리
  const handleOpenCountModal = async () => {
    setIsCountModalOpen(true);
  };

  const handleConfirmCountSelection = async (selectedApplicantIds: number[]) => {
    if (selectedApplicantIds.length > 0) {
      const primaryId = selectedApplicantIds[0];
      navigate(`/analysis/${jobPostingId}/interview-questions?applicantId=${primaryId}&candidateIds=${selectedApplicantIds.join(",")}`);
    }
  };

  return (
    <AppLayout
      activeMenu="new"
      isLoggedIn={isLoggedIn}
      user={user}
      currentStep={2} // 채용평가단계 지원자적합도 2단계
    >
      <div className={styles.page} id="applicant-analysis-lifecycle-page">
        {/* 페이지 타이틀 정보 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E6EAF0] pb-5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#6D5DFC] uppercase tracking-widest block">STEP 03</span>
            <PageTitleSection jobTitle={jobTitle} />
          </div>
          <AnalysisMetaCard jobTitle={jobTitle} completedAt="2026.06.21 14:00" />
        </div>

        {/* 개별 분석 / 지원자 비교 네비 탭 */}
        <AnalysisTabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* 로딩 표시 또는 탭 분기 제어 */}
        {isPageLoading ? (
          <div className="py-24 text-center text-sm font-semibold text-[#98A0AE] animate-pulse">
            지원자 검증 지표 분석 로딩 중...
          </div>
        ) : activeTab === "individual" ? (
          selectedApplicant ? (
            <div className="relative">
              {isDetailLoading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center font-bold text-[#00194B]">
                  개별 이력서 세부 지표 수집 중...
                </div>
              )}
              <IndividualAnalysisTab
                applicants={applicants}
                selectedApplicant={selectedApplicant}
                onSelectApplicant={handleApplicantSelection}
                rankingLimit={rankingLimit}
                onRankingLimitChange={setRankingLimit}
              />
            </div>
          ) : (
            <div className="py-24 text-center text-sm text-[#98A0AE]">
              분석 가능한 지원자 정보가 검색되지 않았습니다.
            </div>
          )
        ) : (
          <ApplicantComparisonTab applicants={applicants} />
        )}

        {/* 하부 액션 전이 정보 고정 바 */}
        {selectedApplicant && activeTab === "individual" && (
          <div className={styles.bottomActionArea} id="bottom-transition-container">
            <BottomNotice />
            <GenerateInterviewButton 
              onGenerate={handleOpenCountModal} 
              disabled={isDetailLoading} 
            />
          </div>
        )}
      </div>

      {/* Interview Count Modal overlay */}
      <InterviewCountModal
        isOpen={isCountModalOpen}
        applicants={applicants}
        defaultCount={rankingLimit}
        onClose={() => setIsCountModalOpen(false)}
        onConfirm={handleConfirmCountSelection}
      />
    </AppLayout>
  );
}
