/**
 * 이메일 작성 스킬
 * 비즈니스 이메일 초안 생성
 */

import { chat, DEFAULT_MODEL, type Message } from '$lib/ollama';

export interface EmailParams {
	to?: string;
	subject?: string;
	tone?: 'formal' | 'casual' | 'polite';
	context: string;
}

export interface EmailResult {
	subject: string;
	body: string;
}

const EMAIL_SYSTEM_PROMPT = `당신은 한국 비즈니스 이메일 작성 전문가입니다.

## 규칙
1. 한국 비즈니스 문화에 맞는 격식체 사용
2. 상대방 호칭은 "님"으로 통일 (예: 김과장님)
3. 간결하고 명확한 문장
4. 인사말로 시작, 마무리 인사로 종료

## 이메일 구조
1. 인사말 (예: "안녕하세요, [팀/부서] [이름]입니다.")
2. 용건 (핵심 내용)
3. 상세 내용 (필요시)
4. 요청 사항 (필요시)
5. 마무리 인사 (예: "감사합니다.", "검토 부탁드립니다.")

## 톤
- formal: 격식체, 공식적 (임원, 외부 고객)
- polite: 정중한 존댓말 (동료, 협력사)
- casual: 가벼운 존댓말 (친한 동료)

JSON 형식으로 응답하세요:
{
  "subject": "이메일 제목",
  "body": "이메일 본문"
}`;

/**
 * 이메일 초안 생성
 */
export async function generateEmail(params: EmailParams): Promise<EmailResult> {
	const userPrompt = buildPrompt(params);

	const messages: Message[] = [
		{ role: 'system', content: EMAIL_SYSTEM_PROMPT },
		{ role: 'user', content: userPrompt }
	];

	let response = '';

	for await (const chunk of chat(DEFAULT_MODEL, messages, { temperature: 0.7 })) {
		if (chunk.message?.content) {
			response += chunk.message.content;
		}
	}

	return parseEmailResponse(response);
}

function buildPrompt(params: EmailParams): string {
	let prompt = `다음 상황에 맞는 비즈니스 이메일을 작성해주세요:\n\n`;

	if (params.to) {
		prompt += `받는 사람: ${params.to}\n`;
	}

	if (params.subject) {
		prompt += `제목 키워드: ${params.subject}\n`;
	}

	prompt += `톤: ${params.tone || 'polite'}\n`;
	prompt += `\n상황/내용:\n${params.context}`;

	return prompt;
}

function parseEmailResponse(response: string): EmailResult {
	try {
		// JSON 블록 추출
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);
			return {
				subject: parsed.subject || '제목 없음',
				body: parsed.body || response
			};
		}
	} catch {
		// JSON 파싱 실패 시 전체 응답을 본문으로
	}

	return {
		subject: '이메일',
		body: response
	};
}

/**
 * 이메일 요청인지 감지
 */
export function isEmailRequest(input: string): boolean {
	const keywords = ['이메일', '메일', 'email', '작성해', '써줘', '보내'];
	const lowerInput = input.toLowerCase();
	return keywords.some((kw) => lowerInput.includes(kw));
}
