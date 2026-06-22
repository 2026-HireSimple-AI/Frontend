import React from "react";
import { Bell, User } from "lucide-react";

interface WorkflowHeaderProps {
  currentStep?: number;
  userName?: string;
  companyName?: string;
}

export default function WorkflowHeader({
  userName = "김채움님",
  companyName = "Acme Corp."
}: WorkflowHeaderProps) {
  return (
    <div 
      className="flex items-center justify-between py-2.5 px-4 mb-4 bg-white border border-[#E4E7EC] rounded-xl shadow-xs select-none"
      id="workflow-header-container"
    >
      {/* Left side breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#667085]" id="workflow-breadcrumbs">
        <span>지원자 분석</span>
        <span className="text-[#98A2B3] font-light">&gt;</span>
        <span className="text-[#00194B] font-bold">면접 질문 생성</span>
      </div>

      {/* Right side user badge & notifications */}
      <div className="flex items-center gap-4" id="workflow-meta-actions">
        {/* Bell Button */}
        <button 
          className="relative p-1.5 text-[#667085] hover:text-[#1D2939] hover:bg-[#F2F4F7] rounded-lg transition-colors cursor-pointer"
          id="notification-bell-btn"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 bg-[#F9FAFB] pl-1 pr-3 py-1 rounded-full border border-[#EAECF0]" id="user-badge-wrap">
          <div className="w-6 h-6 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#175CD3] font-bold text-xs">
            <User size={13} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-[#1D2939] leading-tight">{userName}</span>
            <span className="text-[9px] text-[#667085] leading-none">{companyName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
