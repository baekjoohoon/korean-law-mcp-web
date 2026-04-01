export interface JSONRPCRequest {
  jsonrpc: '2.0'
  id: number | string
  method: string
  params?: unknown
}

export interface JSONRPCResponse {
  jsonrpc: '2.0'
  id: number | string
  result?: unknown
  error?: {
    code: number
    message: string
    data?: unknown
  }
}

export interface InitializeRequest {
  protocolVersion: string
  capabilities: Record<string, unknown>
  clientInfo: {
    name: string
    version: string
  }
}

export interface ToolCallRequest {
  name: string
  arguments: Record<string, unknown>
}

export interface ToolCallResult {
  content: Array<{
    type: string
    text: string
  }>
}
