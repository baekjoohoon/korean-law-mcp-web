/**
 * 검색 API 엔드포인트 - Korean Law MCP 직접 연동
 */
export interface Env {
  DASHSCOPE_API_KEY: string
  MCP_ENDPOINT: string
  LAW_OC: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 법제처 API 기반 법률 검색
async function searchLaw(query: string, lawOc: string): Promise<any> {
  try {
    const url = new URL('https://www.law.go.kr/LSW/lawsSearch.do')
    url.searchParams.set('lsKwd', query)
    url.searchParams.set('OC', lawOc)
    url.searchParams.set('returnFormat', 'JSON')
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Law API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Law search error:', error)
    return null
  }
}

// Qwen API 를 사용한 AI 답변 생성
async function generateAIResponse(
  query: string,
  lawData: string,
  apiKey: string
): Promise<string> {
  const SYSTEM_PROMPT = `당신은 한국 법률 전문 AI 어시스턴트입니다. 
사용자의 법률 질의에 대해 정확하고 신뢰할 수 있는 정보를 제공해야 합니다.

응답 가이드라인:
1. 제공된 법령 정보를 기반으로 사실에 입각한 답변을 작성하세요
2. 추측이나 불확실한 정보는 명시적으로 그 한계를 밝히세요
3. 법률 조항은 정확한 조문 번호를 인용하세요
4. 답변은 한국어로 작성하세요
5. 전문적인 법률 용어를 사용하되, 필요한 경우 설명을 추가하세요

중요: 이 응답은 법률 자문이 아닌 정보 제공 목적입니다.`

  const userPrompt = `사용자 질의: ${query}

${lawData ? `관련 법령 정보:\n${lawData}` : '관련 법령 정보를 찾을 수 없습니다.'}

위 정보를 바탕으로 사용자 질문에 답변해주세요.`

  try {
    const response = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '답변을 생성할 수 없습니다.'
  } catch (error) {
    console.error('Qwen API error:', error)
    return 'AI 답변 생성 중 오류가 발생했습니다.'
  }
}

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  // CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  if (context.request.method !== 'POST') {
    return Response.json(
      { success: false, message: '허용되지 않은 메서드입니다' },
      { status: 405, headers: CORS_HEADERS }
    )
  }

  try {
    const body = await context.request.json()
    const { query } = body

    if (!query) {
      return Response.json(
        { success: false, message: '검색어를 입력해주세요' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const { DASHSCOPE_API_KEY, LAW_OC } = context.env

    // Step 1: Search laws
    const lawResults = await searchLaw(query, LAW_OC)
    let lawData = ''
    const sources: Array<{ type: string; title: string; preview: string; content: string }> = []

    if (lawResults && lawResults.result) {
      const laws = lawResults.result
      if (Array.isArray(laws) && laws.length > 0) {
        lawData = laws.map((law: any) => {
          const title = law.lawNm || law.law_name || '알 수 없는 법령'
          const content = `법령명: ${title}\n${law.lawContents || law.law_content || ''}`
          
          sources.push({
            type: 'law',
            title: '관련 법령',
            preview: content.substring(0, 200) + '...',
            content,
          })
          
          return content
        }).join('\n\n')
      }
    }

    // Step 2: Generate AI response
    const aiResponse = await generateAIResponse(query, lawData, DASHSCOPE_API_KEY)

    // Step 3: Add disclaimer
    const disclaimer = `\n\n---\n⚠️ 면책 조항: 이 답변은 AI 가 생성한 법률 정보이며, 법적 조언이 아닙니다. 
정확한 법적 조언은 변호사 등 전문가와 상담하시기 바랍니다.`

    return Response.json({
      success: true,
      answer: aiResponse + disclaimer,
      sources: sources.map(s => ({
        type: s.type,
        title: s.title,
        preview: s.preview,
      })),
      query,
      timestamp: new Date().toISOString(),
    }, { headers: CORS_HEADERS })

  } catch (error) {
    console.error('Search error:', error)
    return Response.json(
      { 
        success: false, 
        message: '검색 처리 중 오류가 발생했습니다',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
