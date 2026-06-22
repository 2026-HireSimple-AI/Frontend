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

// 기본 mock 지원자 리스트
const baseSummaryList: ApplicantSummary[] = [
  {
    id: 1,
    masked_code: "APPLICANT_001",
    career: "경력 4년",
    total_score: 88.6,
    requirement_score: 90,
    skill_score: 85,
    task_score: 92,
    preference_score: 70
  },
  {
    id: 2,
    masked_code: "APPLICANT_002",
    career: "경력 3년",
    total_score: 84.2,
    requirement_score: 80,
    skill_score: 85,
    task_score: 90,
    preference_score: 75
  },
  {
    id: 3,
    masked_code: "APPLICANT_003",
    career: "경력 5년",
    total_score: 82.1,
    requirement_score: 90,
    skill_score: 70,
    task_score: 85,
    preference_score: 70
  },
  {
    id: 4,
    masked_code: "APPLICANT_004",
    career: "경력 3년",
    total_score: 78.7,
    requirement_score: 80,
    skill_score: 75,
    task_score: 82,
    preference_score: 70
  },
  {
    id: 5,
    masked_code: "APPLICANT_005",
    career: "경력 6년",
    total_score: 76.4,
    requirement_score: 70,
    skill_score: 80,
    task_score: 78,
    preference_score: 70
  }
];

