/**
 * 응답 유틸리티
 * JSON 응답 생성 헬퍼
 */

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
}

// Response 생성자에 json 메서드 추가
declare global {
  interface ResponseConstructor {
    json: typeof json
  }
}

Response.json = json
