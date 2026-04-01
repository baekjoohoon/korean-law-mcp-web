# 법률 검색 - 서우넷 (Korean Law MCP Web)

AI 기반 대한민국 법령 검색 시스템

[![Deploy to Cloudflare Pages](https://github.com/chrisryugj/korean-law-mcp-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/chrisryugj/korean-law-mcp-web/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 소개

**법률 검색 - 서우넷**은 공무원과 법률 전문가를 위해 설계된 AI 기반 법률 검색 시스템입니다.

- 🔍 **스마트 검색**: 자연어로 법령, 판례, 해석례 검색
- 🤖 **AI 답변**: Qwen AI 가 검색 결과를 요약하여 설명
- 🔐 **간편 인증**: 비밀번호 기반 인증 (데이터베이스 없음)
- 📱 **반응형 디자인**: PC, 태블릿, 모바일 지원
- 🚀 **고속 배포**: Cloudflare Pages 기반 자동 배포

## ✨ 주요 기능

### 1. 법률 검색

- 법령명 검색 (예: "관세법")
- 조문 검색 (예: "관세법 제 38 조")
- 판례 검색 (예: "부당해고 판례")
- 해석례 검색 (예: "근로기준법 제 74 조 해석례")

### 2. AI 답변

- 검색된 법령, 판례, 해석례를 AI 가 요약
- 이해하기 쉬운 한국어 설명
- 출처 명시 (법령, 판례, 해석례)

### 3. 최근 검색어

- localStorage 에 자동 저장
- 최대 10 개 검색어 보관
- 원클릭 재검색

## 🚀 빠른 시작

### 사전 준비사항

- Node.js 20+
- npm 또는 pnpm
- GitHub 계정
- Cloudflare 계정

### 1. 저장소 클론

```bash
git clone https://github.com/chrisryugj/korean-law-mcp-web.git
cd korean-law-mcp-web
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

⚠️ **보안 경고**: API 키는 절대 GitHub 에 푸시하지 마세요!

`.env` 파일 생성 (`.gitignore` 에 포함됨):

```bash
# Qwen API Configuration
DASHSCOPE_API_KEY=your-api-key-here

# Korean Law MCP (optional)
LAW_OC=your-law-api-key

# Login Password
LOGIN_PASSWORD=0629
```

### 4. 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

**로그인 비밀번호**: `0629`

## 📁 프로젝트 구조

```
korean-law-mcp-web/
├── src/
│   ├── client/              # React 프론트엔드
│   │   ├── components/      # UI 컴포넌트
│   │   │   ├── Login.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   ├── LawResults.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/           # Custom React Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useLawSearch.ts
│   │   │   └── useSearchHistory.ts
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── LoginPage.tsx
│   │   │   └── SearchPage.tsx
│   │   └── styles/          # Tailwind CSS
│   ├── functions/           # Cloudflare Pages Functions
│   │   └── api/
│   │       ├── auth.ts      # 인증 엔드포인트
│   │       └── search.ts    # 검색 엔드포인트
│   └── server/              # 서버 사이드 유틸리티
│       ├── mcp/             # MCP 클라이언트
│       └── qwen/            # Qwen API 클라이언트
├── tests/
│   ├── unit/                # 단위 테스트
│   ├── integration/         # 통합 테스트
│   └── e2e/                 # E2E 테스트 (Playwright)
├── .github/workflows/       # GitHub Actions
└── wrangler.toml            # Cloudflare 설정
```

## 🔧 스택

### 프론트엔드

- React 18 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- React Router DOM (라우팅)

### 백엔드

- Cloudflare Pages Functions
- MCP (Model Context Protocol)
- Qwen API (DashScope)

### 테스트

- Vitest (단위/통합 테스트)
- Playwright (E2E 테스트)
- Testing Library (React 테스트)

### 배포

- GitHub Actions (CI/CD)
- Cloudflare Pages (호스팅)
- Wrangler (Cloudflare CLI)

## 📝 API 문서

### 인증 API

#### `POST /api/auth`

로그인

**요청:**

```json
{
  "password": "0629"
}
```

**응답 (성공):**

```json
{
  "success": true,
  "token": "base64-encoded-token",
  "message": "로그인 성공",
  "expiresAt": "2026-04-01T00:00:00.000Z"
}
```

**응답 (실패):**

```json
{
  "success": false,
  "message": "비밀번호가 일치하지 않습니다"
}
```

### 검색 API

#### `POST /api/search`

법률 검색

**요청 헤더:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**요청:**

```json
{
  "query": "관세법 제 38 조"
}
```

**응답:**

```json
{
  "success": true,
  "answer": "AI 가 생성한 답변 텍스트...",
  "sources": [
    {
      "type": "law",
      "title": "관련 법령",
      "preview": "관세법 제 38 조 (관세평가)..."
    }
  ],
  "query": "관세법 제 38 조",
  "timestamp": "2026-03-31T00:00:00.000Z"
}
```

## 🚀 배포

### Cloudflare Pages 자동 배포

1. **GitHub 저장소 연결**
   - Cloudflare Dashboard → Workers & Pages → Create application
   - GitHub 리포지토리 선택

2. **빌드 설정**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build directory: `dist`

3. **환경 변수 설정**
   - `DASHSCOPE_API_KEY`: Qwen API 키
   - `MCP_ENDPOINT`: MCP 엔드포인트
   - `LAW_OC`: 법제처 API 키 (선택)

4. **배포**
   - `main` 브랜치 푸시 시 자동 배포
   - PR 생성 시 미리보기 배포

### 수동 배포

```bash
npm run build
npx wrangler pages deploy dist --project-name=korean-law-mcp-web
```

### GitHub Secrets 설정

필요한 Secrets:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID

## 🧪 테스트

### 단위 테스트

```bash
npm run test:unit
```

### 통합 테스트

```bash
npm run test:integration
```

### E2E 테스트

```bash
npm run test:e2e
```

### 테스트 리포트

```bash
npm run test:e2e:report
```

## 🔐 보안

### 인증

- 비밀번호: 환경 변수 `LOGIN_PASSWORD` 에서 설정 (기본값: `0629`)
- 토큰: Base64 인코딩 (24 시간 유효)
- 저장: localStorage

### 환경 변수 보안

- **API 키는 절대 GitHub 에 푸시하지 마세요!**
- `.env` 파일은 `.gitignore` 에 포함되어 있습니다
- 프로덕션에서는 Cloudflare Dashboard 에서 환경 변수 설정
- `wrangler.toml` 에는 실제 값을 저장하지 마세요

### 주의사항

- 프로덕션에서는 JWT 또는 세션 기반 인증 사용 권장
- API 키는 서버 사이드에서만 사용
- CORS 설정 확인

## ⚠️ 면책 조항

이 시스템은 AI 가 생성한 법률 정보를 제공하며, **법적 조언이 아닙니다**.

- 정보의 정확성을 보장하지 않습니다
- 최신 법령 개정을 반영하지 못할 수 있습니다
- 중요한 법적 결정은 전문가 (변호사, 법무사) 와 상담하세요

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 PR 환영합니다!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

서우넷 - [도메인: seonu.net]

프로젝트 링크: [https://github.com/chrisryugj/korean-law-mcp-web](https://github.com/chrisryugj/korean-law-mcp-web)

## 🙏 감사의 글

- **Korean Law MCP**: [https://github.com/chrisryugj/korean-law-mcp](https://github.com/chrisryugj/korean-law-mcp)
- **Qwen API**: Alibaba Cloud DashScope
- **Cloudflare Pages**: 무료 호스팅
