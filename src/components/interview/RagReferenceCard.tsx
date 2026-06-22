import React from "react";
import { ExternalLink, Database } from "lucide-react";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

interface ReferenceItem {
  id: number;
  title: string;
  source: string;
  type: string;
  date: string;
  link?: string;
}

interface RagReferenceCardProps {
  references?: ReferenceItem[];
}

export default function RagReferenceCard({ references }: RagReferenceCardProps) {
  // 5 high-fidelity RAG data references shown in reference image
  const defaultReferences: ReferenceItem[] = [
    {
      id: 1,
      title: "채용절차의 공정화에 관한 법률",
      source: "고용노동부",
      type: "법령",
      date: "2023.12.01",
      link: "https://www.law.go.kr"
    },
    {
      id: 2,
      title: "공정 채용 면접 가이드북",
      source: "고용노동부",
      type: "가이드북",
      date: "2022.06.30",
      link: "https://www.moel.go.kr"
    },
    {
      id: 3,
      title: "직무 중심 채용 가이드",
      source: "고용노동부",
      type: "가이드",
      date: "2023.03.15",
      link: "https://www.moel.go.kr"
    },
    {
      id: 4,
      title: "블라인드 채용 가이드라인",
      source: "고용노동부",
      type: "가이드",
      date: "2021.07.20",
      link: "https://www.moel.go.kr"
    },
    {
      id: 5,
      title: "면접에서 자주 발생하는 법 위반 사례집",
      source: "고용노동부",
      type: "사례집",
      date: "2022.11.10",
      link: "https://www.moel.go.kr"
    }
  ];

  const listToRender = references || defaultReferences;

  return (
    <div className={styles.ragReferenceCard} id="rag-reference-card-container">
      <h3 className={styles.cardTitle} id="rag-reference-card-title">
        참고한 RAG 데이터 (상위 5건)
      </h3>

      <div className="flex flex-col gap-2.5 text-left" id="rag-references-list">
        {listToRender.map((ref) => (
          <a
            key={ref.id}
            href={ref.link || "#"}
            target="_blank"
            referrerPolicy="no-referrer"
            className={`${styles.ragItem} no-underline group pointer-events-auto`}
            id={`rag-reference-${ref.id}`}
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-xs font-bold text-[#1D2939] group-hover:text-[#6D5DFC] transition-colors truncate">
                {ref.title}
              </div>
              <div className="text-[10px] text-[#667085] font-medium leading-normal mt-1 flex items-center gap-1.5 select-none">
                <span>{ref.source}</span>
                <span className="text-[#EAECF0]">•</span>
                <span>{ref.type}</span>
                <span className="text-[#EAECF0]">•</span>
                <span>{ref.date}</span>
              </div>
            </div>
            
            {/* External link pointer on the right */}
            <div className="text-[#98A2B3] group-hover:text-[#6D5DFC] mt-0.5 flex-shrink-0 transition-colors">
              <ExternalLink size={12} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
