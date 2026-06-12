# minahview — 프론트엔드 규칙

Next.js 프론트엔드 전용 규칙. 전역 행동 원칙은 [루트 CLAUDE.md](../CLAUDE.md) 참고.

---

## 1. 프로젝트 개요

- **프레임워크:** Next.js (App Router)
- **백엔드 연동:** `minahai/` FastAPI (`http://localhost:8000`)
- **Docker:** `minahview/Dockerfile`, 포트 3000

---

## 2. API 연동 규칙

- API 베이스 URL은 환경변수로만 관리 (`NEXT_PUBLIC_API_URL`).
- 백엔드가 없는 경로를 호출하지 않도록 **먼저 `/docs`에서 엔드포인트 존재 확인**.
- Next.js dev 서버는 `page.tsx` 변경 후 재시작이 필요할 수 있음.

### 백엔드 주요 엔드포인트

| 기능 | 경로 |
|------|------|
| secom 회원가입·로그인 | `POST /signup`, `POST /login` |
| secom 마이페이지 | `GET /mypage` |
| secom 스케줄 | `/schedule/...` |
| inbody 커뮤니티 | `/community/...` |
| inbody 공지 | `/notices` |
| titanic 캐릭터 | `/titanic/<name>/...` |

---

## 3. 컴포넌트 규칙

- 페이지 컴포넌트는 `app/` 디렉토리 아래 App Router 관례 준수.
- 공통 UI는 `components/` 에 위치.
- 서버 컴포넌트 / 클라이언트 컴포넌트 경계를 명확히 한다 (`"use client"` 최소화).
- 요청받지 않은 컴포넌트 추출·리팩터링 금지.

---

## 4. 환경변수

- `.env.local` — 로컬 개발용 (커밋 금지).
- Docker 실행 시 `minahview/.env.local`이 `docker-compose.yaml`에서 로드됨.
