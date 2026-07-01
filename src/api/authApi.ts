const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// ---------- 타입 정의 ----------
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  company_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  company_name: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
}

// ---------- 회원가입 ----------
export async function signup(req: SignupRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "회원가입에 실패했습니다.");
  }
}

// ---------- 로그인 ----------
export async function login(req: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "로그인에 실패했습니다.");
  }

  const data = await res.json();
  return data.data;
}

// ---------- 세션 만료 시간 (15분) ----------
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

// ---------- 토큰 저장/조회/삭제 ----------
export function saveToken(authData: AuthResponse): void {
  localStorage.setItem("access_token", authData.access_token);
  localStorage.setItem("refresh_token", authData.refresh_token);
  localStorage.setItem("user", JSON.stringify(authData.user));
  localStorage.setItem("loggedInUser", JSON.stringify(authData.user));
  // 로그인 시각 기록
  localStorage.setItem("session_expires_at", String(Date.now() + SESSION_TIMEOUT_MS));
}

// 마지막 활동 시각을 15분 연장 (페이지 이동·클릭 시 호출)
export function refreshSessionExpiry(): void {
  if (localStorage.getItem("access_token")) {
    localStorage.setItem("session_expires_at", String(Date.now() + SESSION_TIMEOUT_MS));
  }
}

export function getToken(): string | null {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const expiresAt = Number(localStorage.getItem("session_expires_at") || "0");
  if (Date.now() > expiresAt) {
    // 세션 만료 — 자동 로그아웃
    logout();
    return null;
  }

  return token;
}

export function getUser(): UserInfo | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("session_expires_at");
}

// ---------- 내 정보 조회 ----------
export async function getMe(): Promise<UserInfo> {
  const token = getToken();
  if (!token) throw new Error("토큰이 없습니다.");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("인증이 만료되었습니다.");

  const data = await res.json();
  return data.data;
}
