## HireSimple AI — Frontend (dev)


## 시작하기

```bash
git checkout dev
npm install
cp .env.example .env
npm run dev
```

## 환경변수

`.env.example` 복사해서 값 채우면 됨.

- `VITE_API_BASE_URL` — 백엔드(FastAPI) 주소. 로컬은 `http://localhost:8000`, 배포는 EC2 주소인데 반드시 https여야 함 (이유는 아래 트러블슈팅 참고)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase 대시보드 API 설정에서 가져오기. anon key만 쓰고 service_role key는 절대 프론트에 넣지 말 것


## 폴더 구조

```
src/
 ├─ api/         백엔드 통신 함수 모음
 ├─ components/  여러 페이지에서 재사용하는 UI
 ├─ pages/       라우트 단위 화면
 ├─ styles/      전역 스타일
 └─ utils/       React 상관없는 순수 함수들
```

## 브랜치 / 커밋

`feature/기능명` → `dev` → `main` 순서로 PR. main에 바로 커밋 금지.

커밋 접두사는 대충 이렇게 쓰고 있음:
- `feat:` 새 기능
- `fix:` 버그 고침
- `refactor:` 동작 안 바뀌는 코드 정리
- `chore:` 설정/잡일

예: `feat: 지원자 실명 표시 및 분석 UI 개선`, `fix: 면접질문생성 디테일 수정`

## 배포

Vercel에 올라감. 배포 전에 확인할 것:
1. Vercel 환경변수에 .env랑 똑같은 키 등록했는지
2. API 주소가 https인지
3. 백엔드 CORS에 지금 Vercel 도메인 등록했는지
