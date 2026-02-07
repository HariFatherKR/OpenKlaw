/**
 * 채팅 히스토리 저장소
 * localStorage 기반 (MVP)
 * TODO: SQLite로 마이그레이션
 */

import { browser } from '$app/environment';

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

export interface ChatSession {
	id: string;
	title: string;
	messages: ChatMessage[];
	createdAt: Date;
	updatedAt: Date;
}

const STORAGE_KEY = 'openklaw_sessions';

/**
 * 모든 세션 목록 조회
 */
export function getSessions(): ChatSession[] {
	if (!browser) return [];

	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) return [];

		const sessions = JSON.parse(data) as ChatSession[];
		// Date 객체 복원
		return sessions.map((s) => ({
			...s,
			createdAt: new Date(s.createdAt),
			updatedAt: new Date(s.updatedAt),
			messages: s.messages.map((m) => ({
				...m,
				timestamp: new Date(m.timestamp)
			}))
		}));
	} catch {
		return [];
	}
}

/**
 * 특정 세션 조회
 */
export function getSession(sessionId: string): ChatSession | null {
	const sessions = getSessions();
	return sessions.find((s) => s.id === sessionId) || null;
}

/**
 * 세션 저장
 */
export function saveSession(session: ChatSession): void {
	if (!browser) return;

	const sessions = getSessions();
	const index = sessions.findIndex((s) => s.id === session.id);

	if (index >= 0) {
		sessions[index] = session;
	} else {
		sessions.unshift(session);
	}

	// 최대 100개 세션 유지
	const trimmed = sessions.slice(0, 100);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/**
 * 새 세션 생성
 */
export function createSession(): ChatSession {
	const now = new Date();
	return {
		id: crypto.randomUUID(),
		title: formatSessionTitle(now),
		messages: [],
		createdAt: now,
		updatedAt: now
	};
}

/**
 * 세션 삭제
 */
export function deleteSession(sessionId: string): void {
	if (!browser) return;

	const sessions = getSessions();
	const filtered = sessions.filter((s) => s.id !== sessionId);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * 세션 제목 생성
 */
function formatSessionTitle(date: Date): string {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${month}월 ${day}일 ${hours}:${minutes} 대화`;
}

/**
 * 세션 제목 업데이트 (첫 메시지 기반)
 */
export function updateSessionTitle(session: ChatSession): ChatSession {
	if (session.messages.length > 0) {
		const firstUserMessage = session.messages.find((m) => m.role === 'user');
		if (firstUserMessage) {
			// 첫 메시지의 앞 30자를 제목으로
			const title = firstUserMessage.content.slice(0, 30);
			session.title = title + (firstUserMessage.content.length > 30 ? '...' : '');
		}
	}
	return session;
}

/**
 * 세션에 메시지 추가
 */
export function addMessage(session: ChatSession, message: ChatMessage): ChatSession {
	session.messages.push(message);
	session.updatedAt = new Date();
	return updateSessionTitle(session);
}
