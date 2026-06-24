/**
 * 이 파일은 STEP 2. Evaluation Criteria Review(평가 기준 검증) 화면입니다.
 * - 사용자는 공고를 검증 및 보정하고, 가중치를 슬라이더/표 형태로 파악 및 조절할 수 있습니다.
 * - 새로운 이력서를 추가 업로드할 수 있으며, 최종적으로 '분석 진행하기'를 눌러 STEP 3으로 안전하게 이동합니다.
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import WorkflowHeader from "../components/workflow/WorkflowHeader";
import PageTitleSection from "../components/criteria/PageTitleSection";
import CriteriaProcessHoverTrigger from "../components/criteria/CriteriaProcessHoverTrigger";
import JobPostingSummaryCard from "../components/criteria/JobPostingSummaryCard";
import JobPostingAnalysisResultCard from "../components/criteria/JobPostingAnalysisResultCard";
import ResumeUploadStatusCard from "../components/criteria/ResumeUploadStatusCard";
import CriteriaWeightTable, { TypeCriterion, DetailCriterion } from "../components/criteria/CriteriaWeightTable";
import CriteriaDonutChart from "../components/criteria/CriteriaDonutChart";
import CriteriaEditModal from "../components/criteria/CriteriaEditModal";
import BottomNotice from "../components/criteria/BottomNotice";
import NextStepButton from "../components/criteria/NextStepButton";

import { getJobPosting, formatJobPosting } from "../api/jobPostingApi";
import { getEvaluationCriteria, createEvaluationCriteria, updateTypeCriterion, updateDetailCriterion } from "../api/criteriaApi";
import { uploadResumes } from "../api/resumeApi";

import { Sliders, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
// @ts-ignore
import styles from "../styles/CriteriaReviewPage.module.css";

interface FormattedPosting {
  category: string;
  content: string;
}

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  status: string;
}

export default function CriteriaReviewPage() {
  const { jobPostingId } = useParams<{ jobPostingId: string }>();
  const navigate = useNavigate();
  const parsedJobId = jobPostingId ? Number(jobPostingId) : 1;

  // 1. 공통 세션 및 라우트 정보 가드
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 2. 핵심 비즈니스 상태
  const [jobPostingTitle, setJobPostingTitle] = useState("공고문 1");
  const [formattedPostings, setFormattedPostings] = useState<FormattedPosting[]>([]);
  const [criteriaList, setCriteriaList] = useState<TypeCriterion[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // 3. 로딩 & 에러 플래그 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);

  // 에러 노출
  const [postingError, setPostingError] = useState<string | null>(null);
  const [criteriaError, setCriteriaError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // 4. 모달 제어
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 초기 유저 정보와 데이터 로딩
  useEffect(() => {
    // 1-1. 사용자 로그인 검사
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      setPostingError(null);
      setCriteriaError(null);

      try {
        // 공고 데이터 로딩
        const posting = await getJobPosting(parsedJobId);
        setJobPostingTitle(posting.title || "공고문 1");

        // 로컬 임시 포맷팅 데이터 로딩 또는 기본값 세팅
        const cachedFormat = localStorage.getItem(`formatted_${parsedJobId}`);
        if (cachedFormat) {
          const parsed = JSON.parse(cachedFormat);
          // 실제 key가 formatted_postings 임
          setFormattedPostings(
            parsed.formatted_postings?.map((f: any) => ({
              category: f.category,
              content: f.content
            })) || []
          );
        } else {
          // 기본 mockFormattedPostings
          const defaultFormatted = [
            {
              category: "자격 조건",
              content: "백엔드 개발 3년 이상, Java / Spring Boot 사용 경험, 관계형 DB(MySQL, PostgreSQL) 사용 경험"
            },
            {
              category: "주요 업무",
              content: "서버 개발 및 유지보수, RESTful API 설계 및 개발, 데이터베이스 설계 및 최적화"
            },
            {
              category: "우대 사항",
              content: "AWS 등 클라우드 서비스 경험, 대용량 서비스 개발 경험, 테스트 코드 작성 경험"
            }
          ];
          setFormattedPostings(defaultFormatted);
          localStorage.setItem(`formatted_${parsedJobId}`, JSON.stringify({ formatted_postings: defaultFormatted }));
        }

        // 평가 기준 데이터 로딩
        const fetchedCriteria = await getEvaluationCriteria(parsedJobId);
        setCriteriaList(fetchedCriteria.type_criteria || []);

        // 업로드 파일 데이터 기원 로딩
        const cachedResumes = localStorage.getItem(`uploaded_resumes_${parsedJobId}`);
        if (cachedResumes) {
          const parsedRes = JSON.parse(cachedResumes);
          const mapped = parsedRes.files?.map((f: any) => ({
            id: f.resume_file_id || Math.floor(Math.random() * 9000),
            name: f.original_filename,
            size: "1.1 MB",
            status: f.processing_status === "uploaded" ? "마스킹 완료" : "처리 중"
          })) || [];
          setUploadedFiles(mapped);
        } else {
          // 이력서 없음의 경우 디폴트로 빈 상태 지정하여 아무 파일도 없도록 보정
          setUploadedFiles([]);
        }

      } catch (err: any) {
        setPostingError("채용 공고 또는 기존 평가 조건을 로드하는 데 실패하였습니다.");
        setCriteriaError("평가 세부 기준을 로드하지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [parsedJobId]);

  // 이력서 파일이 업로드되면 이력서 부족 경고를 자동으로 해제함
  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      setWarningMessage(null);
    }
  }, [uploadedFiles]);

  // 공고 타이틀 조율 수정
  const handleEditJobPosting = (newTitle: string) => {
    setJobPostingTitle(newTitle);
    // 로컬 스토리지 데이터 동기화
    const targetJob = localStorage.getItem(`job_posting_${parsedJobId}`);
    if (targetJob) {
      const parsed = JSON.parse(targetJob);
      parsed.title = newTitle;
      localStorage.setItem(`job_posting_${parsedJobId}`, JSON.stringify(parsed));
    } else {
      localStorage.setItem(`job_posting_${parsedJobId}`, JSON.stringify({
        job_posting_id: parsedJobId,
        title: newTitle,
        input_type: "url",
        source_url: ""
      }));
    }
  };

  // 다시 추출하기 기능 수행
  const handleRetryExtract = async () => {
    setIsRefreshing(true);
    setExtractError(null);

    try {
      // 1. 공고 구조화 수행 API 수신
      const formatRes = await formatJobPosting(parsedJobId);
      // "자격 요건" 등의 카테고리 매핑 보정
      const mappedFormat = formatRes.formatted_postings?.map(item => ({
        category: item.category === "자격 요건" ? "자격 조건" : item.category,
        content: item.content
      })) || [];
      setFormattedPostings(mappedFormat);

      // 2. 평가 기준 생성 API 수신
      const criteriaRes = await createEvaluationCriteria(parsedJobId);
      setCriteriaList(criteriaRes.type_criteria || []);

      // 로컬 스토리지에 결과 강제 보정 저장 시켜서 다음 단계에서도 유지 가능하도록 함
      localStorage.setItem(`formatted_${parsedJobId}`, JSON.stringify(formatRes));
      localStorage.setItem(`criteria_${parsedJobId}`, JSON.stringify(criteriaRes));

    } catch (err: any) {
      setExtractError("AI 역량 다시 추출 시도가 실패했습니다. 원격 서버 응답을 확인하세요.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 다중 이력서 업로드 수행
  const handleUploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    // 가상 이력서 목록에 "업로드 중" 상태로 먼저 표시
    const pendingFiles: UploadedFile[] = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      status: "업로드 중"
    }));

    setUploadedFiles(prev => [...prev, ...pendingFiles]);

    try {
      const res = await uploadResumes(parsedJobId, files);
      
      // 실제 리턴된 정보로 패치 업데이트
      const completedFiles: UploadedFile[] = res.files.map((file, index) => ({
        id: file.resume_file_id || (Date.now() + index),
        name: file.original_filename,
        size: "1.3 MB",
        status: "마스킹 완료"
      }));

      // 가상 등록된 '업로드 중' 파일을 지우고 실제 완료 파일들을 추가
      setUploadedFiles(prev => {
        const filtered = prev.filter(f => f.status !== "업로드 중");
        const nextList = [...filtered, ...completedFiles];
        
        // 로컬 업데이트
        const updatedResponse = {
          uploaded_count: nextList.length,
          files: nextList.map(f => ({
            resume_file_id: f.id,
            applicant_id: f.id + 100,
            original_filename: f.name,
            processing_status: f.status === "마스킹 완료" ? "uploaded" : "processing"
          }))
        };
        localStorage.setItem(`uploaded_resumes_${parsedJobId}`, JSON.stringify(updatedResponse));
        
        return nextList;
      });

    } catch (err) {
      setUploadError("이력서 업로드 분석 실행 과정에서 통신 장해가 발발했습니다.");
      // 실패 시 업로드 상태 지우기
      setUploadedFiles(prev => prev.filter(f => f.status !== "업로드 중"));
    } finally {
      setIsUploading(false);
    }
  };

  // 업로드 파일 개별 소거 지우기
  const handleDeleteUploadedFile = (id: number) => {
    const nextList = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(nextList);

    const updatedResponse = {
      uploaded_count: nextList.length,
      files: nextList.map(f => ({
        resume_file_id: f.id,
        applicant_id: f.id + 100,
        original_filename: f.name,
        processing_status: f.status === "마스킹 완료" ? "uploaded" : "processing"
      }))
    };
    localStorage.setItem(`uploaded_resumes_${parsedJobId}`, JSON.stringify(updatedResponse));
  };

  // 모달 에디터로부터 정밀 저장 요청 수신
  const handleSaveCriteria = async (updatedList: TypeCriterion[]) => {
    try {
      // 1. 상태 업데이트
      setCriteriaList(updatedList);
      setIsEditModalOpen(false);

      // 2. 전체 백그라운드 스토리지 업데이트
      localStorage.setItem(`criteria_${parsedJobId}`, JSON.stringify({ type_criteria: updatedList }));

      // 3. 개 개별 가중치 PATCH 전송 (실제 서버 동기화, 실패해도 로컬은 유지)
      for (const item of updatedList) {
        await updateTypeCriterion(item.id, { 
          criterion_type: item.criterion_type, 
          type_weight: item.type_weight 
        });
        for (const det of item.detail_criteria) {
          await updateDetailCriterion(det.id, {
            detail: det.detail,
            weight: det.weight
          });
        }
      }

    } catch (e) {
      console.warn("일부 패치 API 동기화가 이루어지지 못했으나, 조율된 데이터는 안전하게 로컬에 백업 보존됩니다.");
    }
  };

  // 다음 STEP 3. 지원자 분석 결과 화면 이동
  const handleGoNext = () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      setWarningMessage("분석할 이력서를 업로드해주세요.");
      return;
    }
    setWarningMessage(null);
    setIsNextLoading(true);
    setTimeout(() => {
      setIsNextLoading(false);
      navigate(`/analysis/${parsedJobId}/applicants`);
    }, 900);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  return (
    <AppLayout 
      activeMenu="new" 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={handleLogout}
      currentStep={1} // STEP 2. Evaluation Criteria Review 단계 정보
    >
      <div className={styles.page}>
        
        {/* 상부 헤더 영역 */}
        <div className={styles.headerArea}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#6D5DFC] uppercase tracking-widest block">STEP 02</span>
            <PageTitleSection 
              title="평가 기준 검증" 
              description="공고문을 분석하여 추출한 평가 기준입니다. 내용이 올바른지 확인해 주세요." 
            />
          </div>

          {/* delayed 호버 툴팁 */}
          <CriteriaProcessHoverTrigger delayMs={2000} />
        </div>

        {/* 첫 번째 로딩 화면 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white border border-[#E6EAF0] rounded-2xl p-10 min-h-[300px]">
            <div className="w-10 h-10 border-4 border-[#00194B] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#707887] font-medium animate-pulse">
              AI 핵심 역량 분류 및 평가 지중 지표를 생성하는 중입니다. 잠시만 대기해 주십시오...
            </p>
          </div>
        ) : (
          <>
            {/* 공고 명칭 요약 카드 (상단 가로 전체 너비) */}
            {postingError ? (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-[#EF4444] font-medium">
                <AlertCircle size={15} />
                <span>{postingError}</span>
              </div>
            ) : (
              <JobPostingSummaryCard 
                jobPostingTitle={jobPostingTitle} 
                onEditJobPosting={handleEditJobPosting}
              />
            )}

            {/* 상부 2열 격자 배치 그리드 */}
            <div className={styles.topGrid}>
              
              {/* 왼쪽 열: 공고 분석 결과 */}
              <div className={styles.leftColumn}>
                
                {/* 공고 분석 결과 리스트 */}
                <JobPostingAnalysisResultCard 
                  formattedPostings={formattedPostings}
                  isRefreshing={isRefreshing}
                  onRetryExtract={handleRetryExtract}
                  errorMessage={extractError}
                />

              </div>

              {/* 오른쪽 열: 이력서 업로드 모니터 카드 */}
              <div className="h-full">
                <ResumeUploadStatusCard 
                  uploadedFiles={uploadedFiles}
                  onUploadFiles={handleUploadFiles}
                  onDeleteFile={handleDeleteUploadedFile}
                  isUploading={isUploading}
                  uploadStatusMessage={uploadError}
                />
              </div>

            </div>

            {/* 하단 단락: 평가 기준 및 가중치 조감 구역 */}
            {criteriaError ? (
              <div className="flex items-center gap-2 p-5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#EF4444] font-medium">
                <AlertCircle size={15} />
                <span>{criteriaError}</span>
              </div>
            ) : (
              <div className={styles.criteriaWeightCard}>
                
                {/* 섹션 안내 타이틀 */}
                <div className="flex flex-col gap-1 border-b border-[#F6F8FC] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 bg-[#00194B] rounded-lg text-white font-bold text-[9px] flex items-center justify-center font-mono">⚖</span>
                    <h3 className="text-sm font-extrabold text-[#1C1F26]">평가 기준 및 가중치 (총 100%)</h3>
                  </div>
                  <p className="text-[11px] text-[#707887] font-medium">
                    공고문의 주요업무와 요구사항을 바탕으로 역량을 추출하고 가중치를 설정했습니다.
                  </p>
                </div>

                {/* 실제 조감 테이블과 파이 도넛 차트 나란히 배치 */}
                {isRefreshing ? (
                  // 다시 추출하는 동안 보여주는 스켈레톤 평가 기준 UI
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-4 animate-pulse">
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-[#E2E8F0] rounded w-1/4" />
                        <div className="border border-[#E6EAF0] rounded-xl p-4 space-y-3">
                          {[1, 2, 3].map((v) => (
                            <div key={v} className="flex justify-between items-center py-2 border-b border-[#F6F8FC] last:border-0">
                              <div className="h-3 bg-[#E2E8F0] rounded w-1/3" />
                              <div className="h-3 bg-[#E2E8F0] rounded w-16" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-10 bg-[#E2E8F0] rounded-xl w-28" />
                    </div>
                    <div className="lg:col-span-5 flex flex-col items-center justify-center py-8">
                      <div className="w-36 h-36 rounded-full border-8 border-t-[#00194B] border-[#E2E8F0] animate-spin flex items-center justify-center">
                        <span className="text-[10px] text-[#707887] font-bold animate-pulse">추출 중</span>
                      </div>
                    </div>
                  </div>
                ) : criteriaList.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#E6EAF0] rounded-xl text-xs text-[#98A0AE] bg-[#F6F8FC]/40">
                    평가 기준이 아직 생성되지 않았습니다. 다시 추출하기를 눌러 평가 기준을 생성해 주세요.
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    
                    {/* 테이블 (지표 목록) */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      <CriteriaWeightTable criteriaList={criteriaList} />
                      
                      {/* 수정하기 팝업 트리거 버튼 */}
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className={styles.editButton}
                      >
                        <Sliders size={13} />
                        <span>수정하기</span>
                      </button>
                    </div>

                    {/* 도넛 디스플레이 차트 */}
                    <div className="lg:col-span-5">
                      <CriteriaDonutChart criteriaList={criteriaList} />
                    </div>

                  </motion.div>
                )}

              </div>
            )}

            {/* 최하단 확인 알림 및 다음 단계 전이 버튼 액션바 */}
            <div className={styles.bottomActionArea}>
              {/* 왼쪽 알림 문구 */}
              <BottomNotice />

              <div className="relative flex flex-col items-end gap-2 text-right">
                {warningMessage && (
                  <div className="absolute bottom-[calc(100%+8px)] right-0 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[11px] font-bold shadow-md animate-pulse w-max whitespace-nowrap">
                    <AlertCircle size={13} className="flex-shrink-0" />
                    <span>{warningMessage}</span>
                  </div>
                )}
                {/* 오른쪽 다음 단계 액션 */}
                <NextStepButton 
                  onClick={handleGoNext}
                  isLoading={isNextLoading}
                  isDisabled={criteriaList.length === 0}
                />
              </div>
            </div>
            
          </>
        )}

        {/* 팝업 수정 모달 */}
        <CriteriaEditModal 
          isOpen={isEditModalOpen}
          criteriaList={criteriaList}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCriteria}
        />

      </div>
    </AppLayout>
  );
}
