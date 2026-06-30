/**
 * 이 파일은 공고문을 기반으로 한 평가 기준 생성(Criteria) API를 처리합니다.
 * 백엔드(FastAPI)가 아직 없는 경우를 위해 Mock 데이터 형태로 먼저 동작하며, 
 * VITE_API_BASE_URL 환경 변수가 잡히는 즉시 실제 백엔드 API와 연결됩니다.
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

export interface DetailCriterion {
  id: number;
  detail: string;
  weight: number;
}

export interface TypeCriterion {
  id: number;
  criterion_type: string;
  description?: string;
  type_weight: number;
  detail_criteria: DetailCriterion[];
}

export interface CriteriaResponse {
  type_criteria: TypeCriterion[];
}

/**
 * 3. 평가 기준 생성 (POST /job-posting/{job_posting_id}/criteria)
 */
export async function createEvaluationCriteria(jobPostingId: number): Promise<CriteriaResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-posting/${jobPostingId}/criteria`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`criteria_${jobPostingId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다.");
  }

  // Mock 동작
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const mockResult: CriteriaResponse = {
    type_criteria: [
      {
        id: 1,
        criterion_type: "자격 조건",
        description: "필수 자격 및 근무 요건 충족 여부를 평가합니다.",
        type_weight: 30,
        detail_criteria: [
          {
            id: 1,
            detail: "백엔드 개발 경험 2년 이상 적합성 검증",
            weight: 100
          }
        ]
      },
      {
        id: 2,
        criterion_type: "주요 업무 및 기술",
        description: "REST API 설계 및 DB 개발 역량을 종합 평가합니다.",
        type_weight: 40,
        detail_criteria: [
          {
            id: 2,
            detail: "Java, Spring Boot 프레임워크 이해도 및 실무 역량",
            weight: 50
          },
          {
            id: 3,
            detail: "MySQL 데이터베이스 설계 및 스키마 최적화 구축 경험",
            weight: 50
          }
        ]
      },
      {
        id: 3,
        criterion_type: "우대 사항",
        description: "AWS 배포 경험 및 추가 시너지 요소를 평정합니다.",
        type_weight: 30,
        detail_criteria: [
          {
            id: 4,
            detail: "AWS 등 클라우드 플랫폼 빌드 및 배포 경험",
            weight: 100
          }
        ]
      }
    ]
  };

  saveToLocalStorage(`criteria_${jobPostingId}`, mockResult);
  return mockResult;
}

/**
 * 3.1. 평가 기준 조회 (GET /job-posting/{job_posting_id}/criteria)
 */
export async function getEvaluationCriteria(jobPostingId: number): Promise<CriteriaResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/job-posting/${jobPostingId}/criteria`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`criteria_${jobPostingId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다.");
  }

  // 로컬 로딩
  try {
    const local = localStorage.getItem(`criteria_${jobPostingId}`);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    // ignore
  }

  // 기본 반환값 (mockCriteriaList)
  const defaultCriteria: CriteriaResponse = {
    type_criteria: [
      {
        id: 1,
        criterion_type: "주요 업무",
        description: "공고문 내 주요업무 비중이 가장 높아 핵심 역량으로 가장 높은 가중치 설정",
        type_weight: 45,
        detail_criteria: [
          { id: 1, detail: "서버 개발 경험 및 구현 능력", weight: 15 },
          { id: 2, detail: "API 설계 및 개발 능력 (RESTful API)", weight: 15 },
          { id: 3, detail: "데이터베이스 설계 및 쿼리 최적화 능력", weight: 15 }
        ]
      },
      {
        id: 2,
        criterion_type: "자격 조건",
        description: "필수 기술 스택 숙련도를 평가하여 직무 수행 가능성 판단",
        type_weight: 30,
        detail_criteria: [
          { id: 4, detail: "Java 활용 능력", weight: 10 },
          { id: 5, detail: "Spring Boot 활용 능력", weight: 10 },
          { id: 6, detail: "관계형 DB 활용 능력 (MySQL, PostgreSQL)", weight: 10 }
        ]
      },
      {
        id: 3,
        criterion_type: "우대 사항",
        description: "우대사항 충족 시 조직 적합도 향상 및 추가 기여 가능성 고려",
        type_weight: 10,
        detail_criteria: [
          { id: 7, detail: "AWS 등 클라우드 서비스 경험", weight: 4 },
          { id: 8, detail: "Docker, Redis 등 인프라 활용 경험", weight: 3 },
          { id: 9, detail: "테스트 코드 작성 경험", weight: 3 }
        ]
      }
    ]
  };

  saveToLocalStorage(`criteria_${jobPostingId}`, defaultCriteria);
  return defaultCriteria;
}

/**
 * 3.1.5. 평가 기준 전체 저장 (PUT /job-posting/{job_posting_id}/criteria)
 * draft 상태의 type_criteria 전체를 보내 기존 항목을 덮어씁니다.
 */
export async function saveCriteria(
  jobPostingId: number,
  typeCriteria: TypeCriterion[]
): Promise<CriteriaResponse> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/job-posting/${jobPostingId}/criteria`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type_criteria: typeCriteria }),
  });

  if (!response.ok) {
    let message = "평가 기준 저장 중 오류가 발생했습니다.";
    try {
      const errorJson = await response.json();
      message = errorJson.detail || message;
    } catch (e) {
      // ignore
    }
    throw new Error(message);
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error("평가 기준 저장 응답이 올바르지 않습니다.");
  }

  saveToLocalStorage(`criteria_${jobPostingId}`, json.data);
  return json.data;
}

/**
 * 3.2. 대분류 수정 (PATCH /criteria/types/{type_criteria_id})
 */
export async function updateTypeCriterion(typeCriteriaId: number, data: Partial<TypeCriterion>): Promise<any> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/criteria/types/${typeCriteriaId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, 로컬 동작 처리합니다.");
  }

  return { success: true, updated_id: typeCriteriaId };
}

/**
 * 3.3. 소분류 수정 (PATCH /criteria/details/{detail_criteria_id})
 */
export async function updateDetailCriterion(detailCriteriaId: number, data: Partial<DetailCriterion>): Promise<any> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/criteria/details/${detailCriteriaId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, 로컬 동작 처리합니다.");
  }

  return { success: true, updated_id: detailCriteriaId };
}