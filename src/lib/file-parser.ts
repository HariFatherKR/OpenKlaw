/**
 * 파일 파서 유틸리티
 * PDF, HWP, Excel, PPT 등 다양한 파일 형식 지원
 */

import * as XLSX from 'xlsx';

export interface ParseResult {
	success: boolean;
	content: string;
	metadata: {
		fileName: string;
		fileType: string;
		fileSize: number;
		pages?: number;
		sheets?: string[];
		slides?: number;
	};
	error?: string;
}

/**
 * 지원하는 파일 확장자
 */
export const SUPPORTED_EXTENSIONS = [
	'txt', 'md', 'csv', 'json',  // 텍스트
	'pdf',                        // PDF
	'hwp', 'hwpx',               // 한글
	'xlsx', 'xls',               // 엑셀
	'ppt', 'pptx'                // 파워포인트
];

/**
 * 파일 확장자 확인
 */
export function getFileExtension(fileName: string): string {
	return fileName.split('.').pop()?.toLowerCase() || '';
}

/**
 * 지원 여부 확인
 */
export function isSupported(fileName: string): boolean {
	const ext = getFileExtension(fileName);
	return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * 파일 크기 포맷
 */
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes}B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * 텍스트 파일 파싱
 */
async function parseTextFile(file: File): Promise<ParseResult> {
	try {
		const content = await file.text();
		return {
			success: true,
			content,
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size
			}
		};
	} catch (error) {
		return {
			success: false,
			content: '',
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size
			},
			error: `텍스트 파일 읽기 실패: ${error}`
		};
	}
}

/**
 * CSV 파일 파싱 (표 형태로)
 */
async function parseCsvFile(file: File): Promise<ParseResult> {
	try {
		const text = await file.text();
		const lines = text.split('\n').filter(line => line.trim());
		const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
		
		// 마크다운 테이블로 변환
		let content = '';
		if (rows.length > 0) {
			// 헤더
			content += '| ' + rows[0].join(' | ') + ' |\n';
			content += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
			// 데이터
			for (let i = 1; i < Math.min(rows.length, 50); i++) {
				content += '| ' + rows[i].join(' | ') + ' |\n';
			}
			if (rows.length > 50) {
				content += `\n... (${rows.length - 50}행 생략)`;
			}
		}
		
		return {
			success: true,
			content,
			metadata: {
				fileName: file.name,
				fileType: 'csv',
				fileSize: file.size
			}
		};
	} catch (error) {
		return {
			success: false,
			content: '',
			metadata: {
				fileName: file.name,
				fileType: 'csv',
				fileSize: file.size
			},
			error: `CSV 파일 읽기 실패: ${error}`
		};
	}
}

/**
 * Excel 파일 파싱
 */
async function parseExcelFile(file: File): Promise<ParseResult> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, { type: 'array' });
		
		let content = '';
		const sheetNames = workbook.SheetNames;
		
		for (const sheetName of sheetNames.slice(0, 5)) {  // 최대 5개 시트
			const sheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
			
			content += `\n## 📊 시트: ${sheetName}\n\n`;
			
			if (jsonData.length > 0) {
				// 헤더
				const headers = jsonData[0] || [];
				content += '| ' + headers.map(h => String(h || '')).join(' | ') + ' |\n';
				content += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
				
				// 데이터 (최대 30행)
				for (let i = 1; i < Math.min(jsonData.length, 31); i++) {
					const row = jsonData[i] || [];
					content += '| ' + row.map(cell => String(cell || '')).join(' | ') + ' |\n';
				}
				
				if (jsonData.length > 31) {
					content += `\n... (${jsonData.length - 31}행 생략)\n`;
				}
			}
		}
		
		if (sheetNames.length > 5) {
			content += `\n... (${sheetNames.length - 5}개 시트 생략)`;
		}
		
		return {
			success: true,
			content,
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size,
				sheets: sheetNames
			}
		};
	} catch (error) {
		return {
			success: false,
			content: '',
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size
			},
			error: `Excel 파일 읽기 실패: ${error}`
		};
	}
}

/**
 * PDF 파일 파싱 (브라우저에서는 제한적)
 */
async function parsePdfFile(file: File): Promise<ParseResult> {
	// 브라우저 환경에서 pdf-parse는 작동하지 않음
	// PDF.js를 사용하거나 백엔드에서 처리해야 함
	try {
		// 일단 파일 정보만 반환
		return {
			success: true,
			content: `📄 PDF 파일이 업로드되었습니다.\n\n` +
				`파일명: ${file.name}\n` +
				`크기: ${formatFileSize(file.size)}\n\n` +
				`⚠️ PDF 내용 추출은 서버 연동 후 지원 예정입니다.\n` +
				`현재는 파일 정보만 표시됩니다.`,
			metadata: {
				fileName: file.name,
				fileType: 'pdf',
				fileSize: file.size
			}
		};
	} catch (error) {
		return {
			success: false,
			content: '',
			metadata: {
				fileName: file.name,
				fileType: 'pdf',
				fileSize: file.size
			},
			error: `PDF 파일 처리 실패: ${error}`
		};
	}
}

