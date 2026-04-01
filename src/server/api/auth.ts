/**
 * 인증 API 구현
 * 간단한 비밀번호 기반 인증 (데이터베이스 없음)
 */

import { Handler } from '../utils/handler'

const VALID_PASSWORD = process.env.LOGIN_PASSWORD || '0629'

// Add validation
if (!process.env.LOGIN_PASSWORD) {
  console.warn('LOGIN_PASSWORD not set, using default (insecure for production)')
}

export const onRequest: Handler = async (context) => {
  if (context.request.method !== 'POST') {
    return Response.json(
      {
        success: false,
        message: '허용되지 않은 메서드입니다',
      },
      { status: 405 },
    )
  }

  try {
    const body = await context.request.json()
    const { password } = body

    if (!password) {
      return Response.json(
        {
          success: false,
          message: '비밀번호를 입력해주세요',
        },
        { status: 400 },
      )
    }

    if (password === VALID_PASSWORD) {
      // Create token with timestamp and expiry
      const tokenData = {
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        userId: 'admin',
      }

      // Simple base64 encoding (production would use JWT)
      const token = btoa(JSON.stringify(tokenData))

      return Response.json({
        success: true,
        token,
        message: '로그인 성공',
        expiresAt: new Date(tokenData.expiresAt).toISOString(),
      })
    } else {
      return Response.json(
        {
          success: false,
          message: '비밀번호가 일치하지 않습니다',
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return Response.json(
      {
        success: false,
        message: '잘못된 요청입니다',
      },
      { status: 400 },
    )
  }
}
