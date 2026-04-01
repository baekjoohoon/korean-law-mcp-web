/**
 * 인증 API 엔드포인트
 */
export interface Env {
  DASHSCOPE_API_KEY: string
  MCP_ENDPOINT: string
  LAW_OC: string
  LOGIN_PASSWORD: string
}

const VALID_PASSWORD = '0629'

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (context.request.method !== 'POST') {
    return Response.json(
      { success: false, message: '허용되지 않은 메서드입니다' },
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    const body = await context.request.json()
    const { password } = body

    if (!password) {
      return Response.json(
        { success: false, message: '비밀번호를 입력해주세요' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (password === VALID_PASSWORD) {
      const tokenData = {
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        userId: 'admin',
      }
      const token = btoa(JSON.stringify(tokenData))

      return Response.json(
        {
          success: true,
          token,
          message: '로그인 성공',
          expiresAt: new Date(tokenData.expiresAt).toISOString(),
        },
        { headers: corsHeaders }
      )
    } else {
      return Response.json(
        { success: false, message: '비밀번호가 일치하지 않습니다' },
        { status: 401, headers: corsHeaders }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return Response.json(
      { success: false, message: '잘못된 요청입니다' },
      { status: 400, headers: corsHeaders }
    )
  }
}
