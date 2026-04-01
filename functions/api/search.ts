/**
 * 검색 API 엔드포인트 (구현 중)
 */
export interface Env {
  DASHSCOPE_API_KEY: string
  MCP_ENDPOINT: string
  LAW_OC: string
}

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  if (context.request.method !== 'POST') {
    return Response.json({ success: false, message: '허용되지 않은 메서드입니다' }, { status: 405 })
  }

  // TODO: Implement MCP + Qwen integration
  return Response.json({
    success: true,
    answer: '검색 기능이 준비 중입니다',
    sources: [],
    query: 'test',
    timestamp: new Date().toISOString(),
  })
}
