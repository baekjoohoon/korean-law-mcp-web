import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const DASHSCOPE_CONFIG = {
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
}

// Validate at startup
if (!DASHSCOPE_CONFIG.apiKey) {
  throw new Error('DASHSCOPE_API_KEY environment variable is required')
}

/**
 * 시스템 프롬프트 - 한국 법률 전문 AI 어시스턴트
 */
export const SYSTEM_PROMPT = `당신은 한국 법률 전문 AI 어시스턴트입니다. 
사용자의 법률 질의에 대해 정확하고 신뢰할 수 있는 정보를 제공해야 합니다.

응답 가이드라인:
1. 제공된 법령, 판례, 해석례를 기반으로 사실에 입각한 답변을 작성하세요
2. 추측이나 불확실한 정보는 명시적으로 그 한계를 밝히세요
3. 법률 조항은 정확한 조문 번호를 인용하세요
4. 판례는 사건번호와 법원을 명시하세요
5. 전문적인 법률 용어를 사용하되, 필요한 경우 설명을 추가하세요
6. 답변은 한국어로 작성하세요

중요: 이 응답은 법률 자문이 아닌 정보 제공 목적입니다. 구체적인 법률 문제는 변호사와 상담하세요.`

/**
 * 법률 질의용 프롬프트 생성
 */
export function createLegalQueryPrompt(
  query: string,
  lawData: string,
  precedents: string,
  interpretations: string,
): string {
  const parts: string[] = [`사용자 질의: ${query}`]

  if (lawData) {
    parts.push(`\n## 관련 법령\n${lawData}`)
  }

  if (precedents) {
    parts.push(`\n## 관련 판례\n${precedents}`)
  }

  if (interpretations) {
    parts.push(`\n## 관련 해석례\n${interpretations}`)
  }

  parts.push(`\n\n위 정보를 바탕으로 사용자의 질의에 대해 상세하게 답변해주세요.`)

  return parts.join('')
}

/**
 * 법률 면책 조항
 */
export const DISCLAIMER = `\n\n---
⚠️ **면책 조항**: 본 응답은 정보 제공 목적으로만 작성되었으며, 법률 자문을 대체할 수 없습니다. 
구체적인 법률 문제에 대해서는 반드시 자격을 갖춘 변호사나 법률 전문가와 상담하시기 바랍니다.`

export class QwenClient {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: DASHSCOPE_CONFIG.apiKey,
      baseURL: DASHSCOPE_CONFIG.baseURL,
      timeout: 60000,
      maxRetries: 2,
      dangerouslyAllowBrowser: true,
    })
  }

  async chatCompletion(
    messages: ChatCompletionMessageParam[],
    options?: {
      temperature?: number
      maxTokens?: number
    },
  ): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: DASHSCOPE_CONFIG.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        stream: false,
      })

      return completion.choices[0]?.message?.content ?? ''
    } catch (error: unknown) {
      if (error instanceof OpenAI.APIError && error.status === 429) {
        // Rate limit - retry with exponential backoff
        await this.delay(1000)
        return this.chatCompletion(messages, options)
      }
      throw error
    }
  }

  async chatCompletionStream(
    messages: ChatCompletionMessageParam[],
    onChunk: (chunk: string) => void,
    options?: {
      temperature?: number
      maxTokens?: number
    },
  ): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: DASHSCOPE_CONFIG.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
      stream: true,
      stream_options: { include_usage: true },
    })

    let fullContent = ''

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? ''
      if (delta) {
        fullContent += delta
        onChunk(delta)
      }
    }

    return fullContent
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
