export interface TokenData {
  timestamp: number
  expiresAt: number
  userId: string
}

export function validateToken(token: string): TokenData | null {
  try {
    const decoded = atob(token)
    const data = JSON.parse(decoded) as TokenData

    // Check if token is expired
    if (Date.now() > data.expiresAt) {
      return null
    }

    return data
  } catch {
    return null
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}
