import { Handler } from '../utils/handler'
import { validateToken, getTokenFromHeader } from '../utils/validate-token'
import { MCPClient } from '../mcp/client'
import { LawTools } from '../mcp/tools'
import { QwenClient, SYSTEM_PROMPT, createLegalQueryPrompt, DISCLAIMER } from '../qwen/client'

export const onRequest: Handler = async (context) => {
  // Check method
  if (context.request.method !== 'POST') {
    return Response.json({
      success: false,
      message: '허용되지 않은 메서드입니다',
    }, { status: 405 })
  }

  // Validate authentication
  const authHeader = context.request.headers.get('Authorization')
  const token = getTokenFromHeader(authHeader)
  
  if (!token) {
    return Response.json({
      success: false,
      message: '인증 토큰이 필요합니다',
    }, { status: 401 })
  }

  const tokenData = validateToken(token)
  if (!tokenData) {
    return Response.json({
      success: false,
      message: '토큰이 만료되었습니다. 다시 로그인해주세요',
    }, { status: 401 })
  }

  try {
    const body = await context.request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return Response.json({
        success: false,
        message: '검색어를 입력해주세요',
      }, { status: 400 })
    }

    // Initialize clients
    const mcpClient = new MCPClient()
    const lawTools = new LawTools(mcpClient)
    const qwenClient = new QwenClient()

    // Step 1: Search for relevant laws
    let lawData = ''
    let precedents = ''
    let interpretations = ''
    const sources: Array<{ type: string; title: string; content: string }> = []

    try {
      // Search laws
      const searchResult = await lawTools.searchLaw(query, 5)
      if (searchResult && !searchResult.includes('검색 결과가 없습니다')) {
        lawData = searchResult
        
        // Extract MST and get full text if available
        const mstMatch = searchResult.match(/MST:\s*(\d+)/)
        if (mstMatch) {
          const lawText = await lawTools.getLawText(mstMatch[1])
          if (lawText) {
            sources.push({
              type: 'law',
              title: '관련 법령',
              content: lawText,
            })
          }
        }
      }
    } catch (error) {
      console.error('Law search error:', error)
    }

    try {
      // Search precedents
      precedents = await lawTools.searchPrecedents(query, undefined, 5)
      if (precedents && !precedents.includes('검색 결과가 없습니다')) {
        sources.push({
          type: 'precedent',
          title: '관련 판례',
          content: precedents,
        })
      }
    } catch (error) {
      console.error('Precedent search error:', error)
    }

    try {
      // Search interpretations
      interpretations = await lawTools.searchInterpretations(query, 5)
      if (interpretations && !interpretations.includes('검색 결과가 없습니다')) {
        sources.push({
          type: 'interpretation',
          title: '관련 해석례',
          content: interpretations,
        })
      }
    } catch (error) {
      console.error('Interpretation search error:', error)
    }

    await mcpClient.disconnect()

    // Step 2: Generate AI response with Qwen
    const userPrompt = createLegalQueryPrompt(query, lawData, precedents, interpretations)
    
    const aiResponse = await qwenClient.chatCompletion([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.5, // Lower temperature for more factual responses
      maxTokens: 3000,
    })

    // Step 3: Format response
    const formattedResponse = aiResponse + DISCLAIMER

    return Response.json({
      success: true,
      answer: formattedResponse,
      sources: sources.map(s => ({
        type: s.type,
        title: s.title,
        preview: s.content.substring(0, 200) + '...',
      })),
      fullSources: sources,
      query,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Search error:', error)
    return Response.json({
      success: false,
      message: '검색 처리 중 오류가 발생했습니다',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }, { status: 500 })
  }
}
