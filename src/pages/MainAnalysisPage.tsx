/**
 * 이 파일은 분석 생성(STEP 1) 페이지의 메인 로직을 관리하는 MainAnalysisPage 컴포넌트입니다.
 * - 사용자는 공고문 URL을 입력하고 복수의 이력서를 드래그&드롭 혹은 탐색기로 선택하여 업로드할 수 있습니다.
 * - API 연결 순서 조건 준수:
 *   [이력서 없음] 
 *     1. POST /job-postings
 *     2. POST /job-postings/{job_posting_id}/format
 *     3. POST /job-postings/{job_posting_id}/criteria
 *     4. /analysis/:jobPostingId/criteria-review 이동!
 *   [이력서 있음]
 *     1. POST /job-postings
 *     2. POST /job-postings/{job_posting_id}/format
 *     3. POST /job-postings/{job_posting_id}/criteria
 *     4. POST /job-postings/{job_posting_id}/resumes
 *     5. /analysis/:jobPostingId/criteria-review 이동!
 * - 이력서 유무에 상관없이 반드시 STEP 2(Criteria Review) 페이지로만 넘어가야 하며, 바로 적합도 평가페이지로 가선 안 됩니다.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import TopAuthButtons from "../components/main/TopAuthButtons";
import HeroSection from "../components/main/HeroSection";
import JobPostingUrlCard from "../components/main/JobPostingUrlCard";
import ResumeUploadCard from "../components/main/ResumeUploadCard";
import StartAnalysisButton from "../components/main/StartAnalysisButton";
import SecurityNotice from "../components/main/SecurityNotice";
import { getToken , logout  } from "../api/authApi";


// 생성한 API 호출 모듈들
import { createJobPosting, formatJobPosting } from "../api/jobPostingApi";
import { createEvaluationCriteria } from "../api/criteriaApi";
import { uploadResumes } from "../api/resumeApi";

// @ts-ignore
import styles from "../styles/MainAnalysisPage.module.css";
import { AlertCircle, HelpCircle, CheckCircle } from "lucide-react";

export default function MainAnalysisPage() {
  const navigate = useNavigate();

  // 1. 상태 선언 (상태 관리 단일 위치 원칙)
  const [jobUrl, setJobUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // URL 검증 에러
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null); // 이력서 업로드 용 에러
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null); // 바텀 API 호출 에러
  const [apiStepStatus, setApiStepStatus] = useState<string>(""); // 진행 중인 API 상태 표기 

  // 인증 상태 조회 (LocalStorage와 세션 상태 연동)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; company_name: string; email?: string } | null>(null);

  // 컴포넌트 마운트 시 인증정보 로드
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    } else {
      // 디폴트 로그인 권장을 돕기 위해 디폴트로 로그아웃 상태이나, UI 상단 버튼으로 손쉽게 토글 지원
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // 로그아웃 제어
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  // 로그인 모달/이동 버튼 클릭 시 동작
  const handleLoginClick = () => {
    navigate("/login");
  };

  // 회원가입 클릭 시 동작
  const handleSignupClick = () => {
    navigate("/signup");
  };

  // URL 변경 이벤트 수신 및 에러 초기화
  const handleUrlChange = (url: string) => {
    setJobUrl(url);
    if (errorMessage) {
      setErrorMessage(null);
    }
    if (apiErrorMessage) {
      setApiErrorMessage(null);
    }
  };

  // 파일 목록 변경 수신 및 에러 초기화
  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
    if (uploadErrorMessage) {
      setUploadErrorMessage(null);
    }
    if (apiErrorMessage) {
      setApiErrorMessage(null);
    }
  };

  // 2. 통합 분석 실행 시동기 (handleStartAnalysis)
  const handleStartAnalysis = async () => {
    // A. 공고문 URL 필수값 유효성 검증
    if (!jobUrl.trim()) {
      setErrorMessage("채용 공고 URL을 입력해주세요. (URL 필수 입력 제약)");
      return;
    }

    // 간단한 포맷 검사
    if (!jobUrl.toLowerCase().startsWith("http://") && !jobUrl.toLowerCase().startsWith("https://")) {
      setErrorMessage("올바른 URL 형식(https://example.com/job-posting)으로 입력해주세요.");
      return;
    }

    // 이력서 있으면 API 호출 전에 바로 로그인 체크
    if (selectedFiles.length > 0 && !getToken()) {
      const goLogin = window.confirm(
        "이력서 분석은 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      if (goLogin) {
        navigate("/login");
      }
      return;
    }

    // 초기 상태 청소 및 진행 시작
    setIsLoading(true);
    setApiErrorMessage(null);
    setErrorMessage(null);
    setUploadErrorMessage(null);

    let currentJobPostingId: number | null = null;

    try {
      // CASE 1 & CASE 2 공통: 1단계 - 채용공고 생성등록 (POST /job-postings)
      setApiStepStatus("1/3 채용공고문 수집 및 DB 등록 중...");
      //const mockResultTitle = jobUrl.includes("backend") ? "백엔드 핵심 개발자 채용" : "우수 소프트웨어 엔지니어 영입공고";
      const jobPosting = await createJobPosting(jobUrl.trim());
      currentJobPostingId = jobPosting.job_posting_id;

      // CASE 1 & CASE 2 공통: 2단계 - LLM 분석 및 공고 구조화 수행 (POST /job-postings/{id}/format)
      setApiStepStatus("2/3 AI와 연동하여 필요역량(기술스택/자격조건) 구조화 중...");
      await formatJobPosting(currentJobPostingId);

      // CASE 1 & CASE 2 공통: 3단계 - 공고문 기반 핵심 채용평가 기준 생성 (POST /job-postings/{id}/criteria)
      setApiStepStatus("3/3 가중치가 반영된 세부 평가 기준표 도출 중...");
      await createEvaluationCriteria(currentJobPostingId);

      // CASE 2 전용: 4단계 - 이력서 파일 다중 전송 (POST /job-postings/{id}/resumes)
      if (selectedFiles.length > 0) {
        setApiStepStatus(`이력서 ${selectedFiles.length}건 마스킹 처리 및 배치 업로드 중...`);
        await uploadResumes(currentJobPostingId, selectedFiles);
        
      } else {
        localStorage.setItem(`uploaded_resumes_${currentJobPostingId}`, JSON.stringify({ uploaded_count: 0, files: [] }));
      }

      setApiStepStatus("완료! 평가 기준 검증 화면(STEP 2)으로 안전하게 이동합니다.");

      // 단기 딜레이 후 강도높은 준수 사항에 따른 라우팅 트리거 (무조건 Criteria Review 페이지로 이동함)
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/analysis/${currentJobPostingId}/criteria-review`);
      }, 600);

    } catch (error: any) {
      console.error("전체 흐름 분석 프로세스 처리 중 장애 발생:", error);
      setApiErrorMessage(
        error?.message || "서버 통신 실패 또는 모듈에서 오류가 검출되었습니다. 다시 기입해 주십시오."
      );
      setIsLoading(false);
      setApiStepStatus("");
    }
  };

  return (
    <AppLayout 
      activeMenu="new" 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={handleLogout}
      currentStep={0} // STEP 1. Analysis Creation
    >
      <div className={styles.mainContent}>

        {/* 1. 중앙 히어로 센서 */}
        <HeroSection />

        {/* 2. 핵심 입력 폼 카드 컨테이너 */}
        <div className={styles.formArea}>
          
          {/* 채용 공고 URL 카드 */}
          <JobPostingUrlCard
            jobUrl={jobUrl}
            onChangeJobUrl={handleUrlChange}
            errorMessage={errorMessage}
            disabled={isLoading}
          />

          {/* 여러 명 이력서 복수 파일 드롭존 카드 */}
          <ResumeUploadCard
            selectedFiles={selectedFiles}
            onChangeFiles={handleFilesChange}
            uploadErrorMessage={uploadErrorMessage}
            disabled={isLoading}
          />

          {/* 3. 처리 단계별 미세 인디케이터 배너 */}
          {isLoading && apiStepStatus && (
            <div className="flex items-center gap-3 px-4 py-3 bg-[#EEF3FA] border border-[#00194B]/10 rounded-xl text-xs text-[#00194B] font-semibold select-none animate-pulse">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D5DFC] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D5DFC]"></span>
              </span>
              <span>{apiStepStatus}</span>
            </div>
          )}

          {/* 4. API 에러 인라인 노출 영역 (바텀 버튼에 인쇄됨) */}
          {apiErrorMessage && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-[#EF4444]/20 rounded-xl text-xs text-[#EF4444] font-semibold select-none">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{apiErrorMessage}</span>
            </div>
          )}

          {/* 5. 최종 트리거 버튼 */}
          <StartAnalysisButton
            jobUrl={jobUrl}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            onClick={handleStartAnalysis}
          />

          {/* 6. 지침 보안 서약서 마디 */}
          <SecurityNotice />

          {/* 기능 활용 꿀팁 추가 */}
          <div className="mt-8 border border-[#E6EAF0] rounded-xl p-4 bg-white/60 text-xs text-[#707887] leading-relaxed flex items-start gap-2.5">
            <HelpCircle size={15} className="text-[#98A0AE] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#344054]">💡 Hire Simple AI 팁:</span> 이력서를 빈 슬롯으로 두고 채널을 개설하면 공고 분석 결과 및 평가 템플릿 검증을 선행한 후, 대시보드 내에서 개별 혹은 배치로 지원자 이력서를 자유롭게 업로드하여 검사할 수도 있습니다.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
