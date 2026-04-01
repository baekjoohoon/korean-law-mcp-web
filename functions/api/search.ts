/**
 * 검색 API 엔드포인트
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

  try {
    const body = await context.request.json()
    const { query } = body

    if (!query) {
      return Response.json({ success: false, message: '검색어를 입력해주세요' }, { status: 400 })
    }

    return Response.json({
      success: true,
      answer: `"${query}"에 대한 검색 결과입니다.\n\n현재 검색 기능이 준비 중입니다.`,
      sources: [],
      query: query,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Search error:', error)
    return Response.json({ success: false, message: '검색 처리 중 오류가 발생했습니다' }, { status: 500 })
  }
}
