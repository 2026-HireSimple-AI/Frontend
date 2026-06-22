/**
 * 이 파일은 분석 관리(History / Dashboard) 페이지인 ManageAnalysisPage 컴포넌트입니다.
 * - 사용자가 전적에 등록하고 구조 수행한 채용공고 목록을 그리드 카드 형태로 조감할 수 있습니다.
 * - '분석 관리' 메뉴는 로그인한 사용자만 접근을 보장하며, 비인증 시 로그인 페이지로 안전하게 전이시킵니다.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { 
  Layers, 
  Plus, 
  Trash2, 
  ChevronRight, 
  FileCheck, 
  Users, 
  Calendar,
  Layers2
} from "lucide-react";

interface JobHistory {
  id: number;
  title: string;
  source_url: string;
  created_at: string;
  applicants_count: number;
  average_score: number;
}

export default function ManageAnalysisPage() {
  const navigate = useNavigate();

  // 사용자 로그인 및 세션 확인
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [histories, setHistories] = useState<JobHistory[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (!savedUser) {
      // 미인증 시 리다이렉트 (안전 가이드라인 대응)
      navigate("/login?redirect=/analysis/manage");
      return;
    }

    setIsLoggedIn(true);
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // 저장 기록 복합 연동 또는 Mock 데이터 생성
    const mockList: JobHistory[] = [
      {
        id: 104291,
        title: "2026 하반기 백엔드 시니어 개발자 채용",
        source_url: "https://example.com/careers/senior-backend",
        created_at: "2026-06-21",
        applicants_count: 5,
        average_score: 80.8
      },
      {
        id: 593810,
        title: "쿠버네티스 인프라 아키텍트 영입 공고",
        source_url: "https://example.com/jobs/devops",
        created_at: "2026-06-18",
        applicants_count: 3,
        average_score: 74.2
      }
    ];

    // 만약 방금 생성했던 Job Posting이 있다면 리스트 상부에 적층하기
    const keys = Object.keys(localStorage);
    const customJobs: JobHistory[] = [];
    keys.forEach((key) => {
      if (key.startsWith("job_posting_")) {
        const itemObj = JSON.parse(localStorage.getItem(key)!);
        // 이미 mockList에 존재하는 ID와 중복 방지
        if (!mockList.some((m) => m.id === itemObj.job_posting_id)) {
          customJobs.push({
            id: itemObj.job_posting_id,
            title: itemObj.title,
            source_url: itemObj.source_url,
            created_at: "2026-06-20",
            applicants_count: 4,
            average_score: 80.7
          });
        }
      }
    });

    setHistories([...customJobs, ...mockList]);
  }, [navigate]);

  // 기록 카드 삭제 처리
  const handleDeleteHistory = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("이 채용 분석 기록을 영구히 데이터 베이스에서 소거할까요? 보정 평가 기준표 및 검수 질문지도 함께 삭제됩니다.")) {
      setHistories(histories.filter((h) => h.id !== id));
      localStorage.removeItem(`job_posting_${id}`);
      localStorage.removeItem(`criteria_${id}`);
    }
  };

  // 상세 페이지(Step 3. 지원자리스트) 이동
  const handleItemClick = (id: number) => {
    navigate(`/analysis/${id}/applicants`);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  return (
    <AppLayout 
      activeMenu="manage" 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={handleLogout}
      currentStep={1} // 헤더 상태 1 단계
    >
      <div className="flex flex-col gap-8 pb-16 select-none font-sans">
        
        {/* 상단 타스크바 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E6EAF0] pb-6">
          <div>
            <span className="text-xs font-semibold text-[#6D5DFC] uppercase tracking-wide">Analysis History Dashboard</span>
            <h2 className="text-2xl font-bold text-[#1C1F26] mt-1">분석 히스토리 관리</h2>
            <p className="text-xs text-[#707887] mt-1">채용 담당자님이 등록하신 모든 분석 프로젝트를 조감하고, 지원자 데이터 결과 및 최종 검증 질문지를 실시간 연람하세요.</p>
          </div>

          <button
            onClick={() => navigate("/analysis/new")}
            className="px-4 h-[44px] bg-[#00194B] hover:bg-[#002D80] text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow"
          >
            <Plus size={14} className="text-white" />
            <span>새로운 공고 분석 생성</span>
          </button>
        </div>

        {/* 바디 그리드 카드 리스트 */}
        {histories.length === 0 ? (
          <div className="bg-white border border-[#E6EAF0] rounded-2xl p-16 text-center select-none flex flex-col items-center justify-center gap-3">
            <Layers2 size={48} className="text-[#98A0AE]" />
            <div>
              <p className="text-base font-semibold text-[#1C1F26]">등록된 채용 분석 내역이 없습니다.</p>
              <p className="text-xs text-[#707887] mt-1">첫 번째 채용 분석 프로젝트를 즉시 개설하여 AI 맞춤형 면접 구상을 연동해 보세요.</p>
            </div>
            <button 
              onClick={() => navigate("/analysis/new")} 
              className="mt-2 px-4 py-2 bg-[#00194B] hover:bg-[#002D80] text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              분석 세션 개시
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {histories.map((job) => (
              <div 
                key={job.id} 
                onClick={() => handleItemClick(job.id)}
                className="bg-white border border-[#E6EAF0] p-6 rounded-2xl flex flex-col justify-between gap-5 hover:border-[#00194B]/40 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                {/* 상단 파트 정보 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] text-[#707887] font-mono" 
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      ID: {job.id}
                    </span>
                    <button
                      onClick={(e) => handleDeleteHistory(e, job.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-[#EF4444] rounded-lg cursor-pointer"
                      title="지우기"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h3 className="text-[17px] font-bold text-[#1C1F26] leading-snug line-clamp-1">{job.title}</h3>
                  <p className="text-xs text-[#707887] truncate" title={job.source_url}>{job.source_url}</p>
                </div>

                {/* 하단 요약 지표 */}
                <div className="flex items-center justify-between border-t border-[#E6EAF0] pt-4 select-none">
                  <div className="flex gap-4">
                    {/* 지원자 통계 */}
                    <div className="flex items-center gap-1.5 text-xs text-[#475467]">
                      <Users size={14} className="text-[#98A0AE]" />
                      <span className="font-semibold font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>{job.applicants_count}명 지원</span>
                    </div>

                    {/* 평균 역량 적합도 점수 */}
                    <div className="flex items-center gap-1.5 text-xs text-[#475467]">
                      <FileCheck size={14} className="text-[#22C55E]" />
                      <span className="font-bold text-[#00194B] font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>평균 {job.average_score.toFixed(1)}점</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#707887]">
                    <span className="font-semibold">자세히</span>
                    <ChevronRight size={14} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
