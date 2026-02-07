/**
 * Ollama API 클라이언트
 * 로컬 Ollama 서버와 통신
 */

export interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export interface ChatResponse {
	model: string;
	created_at: string;
	message: Message;
	done: boolean;
}

export interface Model {
	name: string;
	modified_at: string;
	size: number;
}

export interface PullProgress {
	status: string;
	digest?: string;
	total?: number;
	completed?: number;
}

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Ollama 서버 상태 확인
 */
export async function isHealthy(): Promise<boolean> {
	try {
		const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
		return response.ok;
	} catch {
		return false;
	}
}

/**
 * 설치된 모델 목록 조회
 */
export async function listModels(): Promise<Model[]> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
	if (!response.ok) {
		throw new Error('Failed to fetch models');
	}
	const data = await response.json();
	return data.models || [];
}

/**
 * 채팅 완성 (스트리밍)
 */
export async function* chat(
	model: string,
	messages: Message[],
	options?: { temperature?: number }
): AsyncGenerator<ChatResponse> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model,
			messages,
			stream: true,
			options: {
				temperature: options?.temperature ?? 0.7
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Chat request failed: ${response.statusText}`);
	}

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('No response body');
	}

	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';

		for (const line of lines) {
			if (line.trim()) {
				try {
					const json = JSON.parse(line);
					yield json as ChatResponse;
				} catch {
					// JSON 파싱 실패 무시
				}
			}
		}
	}
}

/**
 * 모델 다운로드 (스트리밍)
 */
export async function* pullModel(name: string): AsyncGenerator<PullProgress> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name, stream: true })
	});

	if (!response.ok) {
		throw new Error(`Pull request failed: ${response.statusText}`);
	}

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error('No response body');
	}

	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';

		for (const line of lines) {
			if (line.trim()) {
				try {
					const json = JSON.parse(line);
					yield json as PullProgress;
				} catch {
					// JSON 파싱 실패 무시
				}
			}
		}
	}
}

/**
 * 기본 모델 설정
 */
export const DEFAULT_MODEL = 'qwen2.5:3b-instruct';

/**
 * 시스템 프롬프트
 */
export const SYSTEM_PROMPT = `당신은 OpenKlaw, 한국 사무직을 위한 AI 비서입니다.

## 역할
- 한국어로 자연스럽게 대화합니다
- 비즈니스 이메일 작성을 돕습니다
- 문서 요약 및 분석을 합니다
- 업무 관련 질문에 답변합니다

## 특징
- 존댓말을 사용합니다
- 간결하고 명확하게 답변합니다
- 한국 비즈니스 문화를 이해합니다

## 제한
- 개인정보를 요청하지 않습니다
- 불확실한 정보는 솔직히 모른다고 합니다`;
