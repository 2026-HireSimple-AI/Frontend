/**
 * 이 파일은 채용공고(Job Posting) 등록 및 AI 구조화 분석 API를 처리합니다.
 * 백엔드(FastAPI)가 아직 없는 경우를 위해 Mock 데이터 형태로 먼저 동작하며, 
 * VITE_API_BASE_URL 환경 변수가 잡히는 즉시 실제 백엔드 API와 연결됩니다.
 */

const getApiBaseUrl = (): string => {
  return ((import.meta as any).env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
};

// 로컬 스토리지에 데이터를 임시 기억하여 이전 작성 단계를 모방합니다.
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage 저장 실패:', e);
  }
};

const getFromLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export interface JobPostingData {
  job_posting_id: number;
  title: string;
  input_type: string;
  source_url: string;
}

export interface FormattedPostingItem {
  category: string;
  content: string;
  is_required: boolean;
}

export interface FormattedPostingResponse {
  job_posting_id: number;
  formatted_postings: FormattedPostingItem[];
  skills_stack: string[];
}

/**
 * 1. 채용공고 등록 (POST /job-postings)
 */
export async function createJobPosting(sourceUrl: string, title?: string): Promise<JobPostingData> {
  const baseUrl = getApiBaseUrl();
  const calculatedTitle = title || "새로운 백엔드 개발자 채용";

  try {
    // 실제 API 전송 시도
    const response = await fetch(`${baseUrl}/job-postings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: calculatedTitle,
        input_type: "url",
        source_url: sourceUrl,
        raw_content: `${calculatedTitle} 공고문 연동 결과: 우수한 MSA 백엔드 개발자를 모집합니다.`
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        // 성공 시 로컬 세션에도 임시 저장
        saveToLocalStorage(`job_posting_${json.data.job_posting_id}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다:", error);
  }

  // 백엔드가 없거나 오류 시 Mock 동작
  await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8초 딜레이로 로딩 체감

  // 랜덤한 임시 ID 생성
  const mockId = Math.floor(Math.random() * 900000) + 100000;
  const mockResult: JobPostingData = {
    job_posting_id: mockId,
    title: calculatedTitle,
    input_type: "url",
    source_url: sourceUrl,
  };

  saveToLocalStorage(`job_posting_${mockId}`, mockResult);
  return mockResult;
}

/**
 * 1.5. 채용공고 상세 조회 (GET /job-postings/{job_posting_id})
 */
export async function getJobPosting(jobPostingId: number): Promise<JobPostingData> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-postings/${jobPostingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`job_posting_${jobPostingId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다:", error);
  }

  // 로컬 세션 확인 및 fallback
  const localVal = getFromLocalStorage(`job_posting_${jobPostingId}`);
  if (localVal) {
    return localVal;
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    job_posting_id: jobPostingId,
    title: "공고문 1",
    input_type: "url",
    source_url: "https://example.com/careers/senior-backend"
  };
}

/**
 * 2. 공고 구조화 실행 (POST /job-postings/{job_posting_id}/format)
 */
export async function formatJobPosting(jobPostingId: number): Promise<FormattedPostingResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-postings/${jobPostingId}/format`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`formatted_${jobPostingId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다.");
  }

  // Mock 동작
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResult: FormattedPostingResponse = {
    job_posting_id: jobPostingId,
    formatted_postings: [
      {
        category: "자격 요건",
        content: "백엔드 개발 경험 2년 이상",
        is_required: true
      },
      {
        category: "기술 스택",
        content: "Java, Spring Boot, MySQL",
        is_required: true
      },
      {
        category: "주요 업무",
        content: "REST API 개발 및 운영",
        is_required: false
      },
      {
        category: "우대 사항",
        content: "AWS 배포 경험 및 클라우드 아키텍처 이해",
        is_required: false
      }
    ],
    skills_stack: [
      "Java",
      "Spring Boot",
      "MySQL",
      "AWS"
    ]
  };

  saveToLocalStorage(`formatted_${jobPostingId}`, mockResult);
  return mockResult;
}
