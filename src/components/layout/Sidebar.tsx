/**
 * 이 파일은 전체 어플리케이션의 왼쪽 글로벌 사이드바(Sidebar) 컴포넌트입니다.
 * - 배경색은 #00194B 이며, 너비는 180px(열림) / 56px(접힘) 사이를 토글합니다.
 * - 메뉴 구성: 분석 생성, 분석 관리 (정확한 레이블 구성 준수)
 * - 하단 프로필 영역: 로그인된 사용자의 아바타와 기업 정보 표시 및 드롭다운 토글 기능 포함
 */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  PlusCircle, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User, 
  Settings,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  isLoggedIn: boolean;
  user: {
    id: number;
    name: string;
    company_name: string;
    email?: string;
  } | null;
  activeMenu: "new" | "manage" | string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  isLoggedIn,
  user,
  activeMenu,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse: controlledOnToggle,
  onLogout
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 내부 접기 상태 제어 (prop이 제공되지 않은 경우용 폴백)
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;
  const toggleCollapse = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsCollapsed(!internalIsCollapsed);
    }
  };

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // 분석 관리 클릭 핸들링 (미인증 시 로그인 페이지로 리다이렉트)
  const handleManageClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      // query parameter로 리다이렉트 지정 가능
      navigate("/login?redirect=/analysis/manage");
    }
  };

  return (
    <div 
      className="flex flex-col h-screen text-white relative transition-all duration-250 ease-in-out border-r border-[#002D80] select-none"
      style={{ 
        width: isCollapsed ? "56px" : "180px",
        backgroundColor: "#00194B"
      }}
    >
      {/* 1. 로고 영역 */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#002D80]/60 overflow-hidden">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <div className="w-6 h-6 rounded bg-[#6D5DFC] flex items-center justify-center text-xs">H</div>
          {!isCollapsed && <span className="text-sm font-semibold truncate">Hire Simple AI</span>}
        </Link>
        
        {/* 접기/펴기 버튼 (영역 경계에 둥글게 얹는 방식도 이쁘지만 사이드바 상단에 배치) */}
        {!isCollapsed && (
          <button 
            onClick={toggleCollapse} 
            className="p-1 hover:bg-[#002D80] rounded cursor-pointer transition-colors"
            title="사이드바 접기"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* 2. 네비게이션 아이템 영역 */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-2">
        {/* 분석 생성 */}
        <Link
          to="/analysis/new"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeMenu === "new" || location.pathname === "/analysis/new" || location.pathname === "/"
              ? "bg-[#6D5DFC] text-white font-semibold"
              : "text-[#98A0AE] hover:text-white hover:bg-[#002D80]"
          }`}
          title="분석 생성"
        >
          <PlusCircle size={18} className="flex-shrink-0" />
          {!isCollapsed && <span className="truncate">분석 생성</span>}
        </Link>

        {/* 분석 관리 */}
        <Link
          to="/analysis/manage"
          onClick={handleManageClick}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeMenu === "manage" || location.pathname === "/analysis/manage"
              ? "bg-[#6D5DFC] text-white font-semibold"
              : "text-[#98A0AE] hover:text-white hover:bg-[#002D80]"
          }`}
          title="분석 관리"
        >
          <Layers size={18} className="flex-shrink-0" />
          {!isCollapsed && <span className="truncate">분석 관리</span>}
        </Link>
      </div>

      {/* 3. 로그인 정보 & 접기 버튼 (메뉴 접기) */}
      <div className="p-2 border-t border-[#002D80]/60 bg-[#001236]/40">
        {/* 로그인 된 경우 */}
        {isLoggedIn && user ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#002D80] transition-colors cursor-pointer text-left overflow-hidden"
              title={`${user.name} (${user.company_name})`}
            >
              {/* 아바타 */}
              <div className="w-8 h-8 rounded-full bg-[#6D5DFC] flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {user.name.substring(0, 1)}
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">{user.name}</div>
                  <div className="text-[10px] text-[#98A0AE] truncate mt-0.5">{user.company_name}</div>
                </div>
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {showProfileDropdown && (
              <div 
                className="absolute bottom-12 left-2 right-2 bg-[#00194B] border border-[#002D80] rounded-xl p-1 shadow-xl z-50 flex flex-col gap-0.5 text-xs text-white"
                style={{ minWidth: isCollapsed ? "130px" : "auto" }}
              >
                {!isCollapsed && (
                  <div className="px-2 py-1.5 border-b border-[#002D80] text-[#98A0AE] font-semibold">
                    이메일: {user.email || 'recruiter@company.com'}
                  </div>
                )}
                <button 
                  onClick={() => {
                    alert("계정 설정 모드는 준비 중입니다.");
                    setShowProfileDropdown(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 hover:bg-[#002D80] transition-colors rounded-lg cursor-pointer text-left w-full"
                >
                  <Settings size={14} />
                  <span>계정 설정</span>
                </button>
                <button 
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 hover:bg-[#EF4444]/20 text-[#EF4444] transition-colors rounded-lg cursor-pointer text-left w-full"
                >
                  <LogOut size={14} />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 로그인 전: 로그인 유도 안내 또는 공백 */
          !isCollapsed && (
            <div className="px-3 py-2 text-center text-xs text-[#98A0AE]">
              로그인 후 더 많은 기능을 만나보세요.
            </div>
          )
        )}

        {/* 하단 단축 Collapse 토글 버튼 */}
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-[#98A0AE] hover:text-white hover:bg-[#002D80] transition-all text-xs font-medium cursor-pointer"
          title={isCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="mx-auto" />
          ) : (
            <>
              <ChevronLeft size={16} className="flex-shrink-0" />
              <span>메뉴 접기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
