export interface Env {
  OC: string
}
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function searchLaw(query: string, oc: string) {
  try {
    // HTTP 만 지원 (Cloudflare Workers 호환)
    const url = `http://www.law.go.kr/DRF/lawSearch.do?OC=${oc}&target=law&type=JSON&query=${encodeURIComponent(query)}&display=10`
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (!r.ok) {
      console.error('Law API error:', r.status, r.statusText)
      return null
    }
    const data = await r.json()
    return data
  } catch (e) {
    console.error('Law API error:', e)
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

    const oc = ctx.env.OC || 'ha3035'
    const result = await searchLaw(query, oc)
    let ans = `## "${query}" 검색 결과\n\n`,
      srcs: any = []

    if (result?.law && Array.isArray(result.law) && result.law.length > 0) {
      for (const law of result.law.slice(0, 5)) {
        const title = law.법령명한글 || law.법령Nm || '알수없는법령'
        const id = law.법령ID || law.lawId || ''
        const date = law.시행일자 || law.efYd || ''
        const link = law.법령상세링크 || `https://www.law.go.kr/LSW/LsEfInfoMain.do?LS_ID=${id}`
        const content = `**${title}**\n${date ? `시행일: ${date}\n` : ''}${id ? `법령 ID: ${id}\n` : ''}[자세히보기](${link})`
        ans += content + '\n\n'
        srcs.push({ type: 'law', title, preview: content.substring(0, 150) + '...' })
      }
      ans += `\n**총 ${result.law.length}개 법령 찾음**\n\n출처: 법제처 국가법령정보센터 (www.law.go.kr)`
    } else if (result?.error) {
      ans = `법제처 API 오류: ${result.error}\n\n잠시 후 다시 시도해주세요.`
    } else {
      ans = `"${query}"에 대한 검색 결과가 없습니다.\n\n다른 검색어로 시도해보세요.\n\n출처: 법제처 국가법령정보센터 (www.law.go.kr)`
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
