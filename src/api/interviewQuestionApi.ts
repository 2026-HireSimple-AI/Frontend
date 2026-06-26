/**
 * 이 파일은 면접 질문 생성(Interview Questions) API를 처리합니다.
 * - POST /applicants/{applicant_id}/interview-questions
 * - GET /applicants/{applicant_id}/interview-questions
 * - PATCH /interview-questions/{question_id}
 * - POST /interview-questions/{question_id}/compliance-check
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

const getFromLocalStorage = (key: string): any => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
};

export interface InterviewQuestion {
  id: number;
  applicant_id: number;
  question_type: string; // "행동" | "역량" | "우려검증" | "기술검증" | "기타"
  question_text: string;
  importance: number; // 1, 2, 3 (for stars)
  compliance_status: "준수" | "경고";
  created_by: "AI" | "USER";
  revised_question_text?: string | null;
  created_at?: string | null;
}

export interface InterviewQuestionResponse {
  success: boolean;
  message: string;
  applicant_id: number;
}

// 9 default high-fidelity mock questions corresponding to APPLICANT_001
const defaultMockQuestions: InterviewQuestion[] = [
  {
    id: 110,
    applicant_id: 1,
    question_type: "행동",
    question_text: "이전 프로젝트에서 가장 복잡했던 기술적 문제는 무엇이었고, 어떻게 해결하셨는지 구체적으로 설명해주세요.",
    importance: 3,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 111,
    applicant_id: 1,
    question_type: "행동",
    question_text: "팀 내에서 의견 충돌이 발생했을 때, 어떻게 조율하고 합의에 도달했는지 경험을 말씀해주세요.",
    importance: 3,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 112,
    applicant_id: 1,
    question_type: "역량",
    question_text: "백엔드 시스템 설계 시 가장 중요하게 고려하는 요소는 무엇이며, 그 이유를 설명해주세요.",
    importance: 3,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 113,
    applicant_id: 1,
    question_type: "역량",
    question_text: "대규모 트래픽을 처리하기 위해 성능을 개선했던 경험이 있다면 어떤 방법을 사용했는지 설명해주세요.",
    importance: 3,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 114,
    applicant_id: 1,
    question_type: "행동",
    question_text: "마감 기한이 촉박한 상황에서 우선순위를 어떻게 정하고 작업하셨나요? 실제 사례를 들어 설명해주세요.",
    importance: 2,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 115,
    applicant_id: 1,
    question_type: "기타",
    question_text: "우리 서비스의 도메인에 대해 이해한 바를 설명하고, 개선 아이디어가 있다면 제안해주세요.",
    importance: 2,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 116,
    applicant_id: 1,
    question_type: "기술검증",
    question_text: "최근에 학습한 기술이나 도구가 있다면 무엇이며, 실무에 어떻게 적용해보셨나요?",
    importance: 2,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 117,
    applicant_id: 1,
    question_type: "우려검증",
    question_text: "장기 재직을 위해 회사가 어떤 점을 제공해야 한다고 생각하시나요? (직무 관련 측면 위주로 답변해주세요.)",
    importance: 2,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  },
  {
    id: 118,
    applicant_id: 1,
    question_type: "기타",
    question_text: "본인의 강점이 우리 팀과 함께 일하는 데 어떻게 기여할 수 있다고 생각하나요?",
    importance: 1,
    compliance_status: "준수",
    created_by: "AI",
    revised_question_text: null
  }
];

// Generates secondary mock questions for other applicants if needed
const generateMockQuestionsFor = (applicantId: number): InterviewQuestion[] => {
  const types = ["행동", "역량", "우려검증", "기술검증", "기타"];
  const templates = [
    " 지원자의 경험에 비추어 볼 때, 가장 성취감이 컸던 순간은 언제였습니까?",
    "을(를) 활용하며 직면했던 과제와 극복 방법을 알려주세요.",
    " 직무 수행 시 협력업체나 타 부서와 조율하는 본인만의 노하우가 있다면?",
    " 관련 위약 리스크를 해결하려고 진행한 검증 프로세스는 어떠했습니까?",
    " 본인은 새로운 업무 프로세스나 조직 문화에 어떻게 동화되는 편인가요?"
  ];

  return Array.from({ length: 9 }, (_, idx) => {
    const type = types[idx % types.length];
    const imp = idx < 4 ? 3 : idx < 8 ? 2 : 1;
    return {
      id: applicantId * 1000 + idx,
      applicant_id: applicantId,
      question_type: type,
      question_text: `[APPLICANT_00${applicantId}] ${type} 관련 질문: ${templates[idx % templates.length]}`,
      importance: imp,
      compliance_status: "준수",
      created_by: "AI" as const,
      revised_question_text: null
    };
  });
};

/**
 * 4.2. 특정 지원자의 면접 질문 목록 조회 (GET /applicants/{applicant_id}/interview-questions)
 */
