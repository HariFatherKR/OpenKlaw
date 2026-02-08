import { describe, it, expect } from 'vitest';
import {
	detectFileType,
	validateFileSize,
	isSpreadsheetRequest,
	generateDataSummary,
	type SpreadsheetData
} from '../src/lib/skills/spreadsheet';

describe('Spreadsheet Skill', () => {
	describe('detectFileType', () => {
		it('should detect xlsx files', () => {
			expect(detectFileType('data.xlsx')).toBe('xlsx');
			expect(detectFileType('매출데이터.XLSX')).toBe('xlsx');
		});

		it('should detect xls files', () => {
			expect(detectFileType('legacy.xls')).toBe('xls');
		});

		it('should detect csv files', () => {
			expect(detectFileType('export.csv')).toBe('csv');
			expect(detectFileType('data.CSV')).toBe('csv');
		});

		it('should return null for unsupported files', () => {
			expect(detectFileType('document.pdf')).toBe(null);
			expect(detectFileType('image.png')).toBe(null);
			expect(detectFileType('noextension')).toBe(null);
		});
	});

	describe('validateFileSize', () => {
		it('should accept files under 10MB', () => {
			const smallFile = { size: 5 * 1024 * 1024 } as File;
			expect(validateFileSize(smallFile)).toEqual({ valid: true });
		});

		it('should reject files over 10MB', () => {
			const largeFile = { size: 15 * 1024 * 1024 } as File;
			const result = validateFileSize(largeFile);
			expect(result.valid).toBe(false);
			expect(result.error).toContain('15.0MB');
		});
	});

	describe('isSpreadsheetRequest', () => {
		it('should detect spreadsheet-related requests', () => {
			expect(isSpreadsheetRequest('엑셀 파일 분석해줘')).toBe(true);
			expect(isSpreadsheetRequest('CSV 데이터 요약')).toBe(true);
			expect(isSpreadsheetRequest('이 표 분석해줘')).toBe(true);
			expect(isSpreadsheetRequest('데이터 확인해봐')).toBe(true);
		});

		it('should not detect non-spreadsheet requests', () => {
			expect(isSpreadsheetRequest('안녕하세요')).toBe(false);
			expect(isSpreadsheetRequest('오늘 점심 뭐 먹지')).toBe(false);
		});
	});

	describe('generateDataSummary', () => {
		it('should generate a summary string', () => {
			const testData: SpreadsheetData = {
				fileName: 'test.xlsx',
				fileType: 'xlsx',
				sheetName: 'Sheet1',
				headers: ['이름', '나이', '도시'],
				rows: [
					{ 이름: '김철수', 나이: 30, 도시: '서울' },
					{ 이름: '이영희', 나이: 25, 도시: '부산' }
				],
				totalRows: 100,
				totalColumns: 3
			};

			const summary = generateDataSummary(testData);

			expect(summary).toContain('test.xlsx');
			expect(summary).toContain('Sheet1');
			expect(summary).toContain('100행');
			expect(summary).toContain('3열');
			expect(summary).toContain('이름');
			expect(summary).toContain('김철수');
		});
	});
});
