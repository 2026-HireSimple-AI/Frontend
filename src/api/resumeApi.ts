/**
 * 이 파일은 이력서(Resume)를 업로드/조회/삭제하는 API입니다.
 */

const getApiBaseUrl = (): string => {
  return ((import.meta as any).env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
};

export interface UploadedResumeFile {
  resume_file_id: number;
  applicant_id: number;
  original_filename: string;
  file_type?: string;
  file_size_bytes?: number;
  processing_status: string;
}

export interface UploadResumesResponse {
  uploaded_count: number;
  files: UploadedResumeFile[];
}

/**
 * 이력서 업로드 (POST /job-postings/{job_posting_id}/resumes)
 * Multipart/form-data 형태로 여러 명의 파일을 전송합니다.
 *
 * 실패 시 Mock 데이터로 조용히 대체하지 않고 에러를 그대로 던집니다.
 * 호출하는 쪽(CriteriaReviewPage)에서 실패를 명확히 처리해야 합니다.
 */
export async function uploadResumes(
  jobPostingId: number,
  files: File[],
  signal?: AbortSignal,
): Promise<UploadResumesResponse> {
  const baseUrl = getApiBaseUrl();

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file); // API 명세: files: resume1.pdf, resume2.pdf
  });

  const response = await fetch(`${baseUrl}/job-postings/${jobPostingId}/resumes`, {
    method: "POST",
    body: formData,
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || `이력서 업로드 실패 (status: ${response.status})`);
  }

  const json = await response.json();

  if (!json.success || !json.data) {
    throw new Error("이력서 업로드 응답 형식이 올바르지 않습니다.");
  }

  return json.data;
}

/**
 * 이력서 목록 조회 (GET /job-postings/{job_posting_id}/resumes)
 * 화면을 새로고침하거나 다시 들어왔을 때 서버의 실제 상태를 가져온다.
 */
export async function getResumes(jobPostingId: number): Promise<UploadResumesResponse> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/job-postings/${jobPostingId}/resumes`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || `이력서 목록 조회 실패 (status: ${response.status})`);
  }

  const json = await response.json();

  if (!json.success || !json.data) {
    throw new Error("이력서 목록 응답 형식이 올바르지 않습니다.");
  }

  return json.data;
}

/**
 * 이력서 삭제 (DELETE /resumes/{resume_file_id})
 */
export async function deleteResume(resumeFileId: number): Promise<void> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/resumes/${resumeFileId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || `이력서 삭제 실패 (status: ${response.status})`);
  }
}

export async function downloadMaskedResumes(jobPostingId: number): Promise<Blob> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(
    `${baseUrl}/job-posting/${jobPostingId}/resumes/masked-download?t=${Date.now()}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("다운로드에 실패했습니다.");
  }
  return response.blob();
}