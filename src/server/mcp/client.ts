import { JSONRPCRequest, JSONRPCResponse, InitializeRequest, ToolCallRequest, ToolCallResult } from './protocol'

const MCP_ENDPOINT = 'https://korean-law-mcp.fly.dev/mcp'
const PROTOCOL_VERSION = '2025-06-18'

export class MCPClient {
  private sessionId: string | null = null
  private requestId = 0

  async initialize(): Promise<void> {
    const initRequest: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: ++this.requestId,
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: {
          name: 'korean-law-web',
          version: '1.0.0',
        },
      } satisfies InitializeRequest,
    }

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'MCP-Protocol-Version': PROTOCOL_VERSION,
      },
      body: JSON.stringify(initRequest),
    })

    if (!response.ok) {
      throw new Error(`MCP initialization failed: ${response.status}`)
    }

    this.sessionId = response.headers.get('Mcp-Session-Id')
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<ToolCallResult> {
    if (!this.sessionId) {
      await this.initialize()
    }

    const toolRequest: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: ++this.requestId,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      } satisfies ToolCallRequest,
    }

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'MCP-Protocol-Version': PROTOCOL_VERSION,
        'Mcp-Session-Id': this.sessionId!,
      },
      body: JSON.stringify(toolRequest),
    })

    if (!response.ok) {
      throw new Error(`MCP tool call failed: ${response.status}`)
    }

    const data = await response.json() as JSONRPCResponse
    
    if ('error' in data && data.error) {
      throw new Error(`MCP error: ${data.error.message}`)
    }

    return data.result as ToolCallResult
  }

  async disconnect(): Promise<void> {
    this.sessionId = null
    this.requestId = 0
  }
}
