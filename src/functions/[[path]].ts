/**
 * SPA 폴밸 라우트 핸들러
 * 모든 경로를 처리하여 정적 자산 또는 SPA로 라우팅
 */

import { Env } from '../server/utils/handler'

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  const { request, env } = context

  // URL 파싱
  const url = new URL(request.url)

  // API 경로는 다른 함수에서 처리
  if (url.pathname.startsWith('/api/')) {
    return new Response('Not Found', { status: 404 })
  }

  // 그 외는 SPA 서빙
  return env.ASSETS.fetch(request)
}