// 20명 보기를 풍성하게 지원하기 위해 자동으로 20명까지 확장 생성된 리스트 제공
export const mockSummaryList: ApplicantSummary[] = [
  ...baseSummaryList,
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

// 기본 mock 지원자 상세 사전
export const mockDetailsMap: Record<number, ApplicantDetail> = {
  1: {
    id: 1,
    masked_code: "APPLICANT_001",
    fitLabel: "의욕있게",
    score: {
      total_score: 88.6,
      requirement_score: 90,
      skill_score: 85,
      task_score: 92,
      preference_score: 70
    },
    resume_summary: {
      career_summary: "백엔드 개발 경력 4년으로 Spring Boot 기반 API 개발 경험이 있습니다.",
      project_summary: "RESTful API 설계, 데이터베이스 최적화, 클라우드 배포 경험이 확인됩니다.",
      skill_summary: "Java, Spring Boot, MySQL, Redis, Docker 활용 경험이 있습니다."
    },
    matched_skills: [
      "Python",
      "Java",
      "Spring Boot",
      "MySQL",
      "Redis",
      "AWS",
      "Docker",
      "Jenkins",
      "Git"
    ],
    detail_scores: [
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 경력 3년 이상",
        score: 100,
        weight: 10,
        weighted_score: 10.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "학위 요건 (학사 이상)",
        score: 100,
        weight: 5,
        weighted_score: 5.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 기술 경험 보유",
        score: 90,
        weight: 5,
        weighted_score: 4.5
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "백엔드 시스템 설계 경험",
        score: 95,
        weight: 5,
        weighted_score: 4.8
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "RESTful API 설계/개발 경험",
        score: 90,
        weight: 5,
        weighted_score: 4.5
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "백엔드 시스템 설계 및 개발",
        score: 95,
        weight: 15,
        weighted_score: 14.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "API 개발 및 운영",
        score: 95,
        weight: 15,
        weighted_score: 14.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "데이터베이스 설계 및 최적화",
        score: 90,
        weight: 10,
        weighted_score: 9.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "대용량 트래픽 처리 경험",
        score: 85,
        weight: 5,
        weighted_score: 4.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "모니터링 및 장애 대응",
        score: 80,
        weight: 5,
        weighted_score: 4.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "클라우드(AWS 등) 사용 경험",
        score: 80,
        weight: 10,
        weighted_score: 8.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "컨테이너(Docker) 경험",
        score: 60,
        weight: 5,
        weighted_score: 3.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "CI/CD 구축 경험",
        score: 40,
        weight: 5,
        weighted_score: 2.0
      }
    ]
  },
  2: {
    id: 2,
    masked_code: "APPLICANT_002",
    fitLabel: "유연하게",
    score: {
      total_score: 84.2,
      requirement_score: 80,
      skill_score: 85,
      task_score: 90,
      preference_score: 75
    },
    resume_summary: {
      career_summary: "스타트업 풀스택 개발 경력 3년으로 REST API 개발 경험 위주입니다.",
      project_summary: "쇼핑몰 플랫폼 개발 프로젝트에서 백엔드 비즈니스 로직 최적화 처리 수행.",
      skill_summary: "Java, Node.js, Spring Boot, React, MySQL, AWS, Docker 사용 장치."
    },
    matched_skills: [
      "Java",
      "Spring Boot",
      "React",
      "MySQL",
      "AWS",
      "Docker"
    ],
    detail_scores: [
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 경력 3년 이상",
        score: 80,
        weight: 10,
        weighted_score: 8.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "학위 요건 (학사 이상)",
        score: 100,
        weight: 5,
        weighted_score: 5.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 기술 경험 보유",
        score: 85,
        weight: 5,
        weighted_score: 4.2
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "백엔드 시스템 설계 경험",
        score: 75,
        weight: 5,
        weighted_score: 3.8
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "RESTful API 설계/개발 경험",
        score: 85,
        weight: 5,
        weighted_score: 4.2
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "백엔드 시스템 설계 및 개발",
        score: 90,
        weight: 15,
        weighted_score: 13.5
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "API 개발 및 운영",
        score: 92,
        weight: 15,
        weighted_score: 13.8
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "데이터베이스 설계 및 최적화",
        score: 85,
        weight: 10,
        weighted_score: 8.5
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "대용량 트래픽 처리 경험",
        score: 75,
        weight: 5,
        weighted_score: 3.8
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "모니터링 및 장애 대응",
        score: 80,
        weight: 5,
        weighted_score: 4.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "클라우드(AWS 등) 사용 경험",
        score: 85,
        weight: 10,
        weighted_score: 8.5
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "컨테이너(Docker) 경험",
        score: 70,
        weight: 5,
        weighted_score: 3.5
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "CI/CD 구축 경험",
        score: 50,
        weight: 5,
        weighted_score: 2.5
      }
    ]
  },
  3: {
    id: 3,
    masked_code: "APPLICANT_003",
    fitLabel: "꼼꼼하게",
    score: {
      total_score: 82.1,
      requirement_score: 90,
      skill_score: 70,
      task_score: 85,
      preference_score: 70
    },
    resume_summary: {
      career_summary: "금융계 대기업 계열사 백엔드 구축 및 운영 경험 5년.",
      project_summary: "레거시 마이그레이션 및 정산 모듈 구축 과정의 트랜잭션 무결화 작업 수행.",
      skill_summary: "Java, Spring, Spring Boot, Oracle Database, SQL, Jenkins 빌드."
    },
    matched_skills: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Jenkins",
      "Git"
    ],
    detail_scores: [
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 경력 3년 이상",
        score: 100,
        weight: 10,
        weighted_score: 10.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "학위 요건 (학사 이상)",
        score: 100,
        weight: 5,
        weighted_score: 5.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 기술 경험 보유",
        score: 80,
        weight: 5,
        weighted_score: 4.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "백엔드 시스템 설계 경험",
        score: 90,
        weight: 5,
        weighted_score: 4.5
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "RESTful API 설계/개발 경험",
        score: 80,
        weight: 5,
        weighted_score: 4.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "백엔드 시스템 설계 및 개발",
        score: 85,
        weight: 15,
        weighted_score: 12.8
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "API 개발 및 운영",
        score: 88,
        weight: 15,
        weighted_score: 13.2
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "데이터베이스 설계 및 최적화",
        score: 90,
        weight: 10,
        weighted_score: 9.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "대용량 트래픽 처리 경험",
        score: 70,
        weight: 5,
        weighted_score: 3.5
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "모니터링 및 장애 대응",
        score: 80,
        weight: 5,
        weighted_score: 4.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "클라우드(AWS 등) 사용 경험",
        score: 60,
        weight: 10,
        weighted_score: 6.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "컨테이너(Docker) 경험",
        score: 60,
        weight: 5,
        weighted_score: 3.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "CI/CD 구축 경험",
        score: 80,
        weight: 5,
        weighted_score: 4.0
      }
    ]
  },
  4: {
    id: 4,
    masked_code: "APPLICANT_004",
    fitLabel: "성실하게",
    score: {
      total_score: 78.7,
      requirement_score: 80,
      skill_score: 75,
      task_score: 82,
      preference_score: 70
    },
    resume_summary: {
      career_summary: "SI 전문 파견업체 근무 경력 3년. 주로 공공기관 사업 위주 참여.",
      project_summary: "행정포털 관리 시스템 및 대외 연계 API 개발 담당 설계.",
      skill_summary: "Java, JSP, Spring, Oracle, PostgreSQL, Tomcat, SVN 빌드."
    },
    matched_skills: [
      "Java",
      "MySQL",
      "Git"
    ],
    detail_scores: [
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 경력 3년 이상",
        score: 80,
        weight: 10,
        weighted_score: 8.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "학위 요건 (학사 이상)",
        score: 100,
        weight: 5,
        weighted_score: 5.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 기술 경험 보유",
        score: 70,
        weight: 5,
        weighted_score: 3.5
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "백엔드 시스템 설계 경험",
        score: 75,
        weight: 5,
        weighted_score: 3.8
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "RESTful API 설계/개발 경험",
        score: 75,
        weight: 5,
        weighted_score: 3.8
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "백엔드 시스템 설계 및 개발",
        score: 80,
        weight: 15,
        weighted_score: 12.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "API 개발 및 운영",
        score: 82,
        weight: 15,
        weighted_score: 12.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "데이터베이스 설계 및 최적화",
        score: 85,
        weight: 10,
        weighted_score: 8.5
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "대용량 트래픽 처리 경험",
        score: 60,
        weight: 5,
        weighted_score: 3.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "모니터링 및 장애 대응",
        score: 75,
        weight: 5,
        weighted_score: 3.8
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "클라우드(AWS 등) 사용 경험",
        score: 40,
        weight: 10,
        weighted_score: 4.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "컨테이너(Docker) 경험",
        score: 40,
        weight: 5,
        weighted_score: 2.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "CI/CD 구축 경험",
        score: 50,
        weight: 5,
        weighted_score: 2.5
      }
    ]
  },
  5: {
    id: 5,
    masked_code: "APPLICANT_005",
    fitLabel: "안정적이게",
    score: {
      total_score: 76.4,
      requirement_score: 70,
      skill_score: 80,
      task_score: 78,
      preference_score: 70
    },
    resume_summary: {
      career_summary: "중견 SI 기업 백엔드 엔지니어 근무 경력 6년.",
      project_summary: "ERP 연동 내부 유동 연계 로직 설계 구축 연관 인프라 정합도 작업.",
      skill_summary: "Java, Hibernate, DB2, WebSphere, Git, JUnit, SVN."
    },
    matched_skills: [
      "Java",
      "Git"
    ],
    detail_scores: [
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 경력 3년 이상",
        score: 100,
        weight: 10,
        weighted_score: 10.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "학위 요건 (학사 이상)",
        score: 100,
        weight: 5,
        weighted_score: 5.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "필수 기술 경험 보유",
        score: 60,
        weight: 5,
        weighted_score: 3.0
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "백엔드 시스템 설계 경험",
        score: 70,
        weight: 5,
        weighted_score: 3.5
      },
      {
        criterion_type: "자격 조건",
        type_weight: 30,
        detail: "RESTful API 설계/개발 경험",
        score: 65,
        weight: 5,
        weighted_score: 3.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "백엔드 시스템 설계 및 개발",
        score: 75,
        weight: 15,
        weighted_score: 11.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "API 개발 및 운영",
        score: 75,
        weight: 15,
        weighted_score: 11.3
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "데이터베이스 설계 및 최적화",
        score: 80,
        weight: 10,
        weighted_score: 8.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "대용량 트래픽 처리 경험",
        score: 60,
        weight: 5,
        weighted_score: 3.0
      },
      {
        criterion_type: "주요업무",
        type_weight: 50,
        detail: "모니터링 및 장애 대응",
        score: 70,
        weight: 5,
        weighted_score: 3.5
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "클라우드(AWS 등) 사용 경험",
        score: 50,
        weight: 10,
        weighted_score: 5.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "컨테이너(Docker) 경험",
        score: 40,
        weight: 5,
        weighted_score: 2.0
      },
      {
        criterion_type: "우대사항",
        type_weight: 20,
        detail: "CI/CD 구축 경험",
        score: 40,
        weight: 5,
        weighted_score: 2.0
      }
    ]
  }
};

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
    console.warn("getApplicantDetail 실제 API 통신 오프라인, Mock 매핑.");
  }

  // 로컬 세션 탐지
  try {
    const local = localStorage.getItem(`applicant_detail_${applicantId}`);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    // ignore
  }

  // 기본 백업
  let found = mockDetailsMap[applicantId];
  if (!found) {
    const template = mockDetailsMap[1];
    
    // 로컬 스토리지에 저장했던 업로드된 이력서 및 지원자 요약본 리스트에서 해당 applicantId를 찾아옵니다
    let summary: any = null;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("applicants_")) {
          const list = JSON.parse(localStorage.getItem(key) || "[]");
          const candidate = list.find((a: any) => a.id === applicantId);
          if (candidate) {
            summary = candidate;
            break;
          }
        }
      }
    } catch (e) {}

    if (!summary) {
      summary = mockSummaryList.find((a) => a.id === applicantId) || mockSummaryList[0];
    }

    const scaleFactor = summary.total_score / template.score.total_score;
    const adjustedDetailScores = template.detail_scores.map((item) => {
      const nextScore = Math.max(40, Math.min(100, Math.round(item.score * scaleFactor)));
      return {
        ...item,
        score: nextScore,
        weighted_score: parseFloat((nextScore * (item.weight / 100)).toFixed(1))
      };
    });

    found = {
      ...template,
      id: applicantId,
      masked_code: summary.masked_code,
      score: {
        total_score: summary.total_score,
        requirement_score: summary.requirement_score || 80,
        skill_score: summary.skill_score || 80,
        task_score: summary.task_score || 80,
        preference_score: summary.preference_score || 70
      },
      detail_scores: adjustedDetailScores
    };
  }
  saveToLocalStorage(`applicant_detail_${applicantId}`, found);
  return found;
}
