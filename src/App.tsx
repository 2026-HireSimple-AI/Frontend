/**
 * 이 파일은 전체 애플리케이션의 엔트리 라우터(App.tsx)입니다.
 * - react-router-dom 시스템을 활용해 모든 화면 이동을 클라이언트 사이드 렌더링(CSR)으로 제어합니다.
 * - 워크플로우 지원 단계 매핑:
 *   1. /analysis/new (또는 /) - STEP 1. 분석 생성 홈
 *   2. /analysis/:jobPostingId/criteria-review - STEP 2. 평가 기준 검증
 *   3. /analysis/:jobPostingId/applicants - STEP 3. 지원자 적합도 분석
 *   4. /analysis/:jobPostingId/interview-questions - STEP 4. 면접 질문 생성
 *   5. /analysis/manage - 히스토리 관리 대시보드
 *   6. /login, /signup - 로컬 세션 인증기
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/layout/PrivateRoute";

// 페이지 컴포넌트 임포트
import MainAnalysisPage from "./pages/MainAnalysisPage";
import CriteriaReviewPage from "./pages/CriteriaReviewPage";
import ApplicantAnalysisPage from "./pages/ApplicantAnalysisPage";
import InterviewQuestionsPage from "./pages/InterviewQuestionsPage";
import ManageAnalysisPage from "./pages/ManageAnalysisPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <BrowserRouter>
       <Routes>
        {/* 분석 생성 홈 */}
        <Route path="/" element={<Navigate to="/analysis/new" replace />} />
        <Route path="/analysis/new" element={
          <MainAnalysisPage />
        } />

        {/* STEP 2. 평가 기준 검증 */}
        <Route path="/analysis/:jobPostingId/criteria-review" element={
          <CriteriaReviewPage />
        } />

        {/* STEP 3. 지원자 적합도 분석 */}
        <Route path="/analysis/:jobPostingId/applicants" element={
          <PrivateRoute><ApplicantAnalysisPage /></PrivateRoute>
        } />

        {/* STEP 4. 면접 질문 생성 */}
        <Route path="/analysis/:jobPostingId/interview-questions" element={
          <PrivateRoute><InterviewQuestionsPage /></PrivateRoute>
        } />
        <Route path="/analysis/:jobPostingId/applicants/:applicantId/interview-questions" element={
          <PrivateRoute><InterviewQuestionsPage /></PrivateRoute>
        } />

        {/* 분석 기록 관리 (사이드바 메뉴연동) */}
        <Route path="/analysis/manage" element={
          <PrivateRoute><ManageAnalysisPage /></PrivateRoute>
        } />

        {/* 인증 게이트웨이 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 잘못된 엔트리 가드: 분석 생성으로 라우트 강제 리디렉션 */}
        <Route path="*" element={<Navigate to="/analysis/new" replace />} />
      </Routes>
    </BrowserRouter>
  );
}