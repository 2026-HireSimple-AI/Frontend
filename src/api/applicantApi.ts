/**
 * 이 파일은 지원자 이력서 적합도 분석(Applicant Analysis) API를 처리합니다.
 * 백엔드(FastAPI)가 아직 활성화되지 않은 경우에도 정상 동작하도록 Mock 데이터를 내포하며,
 * VITE_API_BASE_URL 환경 변수가 있는 경우 실제 백엔드 API와 바인딩되도록 합니다.
 */

const getApiBaseUrl = (): string => {
  return ((import.meta as any).env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
};

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage 저장 실패:', e);
  }
};

export interface ApplicantSummary {
  id: number;
  masked_code: string;
  real_name?: string;     
  career: string;
  total_score: number;
  requirement_score?: number;
  skill_score?: number;
  task_score?: number;
  preference_score?: number;
}

export interface ResumeSummary {
  career_summary: string;
  project_summary: string;
  skill_summary: string;
}

export interface DetailScoreItem {
  criterion_type: string;
  type_weight: number;
  detail: string;
  score: number;
  weight: number;
  weighted_score: number;
}

export interface ApplicantDetail {
  id: number;
  masked_code: string;
  real_name?: string;     
  fitLabel: string;
  score: {
    total_score: number;
    requirement_score: number;
    skill_score: number;
    task_score: number;
    preference_score: number;
  };
  resume_summary: ResumeSummary;
  matched_skills: string[];
  detail_scores: DetailScoreItem[];
  career?: string;
}

export interface AnalysisInfo {
  requirementWeight: number;
  taskWeight: number;
  preferenceWeight: number;
  skillEvaluationMethod: string;
}

// 20명 보기를 풍성하게 지원하기 위해 자동으로 20명까지 확장 생성된 리스트 제공
export const mockSummaryList: ApplicantSummary[] = [
  // ...baseSummaryList,
  ...Array.from({ length: 15 }, (_, i) => {
    const id = i + 6;
    const scoreOffset = ((i + 1) * 2.1) % 18;
    const careerYears = 1 + ((i + 3) % 9);
    const total_score = parseFloat((75.0 - scoreOffset).toFixed(1));
    return {
      id,
      masked_code: `APPLICANT_${String(id).padStart(3, "0")}`,
      career: `경력 ${careerYears}년`,
      total_score,
      requirement_score: Math.max(50, Math.min(100, Math.round(total_score - 4 + (i % 8)))),
      skill_score: Math.max(50, Math.min(100, Math.round(total_score + 3 - (i % 6)))),
      task_score: Math.max(50, Math.min(100, Math.round(total_score - 1 + (i % 7)))),
      preference_score: Math.max(40, Math.min(100, Math.round(total_score - 12 + (i % 10))))
    };
  })
];

/**
 * 4. 지원자 요약 랭킹 목록 조회 (GET /job-postings/{job_posting_id}/applicants)
 */
export async function getApplicants(jobPostingId: number): Promise<ApplicantSummary[]> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-postings/${jobPostingId}/applicants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`applicants_${jobPostingId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("getApplicants 실제 API 통신 실패, Mock 활성화.");
  }

  // 로컬 우선 검증 (업로드 이력서와 연동)
  try {
    const cachedResumes = localStorage.getItem(`uploaded_resumes_${jobPostingId}`);
    if (cachedResumes) {
      const parsedRes = JSON.parse(cachedResumes);
      const files = parsedRes.files || [];
      if (files.length === 0) {
        saveToLocalStorage(`applicants_${jobPostingId}`, []);
        return [];
      }
      
      const mappedList: ApplicantSummary[] = files.map((f: any, index: number) => {
        const mockBase = mockSummaryList[index] || mockSummaryList[0];
        return {
          ...mockBase,
          id: f.applicant_id,
          masked_code: `APPLICANT_${String(index + 1).padStart(3, "0")}`
        };
      });
      saveToLocalStorage(`applicants_${jobPostingId}`, mappedList);
      return mappedList;
    }
  } catch (e) {
    // ignore
  }

  // 아무것도 받지 못했으면 리스트가 없어야 함
  saveToLocalStorage(`applicants_${jobPostingId}`, []);
  return [];
}

/**
 * 4.1. 개별 지원자 정밀분석 보고서 상세 (GET /applicants/{applicant_id})
 */
export async function getApplicantDetail(applicantId: number): Promise<ApplicantDetail> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/applicants/${applicantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`applicant_detail_${applicantId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("getApplicantDetail 실제 API 통신 오프라인.");
  }

  // 로컬 캐시 확인
  try {
    const local = localStorage.getItem(`applicant_detail_${applicantId}`);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}

  // API도 캐시도 없으면 에러
  throw new Error(`지원자 ${applicantId} 데이터를 불러올 수 없습니다.`);
}