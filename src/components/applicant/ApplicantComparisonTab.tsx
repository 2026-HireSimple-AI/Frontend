import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComparisonLeftPanel from "./ComparisonLeftPanel";
import ComparisonResultArea from "./ComparisonResultArea";
import InterviewCountModal from "./InterviewCountModal";
import { 
  ApplicantSummary, 
  ApplicantDetail, 
  getApplicantDetail 
} from "../../api/applicantApi";
import { generateApplicantInterviewQuestions } from "../../api/interviewQuestionApi";
import { Sparkles, ArrowRightCircle } from "lucide-react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ApplicantComparisonTabProps {
  applicants: ApplicantSummary[];
}

export default function ApplicantComparisonTab({
  applicants = []
}: ApplicantComparisonTabProps) {
  const { jobPostingId } = useParams<{ jobPostingId: string }>();
  const navigate = useNavigate();

  // State Management
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState<boolean>(false);

  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState<ApplicantDetail[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  // Initialize with top 3 sorted applicants as default selected candidates
  useEffect(() => {
    if (applicants.length > 0) {
      const sorted = [...applicants].sort((a, b) => b.total_score - a.total_score);
      const top3Ids = sorted.slice(0, 3).map((a) => a.id);
      setSelectedApplicantIds(top3Ids);
    } else {
      setSelectedApplicantIds([]);
    }
  }, [applicants]);

  // Fetch applicant details whenever selected ids change
  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const details = await Promise.all(
          selectedApplicantIds.map(async (id) => {
            return await getApplicantDetail(id);
          })
        );
        setSelectedApplicantDetails(details);
      } catch (err) {
        console.error("데이터 디테일 수집 중 오류:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (selectedApplicantIds.length > 0) {
      fetchDetails();
    } else {
      setSelectedApplicantDetails([]);
    }
  }, [selectedApplicantIds]);

  // Toggle checks with a maximum cap of 3
  const handleToggleApplicant = (id: number) => {
    setErrorMessage("");
    if (selectedApplicantIds.includes(id)) {
      setSelectedApplicantIds(selectedApplicantIds.filter((x) => x !== id));
    } else {
      if (selectedApplicantIds.length >= 3) {
        setErrorMessage("최대 3명까지 비교할 수 있습니다.");
        return;
      }
      setSelectedApplicantIds([...selectedApplicantIds, id]);
    }
  };

  // Immediate remove target
  const handleRemoveApplicant = (id: number) => {
    setSelectedApplicantIds(selectedApplicantIds.filter((x) => x !== id));
    setErrorMessage("");
  };

  // Generate Questions via modal confirm
  const handleConfirmCountSelection = async (selectedIds: number[]) => {
    setIsInterviewModalOpen(false);
    if (selectedIds.length > 0) {
      const primaryId = selectedIds[0];
      navigate(`/analysis/${jobPostingId}/interview-questions?applicantId=${primaryId}&candidateIds=${selectedIds.join(",")}`);
    }
  };

  return (
    <div className={styles.comparisonTab} id="applicant-comparison-tab-viewport">
      <div className={styles.comparisonLayout}>
        {/* Left Control Column */}
        <ComparisonLeftPanel
          applicants={applicants}
          selectedApplicants={selectedApplicantDetails}
          selectedApplicantIds={selectedApplicantIds}
          onToggleApplicant={handleToggleApplicant}
          errorMessage={errorMessage}
        />

        {/* Right Comparison Visual Grid Area */}
        {isLoadingDetails ? (
          <div className="flex-grow bg-white border border-[#E6EAF0] rounded-2xl h-[400px] flex items-center justify-center font-bold text-[#00194B]/70 animate-pulse text-sm">
            상세 매칭 지적 데이터 분석 로딩 중...
          </div>
        ) : (
          <ComparisonResultArea
            selectedApplicants={selectedApplicantDetails}
            onRemoveApplicant={handleRemoveApplicant}
          />
        )}
      </div>

      {/* Bottom Fixed Action Area */}
      {selectedApplicantIds.length > 0 && (
        <div className={styles.bottomActionArea} id="comparison-bottom-action-container">
          <div className={styles.bottomNotice}>
            <div className="w-8 h-8 rounded-full bg-[#EEF3FA] flex items-center justify-center text-[#6D5DFC] shrink-0">
              <ArrowRightCircle size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#6D5DFC] block uppercase tracking-wider">
                다음 단계
              </span>
              <p className="text-xs font-bold text-[#475467] leading-tight select-none">
                선택한 지원자에 대한 맞춤 면접 질문을 생성해보세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.generateButton}
            onClick={() => setIsInterviewModalOpen(true)}
            id="comparison-generate-btn"
          >
            <Sparkles size={16} className="text-amber-300 animate-pulse" />
            <span>면접 질문 생성하기</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <InterviewCountModal
        isOpen={isInterviewModalOpen}
        applicants={applicants}
        onClose={() => setIsInterviewModalOpen(false)}
        onConfirm={handleConfirmCountSelection}
      />
    </div>
  );
}
