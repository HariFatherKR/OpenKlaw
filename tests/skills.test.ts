import { describe, it, expect } from 'vitest';
import { isEmailRequest } from '../src/lib/skills/email';

describe('Email Skill', () => {
	it('should detect email requests', () => {
		expect(isEmailRequest('이메일 써줘')).toBe(true);
		expect(isEmailRequest('메일 작성해줘')).toBe(true);
		expect(isEmailRequest('김과장님께 이메일 보내줘')).toBe(true);
	});

	it('should not detect non-email requests', () => {
		expect(isEmailRequest('안녕하세요')).toBe(false);
		expect(isEmailRequest('오늘 날씨 어때?')).toBe(false);
	});
});
