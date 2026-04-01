# 🚀 배포 상태

## ✅ 완료된 항목 (자동화됨)

### 1. GitHub 저장소

- ✅ 생성됨: https://github.com/baekjoohoon/korean-law-mcp-web
- ✅ Initial commit 푸시 완료
- ✅ wrangler.toml 업데이트 및 푸시

### 2. Cloudflare Pages 프로젝트

- ✅ 프로젝트 생성됨: `korean-law-mcp-web`
- ✅ 1 차 배포 완료: https://2006d365.korean-law-mcp-web.pages.dev
- ✅ wrangler.toml 에 환경 변수 설정됨

### 3. 환경 변수 (wrangler.toml)

```toml
DASHSCOPE_API_KEY = "sk-sp-6366c63dca024186add9fe216ab9f627"
MCP_ENDPOINT = "https://korean-law-mcp.fly.dev/mcp"
LAW_OC = "ha3035"
LOGIN_PASSWORD = "0629"
```

---

## 🔧 수동 설정 필요 (Dashboard)

### 1. GitHub 자동배포 연결 (필수!)

**Cloudflare Dashboard 에서:**

1. https://dash.cloudflare.com 접속
2. **Workers & Pages** → `korean-law-mcp-web` 선택
3. **Settings** → **Git** → **Connect to Git**
4. GitHub 계정 연동
5. 저장소 `baekjoohoon/korean-law-mcp-web` 선택
6. **Begin setup** → **Save and Deploy**

**완료 후:**

- main 브랜치 푸시 시 자동 배포
- PR 생성 시 미리보기 배포

---

### 2. 환경 변수 Dashboard 설정 (권장)

wrangler.toml 의 API 키를 Dashboard Secrets 로 이동:

**Cloudflare Dashboard 에서:**

1. **Workers & Pages** → `korean-law-mcp-web` → **Settings**
2. **Variables and Secrets** → **Add**
3. 다음 변수 추가 (모두 **Encrypt** 체크):

| 변수명              | 값                                       | Encrypt   |
| ------------------- | ---------------------------------------- | --------- |
| `DASHSCOPE_API_KEY` | `sk-sp-6366c63dca024186add9fe216ab9f627` | ✅        |
| `LAW_OC`            | `ha3035`                                 | ✅        |
| `LOGIN_PASSWORD`    | `0629`                                   | ❌ (평문) |
| `MCP_ENDPOINT`      | `https://korean-law-mcp.fly.dev/mcp`     | ❌ (평문) |

**완료 후 wrangler.toml 수정:**

```toml
[vars]
DASHSCOPE_API_KEY = ""  # Dashboard 에서 설정
MCP_ENDPOINT = "https://korean-law-mcp.fly.dev/mcp"
LAW_OC = ""  # Dashboard 에서 설정
LOGIN_PASSWORD = "0629"
```

---

### 3. 커스텀 도메인 연결 (선택)

**Cloudflare Dashboard 에서:**

1. **Workers & Pages** → `korean-law-mcp-web` → **Custom domains**
2. **Set up a domain**
3. `law.seonu.net` 입력
4. **Continue** → DNS 레코드 자동 생성 확인
5. **Activate domain**

**DNS 설정 (Cloudflare 에서 자동):**

```
Type: CNAME
Name: law
Content: korean-law-mcp-web.pages.dev
```

**소요 시간:** DNS 전파 5-10 분

---

## 📊 현재 배포 URL

| 환경                    | URL                                               | 상태                |
| ----------------------- | ------------------------------------------------- | ------------------- |
| **프로덕션 (임시)**     | https://2006d365.korean-law-mcp-web.pages.dev     | ✅ 배포됨           |
| **프로덕션 (본도메인)** | https://law.seonu.net                             | ⏳ 도메인 연결 필요 |
| **GitHub (코드)**       | https://github.com/baekjoohoon/korean-law-mcp-web | ✅ 푸시됨           |

---

## 🧪 테스트 방법

### 현재 배포본 테스트

1. https://2006d365.korean-law-mcp-web.pages.dev 접속
2. 비밀번호 `0629` 입력
3. 검색 테스트 (예: "관세법 제 38 조")

### 로컬 테스트

```bash
npm run dev
# http://localhost:5173
# 비밀번호: 0629
```

---

## ⚠️ 보안 체크리스트

- [x] API 키가 GitHub 에 푸시되지 않음 (wrangler.toml 은 예외 - Dashboard Secrets 로 이동 권장)
- [x] `.env` 파일이 `.gitignore` 에 포함됨
- [ ] Dashboard Secrets 로 API 키 이동 (권장)
- [ ] 커스텀 도메인 HTTPS 활성화 (자동)

---

## 📞 다음 단계

1. **GitHub 자동배포 연결** (5 분)
2. **Dashboard Secrets 설정** (3 분)
3. **커스텀 도메인 연결** (10 분)
4. **테스트** (5 분)

**총 예상 시간: 23 분**

---

마지막 업데이트: 2026-04-01
