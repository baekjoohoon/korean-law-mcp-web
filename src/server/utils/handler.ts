/**
 * 핸들러 타입 정의
 * Cloudflare Pages Functions용 타입
 */

import { TokenData } from './validate-token'

// Cloudflare Pages Functions types
declare global {
  interface EventContext<Env, Path extends string, Data> {
    request: Request
    env: Env
    params: Record<string, string>
    data: Data
    waitUntil: (promise: Promise<unknown>) => void
    passThroughOnException: () => void
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>
  }

  interface Fetcher {
    fetch: typeof fetch
  }
}

export type Handler = (context: EventContext<Env, string, unknown>) => Promise<Response>

export interface Env {
  DASHSCOPE_API_KEY: string
  MCP_ENDPOINT: string
  LAW_OC: string
  ASSETS: Fetcher
}

export interface AuthenticatedContext extends EventContext<Env, string, unknown> {
  tokenData: TokenData
}
