# Law.go.kr API Authentication Issue - Contact Plan

**Created:** 2026-04-01  
**OC Code:** ha3035 (approved)  
**Domain:** korean-law-mcp-web.pages.dev (registered)  
**Status:** 🔴 API calls failing with verification error

---

## Problem Summary

### Current Issue
```
Error: "사용자 정보 검증에 실패하였습니다. 
       OPEN API 호출 시 사용자 검증을 위하여 정확한 서버장비의 IP 주소 및 
       도메인주소를 등록해 주세요."
```

### Root Cause
- **Platform:** Cloudflare Pages (serverless)
- **Problem:** Cloudflare Workers uses dynamic IP pools, not fixed IPs
- **Law.go.kr Requirement:** Fixed IP address registration mandatory
- **Conflict:** Dynamic IPs vs. static IP registration requirement

### Architecture Context
```
┌──────────────────────────────────────────┐
│  Cloudflare Pages Functions              │
│  Domain: korean-law-mcp-web.pages.dev    │
│  Outbound IP: Dynamic pool (rotates)     │
└───────────────┬──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│  Korean Law MCP Server                   │
│  URL: https://korean-law-mcp.fly.dev     │
│  OC: ha3035                              │
└───────────────┬──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│  Law.go.kr API                           │
│  Verification: IP + Domain check         │
│  Result: ❌ FAIL (unregistered IP)       │
└──────────────────────────────────────────┘
```

---

## 1. Phone Call Script (Korean)

### 📞 Contact Information
- **Phone:** 02-2109-6446
- **Department:** 법제처 개방운영팀 (Open Operation Team)
- **Hours:** Weekdays 09:00-18:00 KST (UTC+9)
- **Best Time to Call:** 10:00-11:30 or 14:00-16:00 (avoid lunch 12:00-13:00)

---

### Opening (도입부)

```
안녕하세요? 법률 검색 서비스 개발자입니다.
OPEN API 인증 관련 문의드리고자 연락드렸습니다.
```

---

### Situation Explanation (현황 설명)

```
현재 상황을 말씀드리면:

1. OC 인증코드 ha3035 는 승인받았습니다.
2. 도메인 korean-law-mcp-web.pages.dev 도 등록했습니다.
3. 그런데 API 호출 시 "사용자 정보 검증에 실패하였습니다" 오류가 발생합니다.

제가 Cloudflare Pages 라는 서버리스 플랫폼을 사용하는데,
여기서 문제가 있는 것 같습니다.

서버리스 플랫폼은 고정 IP 가 없고 IP 풀에서 동적으로 
할당된다고 합니다.
```

---

### Key Questions (핵심 질문)

#### 질문 1: Cloudflare IP 범위 등록 가능 여부

```
첫 번째 질문입니다.

Cloudflare Workers 는 고정 IP 가 없고 IP 풀에서 동적으로 할당됩니다.
단일 IP 대신 Cloudflare 의 IP 범위 전체를 등록할 수 있나요?

가능하다면 어떤 IP 범위를 등록해야 하나요?
Cloudflare 의 공식 IP 목록을 등록해도 되나요?
```

**Reference:** https://www.cloudflare.com/ips/

---

#### 질문 2: 도메인 인증만 사용 가능한지

```
두 번째 질문입니다.

IP 주소 등록 없이 도메인 인증만으로는 사용할 수 없나요?

도메인 (korean-law-mcp-web.pages.dev) 은 올바르게 등록되어 있는데,
IP 검증에서 계속 실패합니다.

서버리스 플랫폼의 경우 도메인 기반 인증으로 전환 가능한가요?
```

---

#### 질문 3: 대체 인증 방법

```
세 번째 질문입니다.

API 키를 HTTP 헤더에 포함하는 방식이나,
다른 인증 방법을 지원하지 않나요?

예를 들어:
- Authorization: Bearer {OC-code}
- X-API-Key: {OC-code}

OC 파라미터 외에 토큰 기반 인증은 가능한가요?
```

---

#### 질문 4: 서버리스 플랫폼 대응 방안

```
네 번째 질문입니다.

Vercel, AWS Lambda, Cloudflare Workers 같은 서버리스 플랫폼에서
Law.go.kr API 를 사용하려면 어떻게 해야 하나요?

고정 IP 를 가진 프록시 서버를 따로 구축해야 하나요?
아니면 법제처에서 권장하는 다른 방법이 있나요?
```

---

#### 질문 5: IP 접속이력 확인

```
마지막으로,

IP 접속이력 조회 페이지에서 우리 서비스의 접속 시도를
확인할 수 있나요?

어떤 IP 에서 접속이 시도되었는지 확인할 수 있다면
문제 파악에 도움이 될 것 같습니다.
```

**Reference:** https://open.law.go.kr/LSO/lab/ipErrorCheck.do

---

### Closing (마무리)

```
해결 방안을 알려주시면 그대로 진행하겠습니다.

추가로 필요한 서류나 절차가 있다면 말씀해주세요.
이메일로도 안내사항을 보내주실 수 있나요?

감사합니다.
```

