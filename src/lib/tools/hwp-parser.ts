/**
 * HWP 파싱 도구
 * pyhwp를 사용하여 HWP 파일 텍스트 추출
 */

/**
 * HWP 파일에서 텍스트 추출
 * 실제 구현은 Python subprocess 호출 필요
 * 현재는 Tauri 명령으로 구현
 */
export interface HwpParseResult {
	success: boolean;
	text?: string;
	error?: string;
}

/**
 * HWP 파일 파싱 (Tauri 명령어를 통해)
 */
export async function parseHwp(filePath: string): Promise<HwpParseResult> {
	try {
		// Tauri API를 통한 파싱
		if (typeof window !== 'undefined' && '__TAURI__' in window) {
			const { invoke } = await import('@tauri-apps/api/core');
			const result = await invoke<string>('parse_hwp', { path: filePath });
			return { success: true, text: result };
		}

		// 브라우저 환경에서는 파일 읽기만 시도
		return {
			success: false,
			error: 'HWP 파싱은 데스크톱 앱에서만 지원됩니다.'
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'HWP 파싱 실패'
		};
	}
}

/**
 * 파일이 HWP인지 확인
 */
export function isHwpFile(filename: string): boolean {
	return filename.toLowerCase().endsWith('.hwp') || filename.toLowerCase().endsWith('.hwpx');
}

/**
 * HWP 파싱 Python 스크립트
 * scripts/parse_hwp.py로 저장 필요
 */
export const HWP_PARSER_SCRIPT = `#!/usr/bin/env python3
"""HWP 파일 텍스트 추출 스크립트"""

import sys
import json

try:
    from hwp5 import hwp5txt
    from hwp5.hwp5odt import Hwp5ToOdt
    from hwp5.dataio import ParseError
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "pyhwp가 설치되어 있지 않습니다. pip install pyhwp로 설치해주세요."
    }))
    sys.exit(1)

def extract_text(hwp_path: str) -> str:
    """HWP 파일에서 텍스트 추출"""
    try:
        from io import StringIO
        output = StringIO()
        hwp5txt.main(args=[hwp_path], outfile=output)
        return output.getvalue()
    except Exception as e:
        raise Exception(f"HWP 파싱 실패: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "사용법: python parse_hwp.py <hwp_file_path>"
        }))
        sys.exit(1)
    
    hwp_path = sys.argv[1]
    
    try:
        text = extract_text(hwp_path)
        print(json.dumps({
            "success": True,
            "text": text
        }, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }, ensure_ascii=False))
        sys.exit(1)
`;
