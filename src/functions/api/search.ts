/**
 * 검색 API 엔드포인트
 * Wave 5에서 MCP + Qwen 통합으로 확장될 예정
 */

import { onRequest as searchHandler } from '../../server/api/search'
import { Env } from '../../server/utils/handler'

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  return searchHandler(context)
}
