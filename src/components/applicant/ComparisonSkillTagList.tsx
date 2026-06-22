import React from "react";
// @ts-ignore
import styles from "../../styles/ApplicantComparisonTab.module.css";

interface ComparisonSkillTagListProps {
  skills: string[];
}

export default function ComparisonSkillTagList({
  skills = []
}: ComparisonSkillTagListProps) {
  // 예쁜 배경 컬러 세트 부여
  const getTagColor = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes("python") || s.includes("java") || s.includes("spring")) {
      return { bg: "bg-[#EEFBF3]", text: "text-[#16A34A]" };
    }
    if (s.includes("mysql") || s.includes("redis") || s.includes("db")) {
      return { bg: "bg-[#EDF7FC]", text: "text-[#0284C7]" };
    }
    if (s.includes("aws") || s.includes("docker") || s.includes("jenkins") || s.includes("git")) {
      return { bg: "bg-[#F3F4F6]", text: "text-[#475467]" };
    }
    return { bg: "bg-[#F5F3FF]", text: "text-[#7C3AED]" };
  };

  return (
    <div className={styles.skillTagList} id="comparison-skill-tag-list-wrapper">
      <h4 className={styles.skillTagHeader}>보유 기술 스택 ({skills.length})</h4>
      <div className={styles.skillTagsContainer}>
        {skills.map((skill) => {
          const { bg, text } = getTagColor(skill);
          return (
            <span
              key={skill}
              className={`${styles.skillTag} ${bg} ${text}`}
            >
              {skill}
            </span>
          );
        })}
      </div>
    </div>
  );
}
