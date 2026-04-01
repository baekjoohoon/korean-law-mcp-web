/**
 * 인증 API 엔드포인트
 * Wave 5에서 MCP + Qwen 통합으로 확장될 예정
 */

import { onRequest as authHandler } from '../../server/api/auth'
import { Env } from '../../server/utils/handler'

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  return authHandler(context)
}