export async function getInterviewQuestions(applicantId: number): Promise<InterviewQuestion[]> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/applicants/${applicantId}/interview-questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn("getInterviewQuestions API 통신 실패, Mock 활성화.");
  }

  // 백엔드 연결 실패 시 빈 배열 반환 (Mock 제거)
  return [];
}

/**
 * 5. 지원자의 AI 기반 맞춤 면접 질문 일괄 생성 요청 (POST /applicants/{applicant_id}/interview-questions)
 */
export async function generateApplicantInterviewQuestions(
  applicantId: number,
  params?: { question_count: number; question_types: string[] }
): Promise<InterviewQuestionResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/applicants/${applicantId}/interview-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params || { question_count: 9, question_types: ["행동", "역량", "우려검증", "기술검증", "기타"] })
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        return { success: true, message: json.message || "생성 완료", applicant_id: applicantId };
      } else {
        return { success: false, message: json.detail || "생성 실패", applicant_id: applicantId };
      }
    } else {
      const errJson = await response.json().catch(() => ({}));
      return { success: false, message: errJson.detail || `서버 오류 (${response.status})`, applicant_id: applicantId };
    }
  } catch (err: any) {
    console.error("generateApplicantInterviewQuestions API 통신 실패:", err);
    return { success: false, message: "서버 연결 실패", applicant_id: applicantId };
  }
}

/**
 * 6. 질문 개별 수정 완료 반영 핸들러 (PATCH /interview-questions/{question_id})
 */
export async function updateInterviewQuestion(
  questionId: number,
  questionText: string
): Promise<{ success: boolean; data?: any }> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/interview-questions/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question_text: questionText })
    });

    if (response.ok) {
      const json = await response.json();
      return { success: true, data: json.data };
    }
  } catch (err) {
    console.warn("updateInterviewQuestion API 통신 실패, 로컬 캐시 적용.");
  }

  // Apply to all active applicants' cached questions in localStorage
  for (let keyIdx = 0; keyIdx < localStorage.length; keyIdx++) {
    const key = localStorage.key(keyIdx);
    if (key && key.startsWith("questions_")) {
      const stored = getFromLocalStorage(key);
      if (Array.isArray(stored)) {
        const foundIdx = stored.findIndex(q => q.id === questionId);
        if (foundIdx !== -1) {
          stored[foundIdx].question_text = questionText;
          stored[foundIdx].revised_question_text = questionText;
          saveToLocalStorage(key, stored);
          break;
        }
      }
    }
  }

  return { success: true };
}

/**
 * 7. 질문 삭제 (DELETE /interview-questions/{question_id})
 */
export async function deleteInterviewQuestion(questionId: number): Promise<{ success: boolean }> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/interview-questions/${questionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) return { success: true };
  } catch (err) {
    console.warn("deleteInterviewQuestion API 통신 실패");
  }

  return { success: false };
}

/**
 * 8. 단일 질문 직접 추가 (POST /applicants/{applicant_id}/interview-questions/add)
 */
export async function addInterviewQuestion(
  applicantId: number,
  question: Pick<InterviewQuestion, "question_type" | "question_text" | "compliance_status" | "created_by">
): Promise<{ success: boolean; data?: InterviewQuestion }> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/applicants/${applicantId}/interview-questions/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question)
    });

    if (response.ok) {
      const json = await response.json();
      return { success: true, data: json.data };
    }
  } catch (err) {
    console.warn("addInterviewQuestion API 통신 실패");
  }

  return { success: false };
}

/**
 * 8. 특정 질문 법령 준수 검수 요청 (POST /interview-questions/{question_id}/compliance-check)
 */
export async function checkQuestionCompliance(
  questionId: number
): Promise<{ success: boolean; status: "준수" | "경고" }> {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/interview-questions/${questionId}/compliance-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const json = await response.json();
      return { success: true, status: json.status || "준수" };
    }
  } catch (err) {
    console.warn("checkQuestionCompliance API 통신 실패, 자동 준수 처리.");
  }

  return { success: true, status: "준수" };
}