---

## 2. Alternative Solutions to Request

### Option A: IP Range Registration (Preferred) ⭐

**Request:** Register Cloudflare's IP ranges instead of single IP

**Cloudflare IP Ranges:**
- IPv4: https://www.cloudflare.com/ips-v4
- IPv6: https://www.cloudflare.com/ips-v6

**Implementation:**
```
Register these IPv4 ranges with Law.go.kr:
- 172.64.0.0/13
- 162.158.0.0/15
- 104.16.0.0/13
- 104.24.0.0/14
- 198.41.128.0/17
- (and all ranges from cloudflare.com/ips-v4)
```

**Pros:**
- ✅ No infrastructure changes needed
- ✅ Works with current Cloudflare Pages setup
- ✅ Official Cloudflare IPs (reputable)

**Cons:**
- ❌ Large IP range (security concern)
- ❌ May require manual approval

---

### Option B: Domain-Only Authentication

**Request:** Enable domain-only verification for serverless platforms

**Justification:**
```
- Domain is already registered and verified
- Domain ownership is provable via DNS/SSL
- IP-based verification is legacy for serverless era
```

**Pros:**
- ✅ Modern authentication approach
- ✅ Works with any hosting platform
- ✅ No IP management overhead

**Cons:**
- ❌ May require policy change
- ❌ Could take time to implement

---

### Option C: Proxy Server Setup

**Request:** Official recommendation for serverless architectures

**Solution:** Deploy fixed-IP proxy middleware

```
Architecture:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Cloudflare      │───▶│ Proxy Server    │───▶│ Law.go.kr       │
│ Pages           │    │ (Fixed IP)      │    │ API             │
│ Dynamic IP      │    │ Static IP       │    │ Verified IP     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Proxy Options:**

| Platform | Cost | Setup Time | Reliability |
|----------|------|------------|-------------|
| Oracle Cloud Free Tier | Free | 30 min | High |
| AWS EC2 (t2.micro) | ~$8/mo | 20 min | High |
| DigitalOcean Droplet | ~$6/mo | 15 min | High |
| Google Cloud Run + NAT | ~$10/mo | 45 min | High |
| Fly.io | ~$5/mo | 20 min | Medium |

**Recommended:** Oracle Cloud Free Tier (truly free, static IP included)

**Pros:**
- ✅ Full control over IP
- ✅ Can add caching/rate limiting
- ✅ Works with any API

**Cons:**
- ❌ Additional infrastructure cost
- ❌ Additional maintenance burden
- ❌ Single point of failure

---

### Option D: API Key in Header

**Request:** Support Authorization header with API key

**Example:**
```http
GET /DRF/lawService.do HTTP/1.1
Host: www.law.go.kr
Authorization: Bearer ha3035
# OR
X-API-Key: ha3035
```

**Pros:**
- ✅ Industry standard
- ✅ Works with any hosting
- ✅ No IP management

**Cons:**
- ❌ Requires API changes from Law.go.kr
- ❌ Unlikely to be available soon

---

## 3. TDD-Oriented Action Plan

### Phase 1: Test Definition (Before Contact)

**File:** `tests/integration/law-api-auth.test.ts`

```typescript
import { describe, it, expect } from 'vitest'

const LAW_API_BASE = 'https://www.law.go.kr/DRF/lawService.do'
const OC_CODE = 'ha3035'

describe('Law.go.kr API Authentication', () => {
  it('should return 200 with valid OC code from registered IP', async () => {
    const params = new URLSearchParams({
      OC: OC_CODE,
      target: 'lsHistory',
      type: 'JSON',
      MST: '9094'
    })
    
    const response = await fetch(`${LAW_API_BASE}?${params}`)
    
    expect(response.status).toBe(200)
    expect(response.ok).toBe(true)
  })

  it('should return 401 with valid OC code from unregistered IP', async () => {
    // This documents the current failing case
    const params = new URLSearchParams({
      OC: OC_CODE,
      target: 'lsHistory',
      type: 'JSON',
      MST: '9094'
    })
    
    const response = await fetch(`${LAW_API_BASE}?${params}`)
    
    // Current behavior from Cloudflare Workers
    expect(response.status).toBe(401)
    const text = await response.text()
    expect(text).toContain('사용자 정보 검증에 실패')
  })

  it('should verify domain registration is recognized', async () => {
    // Test if domain-only verification works
    const params = new URLSearchParams({
      OC: OC_CODE,
      target: 'lsHistory',
      type: 'JSON',
      MST: '9094'
    })
    
    const response = await fetch(`${LAW_API_BASE}?${params}`, {
      headers: {
        'Origin': 'https://korean-law-mcp-web.pages.dev'
      }
    })
    
    // If domain-only auth works, this should pass
    expect(response.ok).toBe(true)
  })
})
```

**Run Test:**
```bash
npm run test:integration -- law-api-auth
```

**Expected Result:** Tests fail (documents current issue)

---

### Phase 2: Contact &