/**
 * HWP 파일 파싱
 */
async function parseHwpFile(file: File): Promise<ParseResult> {
	// HWP는 복잡한 바이너리 포맷 - Python pyhwp 또는 별도 서비스 필요
	try {
		return {
			success: true,
			content: `📝 한글(HWP) 파일이 업로드되었습니다.\n\n` +
				`파일명: ${file.name}\n` +
				`크기: ${formatFileSize(file.size)}\n\n` +
				`⚠️ HWP 파일 파싱은 Python 서비스 연동 후 완전 지원 예정입니다.\n` +
				`현재는 파일 정보만 표시됩니다.`,
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size
			}
		};
	} catch (error) {
		return {
			success: false,
			content: '',
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size
			},
			error: `HWP 파일 처리 실패: ${error}`
		};
	}
}

/**
 * PPT 파일 파싱
 */
async function parsePptFile(file: File): Promise<ParseResult> {
	// PPTX는 ZIP 기반 XML - 브라우저에서 직접 파싱 가능
	try {
		if (file.name.endsWith('.pptx')) {
			// PPTX 파싱 시도
			const arrayBuffer = await file.arrayBuffer();
			const JSZip = (await import('jszip')).default;
			const zip = await JSZip.loadAsync(arrayBuffer);
			
			let content = '📊 프레젠테이션 내용:\n\n';
			let slideCount = 0;
			
			// 슬라이드 XML 파일 찾기
			const slideFiles = Object.keys(zip.files)
				.filter(name => name.match(/ppt\/slides\/slide\d+\.xml/))
				.sort((a, b) => {
					const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
					const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
					return numA - numB;
				});
			
			for (const slidePath of slideFiles.slice(0, 20)) {  // 최대 20슬라이드
				slideCount++;
				const slideXml = await zip.file(slidePath)?.async('string');
				if (slideXml) {
					// 간단한 텍스트 추출 (XML에서 <a:t> 태그 내용)
					const textMatches = slideXml.match(/<a:t>([^<]*)<\/a:t>/g);
					if (textMatches) {
						const texts = textMatches
							.map(m => m.replace(/<\/?a:t>/g, ''))
							.filter(t => t.trim())
							.join(' ');
						if (texts.trim()) {
							content += `### 슬라이드 ${slideCount}\n${texts}\n\n`;
						}
					}
				}
			}
			
			if (slideFiles.length > 20) {
				content += `\n... (${slideFiles.length - 20}개 슬라이드 생략)`;
			}
			
			return {
				success: true,
				content,
				metadata: {
					fileName: file.name,
					fileType: 'pptx',
					fileSize: file.size,
					slides: slideFiles.length
				}
			};
		} else {
			// 구버전 PPT (바이너리)
			return {
				success: true,
				content: `📊 파워포인트 파일이 업로드되었습니다.\n\n` +
					`파일명: ${file.name}\n` +
					`크기: ${formatFileSize(file.size)}\n\n` +
					`⚠️ 구버전 PPT(.ppt) 파일은 PPTX로 변환 후 업로드해주세요.`,
				metadata: {
					fileName: file.name,
					fileType: 'ppt',
					fileSize: file.size
				}
			};
		}
	} catch (error) {
		return {
			success: false,
			content: '',
			metadata: {
				fileName: file.name,
				fileType: getFileExtension(file.name),
				fileSize: file.size
			},
			error: `PPT 파일 처리 실패: ${error}`
		};
	}
}

/**
 * 메인 파서 함수
 */
export async function parseFile(file: File): Promise<ParseResult> {
	const ext = getFileExtension(file.name);
	
	switch (ext) {
		case 'txt':
		case 'md':
		case 'json':
			return parseTextFile(file);
		
		case 'csv':
			return parseCsvFile(file);
		
		case 'xlsx':
		case 'xls':
			return parseExcelFile(file);
		
		case 'pdf':
			return parsePdfFile(file);
		
		case 'hwp':
		case 'hwpx':
			return parseHwpFile(file);
		
		case 'ppt':
		case 'pptx':
			return parsePptFile(file);
		
		default:
			return {
				success: false,
				content: '',
				metadata: {
					fileName: file.name,
					fileType: ext,
					fileSize: file.size
				},
				error: `지원하지 않는 파일 형식: .${ext}`
			};
	}
}
