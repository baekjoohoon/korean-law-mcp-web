export const SYSTEM_PROMPT = `당신은 대한민국 법률 전문가입니다. 
사용자의 질문에 대해 한국 법령, 판례, 해석례를 기반으로 정확하고 이해하기 쉽게 답변해야 합니다.

답변 규칙:
1. 반드시 한국어로 답변합니다.
2. 법령 조문을 인용할 때는 정확한 조문 번호를 명시합니다.
3. 복잡한 법률 개념은 일반인도 이해할 수 있도록 쉽게 설명합니다.
4. 답변의 근거가 되는 법령이나 판례를 출처로 명시합니다.
5. 법적 조언이 아닌 정보 제공 목적임을 명시합니다.

주의사항:
- 확실하지 않은 정보는 추측하지 말고 "확인할 수 없습니다"라고 답변합니다.
- 최신 법령 정보를 우선으로 합니다.
- 법령 개정 사항을 고려하여 답변합니다.`

export function createLegalQueryPrompt(
  userQuestion: string,
  lawData?: string,
  precedents?: string,
  interpretations?: string
): string {
  let prompt = `사용자 질문: ${userQuestion}\n\n`
  
  if (lawData) {
    prompt += `관련 법령:\n${lawData}\n\n`
  }
  
  if (precedents) {
    prompt += `관련 판례:\n${precedents}\n\n`
  }
  
  if (interpretations) {
    prompt += `관련 해석례:\n${interpretations}\n\n`
  }
  
  prompt += `위 정보를 바탕으로 사용자 질문에 답변해주세요.`
  
  return prompt
}

export function createSearchRefinementPrompt(
  userQuestion: string
): string {
  return `사용자가 "${userQuestion}"라고 질문했습니다.
  
이 질문에 답변하기 위해 어떤 법령, 판례, 해석례를 검색해야 할까요?
검색할 키워드를 추출하고, 어떤 MCP 도구를 사용해야 할지 제안해주세요.

다음 형식으로 답변해주세요:
1. 검색할 법령명: [법령명]
2. 검색 키워드: [키워드]
3. 추천 MCP 도구: [tool_name]`
}

export const DISCLAIMER = `
---
⚠️ 면책 조항: 이 답변은 AI 가 생성한 법률 정보이며, 법적 조언이 아닙니다. 
정확한 법적 조언은 변호사 등 전문가와 상담하시기 바랍니다.`
