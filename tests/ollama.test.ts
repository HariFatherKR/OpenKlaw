import { describe, it, expect, vi } from 'vitest';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Ollama Client', () => {
	it('should check health correctly', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ models: [] })
		});

		const { isHealthy } = await import('../src/lib/ollama/client');
		const result = await isHealthy();
		
		expect(result).toBe(true);
	});

	it('should return false when Ollama is not running', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

		const { isHealthy } = await import('../src/lib/ollama/client');
		const result = await isHealthy();
		
		expect(result).toBe(false);
	});

	it('should have default model defined', async () => {
		const { DEFAULT_MODEL } = await import('../src/lib/ollama/client');
		
		expect(DEFAULT_MODEL).toBe('qwen2.5:3b-instruct');
	});

	it('should have system prompt defined', async () => {
		const { SYSTEM_PROMPT } = await import('../src/lib/ollama/client');
		
		expect(SYSTEM_PROMPT).toContain('OpenKlaw');
		expect(SYSTEM_PROMPT).toContain('한국어');
	});
});
