export interface Env {
  MCP_ENDPOINT: string
}
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function callMCP(query: string, mcpEndpoint: string) {
  try {
    const r = await fetch(mcpEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: 'search_law', arguments: { query, display: 10 } },
      }),
    })
    if (!r.ok) {
      console.error('MCP error:', r.status)
      return null
    }
    return await r.json()
  } catch (e) {
    console.error('MCP error:', e)
    return null
  }
}

export async function onRequest(ctx: EventContext<Env>): Promise<Response> {
  if (ctx.request.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (ctx.request.method !== 'POST')
    return Response.json(
      { success: false, message: '허용되지 않은 메서드입니다' },
      { status: 405, headers: CORS },
    )

  try {
    const { query } = await ctx.request.json()
    if (!query)
      return Response.json(
        { success: false, message: '검색어를 입력해주세요' },
        { status: 400, headers: CORS },
      )

    const mcpEndpoint = ctx.env.MCP_ENDPOINT || 'https://korean-law-mcp.fly.dev/mcp'
    const result = await callMCP(query, mcpEndpoint)
    let ans = `## "${query}" 검색 결과\n\n`,
      srcs: any = []

    if (result?.result?.content && Array.isArray(result.result.content)) {
      const lawText = result.result.content[0]?.text || ''
      if (lawText) {
        ans += lawText + '\n\n'
        srcs.push({ type: 'law', title: query, preview: lawText.substring(0, 150) + '...' })
        ans += `\n\n출처: 법제처 국가법령정보센터 (www.law.go.kr)`
      } else {
        ans = `"${query}"에 대한 검색 결과가 없습니다.\n\n다른 검색어로 시도해보세요.`
      }
    } else {
      ans = `"${query}"에 대한 검색 결과가 없습니다.\n\n다른 검색어로 시도해보세요.`
    }

    const disclaimer = `\n\n---\n⚠️ 면책 조항: 이 정보는 법제처에서 제공하는 법령 정보이며, 법적 조언이 아닙니다.\n정확한 법적 조언은 변호사 등 전문가와 상담하시기 바랍니다.`

    return Response.json(
      {
        success: true,
        answer: ans + disclaimer,
        sources: srcs,
        query,
        timestamp: new Date().toISOString(),
      },
      { headers: CORS },
    )
  } catch (e) {
    console.error('Search error:', e)
    return Response.json(
      { success: false, message: '검색 처리 중 오류가 발생했습니다', error: String(e) },
      { status: 500, headers: CORS },
    )
  }
}
