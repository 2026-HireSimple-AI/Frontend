import React from "react";
// @ts-ignore
import styles from "../../styles/InterviewQuestionPage.module.css";

interface PageTitleSectionProps {
  title: string;
  description: string;
}

export default function PageTitleSection({ title, description }: PageTitleSectionProps) {
  return (
    <div className={styles.headerArea} id="page-title-section">
      <h2 className={styles.pageTitle} id="page-main-title">
        {title}
      </h2>
      <p className={styles.pageDescription} id="page-main-description">
        {description}
      </p>
    </div>
  );
}
