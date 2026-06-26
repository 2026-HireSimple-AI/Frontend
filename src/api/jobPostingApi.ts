/**
 * 이 파일은 채용공고(Job Posting) 등록 및 AI 구조화 분석 API를 처리합니다.
 * 백엔드가 URL을 받아 스크랩핑 + 포메팅을 한 번에 처리하므로, 프론트도 단일 호출로 맞춥니다.
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

export interface FormattedPostingItem {
  category: string;
  content: string;
}

export interface JobPostingResult {
  job_posting_id: number;
  title: string;
  input_type: string;
  source_url: string;
  formatted_posting: FormattedPostingItem[];
  skills_stack: string[];
}

/**
 * 채용공고 등록 + 구조화 (POST /job-posting/upload)
 * 백엔드가 스크랩핑과 포메팅을 한 번에 처리하여 결과를 반환합니다.
 */
export async function createJobPosting(sourceUrl: string): Promise<JobPostingResult> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-posting/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: sourceUrl
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`job_posting_${json.data.job_posting_id}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다:", error);
  }

  // 백엔드가 없거나 오류 시 Mock 동작
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockId = Math.floor(Math.random() * 900000) + 100000;
  const mockResult: JobPostingResult = {
    job_posting_id: mockId,
    title: "새로운 백엔드 개발자 채용",
    input_type: "url",
    source_url: sourceUrl,
    formatted_posting: [
      {
        category: "자격 요건",
        content: "백엔드 개발 경험 2년 이상",
      },
      {
        category: "주요 업무",
        content: "REST API 개발 및 운영",
      },
      {
        category: "우대 사항",
        content: "AWS 배포 경험 및 클라우드 아키텍처 이해",
      }
    ],
    skills_stack: [
      "Java",
      "Spring Boot",
      "MySQL",
      "AWS"
    ]
  };

  saveToLocalStorage(`job_posting_${mockId}`, mockResult);
  return mockResult;
}

/**
 * 채용공고 상세 조회 (GET /job-posting/{job_posting_id})
 */
export async function getJobPosting(jobPostingId: number): Promise<JobPostingResult> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-posting/${jobPostingId}`, {
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

  const localVal = getFromLocalStorage(`job_posting_${jobPostingId}`);
  if (localVal) {
    return localVal;
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    job_posting_id: jobPostingId,
    title: "공고문 1",
    input_type: "url",
    source_url: "https://example.com/careers/senior-backend",
    formatted_posting: [],
    skills_stack: []
  };
}

export async function updateJobPostingTitle(
  jobPostingId: number,
  title: string
) {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/job-posting/${jobPostingId}/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("공고 제목 수정 실패");
  }

  return await response.json();
}