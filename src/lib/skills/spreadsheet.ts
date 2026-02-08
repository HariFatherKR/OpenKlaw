/**
 * 스프레드시트 분석 스킬
 * 엑셀/CSV 파일 파싱 및 AI 분석
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface SpreadsheetData {
	fileName: string;
	fileType: 'xlsx' | 'xls' | 'csv';
	sheetName?: string;
	headers: string[];
	rows: Record<string, unknown>[];
	totalRows: number;
	totalColumns: number;
}

export interface ParseOptions {
	maxPreviewRows?: number;
	maxAIRows?: number;
}

const DEFAULT_OPTIONS: ParseOptions = {
	maxPreviewRows: 10,
	maxAIRows: 100
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * 파일 형식 감지
 */
export function detectFileType(fileName: string): 'xlsx' | 'xls' | 'csv' | null {
	const ext = fileName.toLowerCase().split('.').pop();
	if (ext === 'xlsx') return 'xlsx';
	if (ext === 'xls') return 'xls';
	if (ext === 'csv') return 'csv';
	return null;
}

/**
 * 파일 크기 검증
 */
export function validateFileSize(file: File): { valid: boolean; error?: string } {
	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `파일 크기가 너무 큽니다 (${(file.size / 1024 / 1024).toFixed(1)}MB). 최대 10MB까지 지원됩니다.`
		};
	}
	return { valid: true };
}

/**
 * 엑셀 파일 파싱
 */
export async function parseExcel(file: File, options: ParseOptions = {}): Promise<SpreadsheetData> {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const buffer = await file.arrayBuffer();
	const workbook = XLSX.read(buffer, { type: 'array' });

	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];

	// 전체 데이터 추출
	const allRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
		defval: ''
	});

	const headers = allRows.length > 0 ? Object.keys(allRows[0]) : [];

	return {
		fileName: file.name,
		fileType: file.name.toLowerCase().endsWith('.xls') ? 'xls' : 'xlsx',
		sheetName,
		headers,
		rows: allRows.slice(0, opts.maxPreviewRows),
		totalRows: allRows.length,
		totalColumns: headers.length
	};
}

/**
 * CSV 파일 파싱
 */
export function parseCSV(file: File, options: ParseOptions = {}): Promise<SpreadsheetData> {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			encoding: 'UTF-8',
			complete: (results) => {
				const allRows = results.data as Record<string, unknown>[];
				const headers = results.meta.fields || [];

				resolve({
					fileName: file.name,
					fileType: 'csv',
					headers,
					rows: allRows.slice(0, opts.maxPreviewRows),
					totalRows: allRows.length,
					totalColumns: headers.length
				});
			},
			error: (error) => {
				reject(new Error(`CSV 파싱 실패: ${error.message}`));
			}
		});
	});
}

/**
 * 파일 자동 파싱 (형식 자동 감지)
 */
export async function parseSpreadsheet(
	file: File,
	options: ParseOptions = {}
): Promise<SpreadsheetData> {
	const sizeCheck = validateFileSize(file);
	if (!sizeCheck.valid) {
		throw new Error(sizeCheck.error);
	}

	const fileType = detectFileType(file.name);
	if (!fileType) {
		throw new Error('지원하지 않는 파일 형식입니다. xlsx, xls, csv 파일만 지원됩니다.');
	}

	if (fileType === 'csv') {
		return parseCSV(file, options);
	} else {
		return parseExcel(file, options);
	}
}

/**
 * AI 분석용 데이터 요약 생성
 */
export function generateDataSummary(data: SpreadsheetData, maxRows: number = 100): string {
	const sampleRows = data.rows.slice(0, Math.min(maxRows, data.rows.length));

	return `## 스프레드시트 데이터

**파일명**: ${data.fileName}
**시트**: ${data.sheetName || 'N/A'}
**크기**: ${data.totalRows}행 × ${data.totalColumns}열

### 컬럼 (${data.headers.length}개)
${data.headers.map((h) => `- ${h}`).join('\n')}

### 데이터 샘플 (처음 ${sampleRows.length}행)
\`\`\`json
${JSON.stringify(sampleRows, null, 2)}
\`\`\`

위 데이터를 분석해주세요.`;
}

/**
 * 스프레드시트 관련 요청인지 감지
 */
export function isSpreadsheetRequest(input: string): boolean {
	const keywords = [
		'엑셀',
		'excel',
		'csv',
		'스프레드시트',
		'spreadsheet',
		'표',
		'데이터',
		'분석',
		'파일'
	];
	const lowerInput = input.toLowerCase();
	return keywords.some((kw) => lowerInput.includes(kw));
}
