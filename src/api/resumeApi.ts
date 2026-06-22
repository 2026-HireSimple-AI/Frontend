/**
 * 이 파일은 이력서(Resume)를 업로드하고 정보를 처리하는 API입니다.
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

export interface UploadedResumeFile {
  resume_file_id: number;
  applicant_id: number;
  original_filename: string;
  processing_status: string;
}

export interface UploadResumesResponse {
  uploaded_count: number;
  files: UploadedResumeFile[];
}

/**
 * 4. 이력서 업로드 (POST /job-postings/{job_posting_id}/resumes)
 * Multipart/form-data 형태로 여러 명의 파일을 전송합니다.
 */
export async function uploadResumes(jobPostingId: number, files: File[]): Promise<UploadResumesResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // API 명세: files: resume1.pdf, resume2.pdf
    });

    const response = await fetch(`${baseUrl}/job-postings/${jobPostingId}/resumes`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        saveToLocalStorage(`uploaded_resumes_${jobPostingId}`, json.data);
        return json.data;
      }
    }
  } catch (error) {
    console.warn("실제 백엔드 API 연결 실패, Mock 데이터로 진행합니다.");
  }

  // Mock 동작
  await new Promise((resolve) => setTimeout(resolve, 1500)); // 업로드 시 로딩 느낌 추가

  const mockFiles: UploadedResumeFile[] = files.map((file, index) => {
    const mockFileId = Math.floor(Math.random() * 8000) + 1000 + index;
    const mockApplicantId = Math.floor(Math.random() * 8000) + 5000 + index;
    return {
      resume_file_id: mockFileId,
      applicant_id: mockApplicantId,
      original_filename: file.name,
      processing_status: "uploaded",
    };
  });

  const mockResult: UploadResumesResponse = {
    uploaded_count: files.length,
    files: mockFiles,
  };

  saveToLocalStorage(`uploaded_resumes_${jobPostingId}`, mockResult);
  return mockResult;
}
