import { MCPClient } from './client'

export interface LawSearchResult {
  lawId: string
  mst: string
  lawName: string
  enactmentDate: string
  type: string
}

export interface PrecedentSearchResult {
  id: string
  caseName: string
  caseNumber: string
  court: string
  decisionDate: string
  type: string
}

export class LawTools {
  private client: MCPClient

  constructor(client: MCPClient) {
    this.client = client
  }

  async searchLaw(query: string, display = 20): Promise<string> {
    const result = await this.client.callTool('search_law', { query, display })
    return result.content[0].text
  }

  async getLawText(mst: string, jo?: string): Promise<string> {
    const result = await this.client.callTool('get_law_text', { mst, jo })
    return result.content[0].text
  }

  async searchPrecedents(query: string, court?: string, display = 20): Promise<string> {
    const result = await this.client.callTool('search_precedents', { query, court, display })
    return result.content[0].text
  }

  async searchInterpretations(query: string, display = 20): Promise<string> {
    const result = await this.client.callTool('search_interpretations', { query, display })
    return result.content[0].text
  }

  async suggestLawNames(query: string, display = 10): Promise<string> {
    const result = await this.client.callTool('suggest_law_names', { query, display })
    return result.content[0].text
  }
}
