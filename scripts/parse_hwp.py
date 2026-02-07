#!/usr/bin/env python3
"""HWP 파일 텍스트 추출 스크립트"""

import sys
import json

try:
    from hwp5.hwp5txt import main as hwp5txt_main
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "pyhwp가 설치되어 있지 않습니다. pip install pyhwp로 설치해주세요."
    }))
    sys.exit(1)


def extract_text(hwp_path: str) -> str:
    """HWP 파일에서 텍스트 추출"""
    from io import StringIO
    import contextlib
    
    output = StringIO()
    with contextlib.redirect_stdout(output):
        try:
            hwp5txt_main(args=[hwp_path])
        except SystemExit:
            pass
    
    return output.getvalue()


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
        if not text.strip():
            print(json.dumps({
                "success": False,
                "error": "텍스트 추출 실패: 빈 결과"
            }, ensure_ascii=False))
            sys.exit(1)
            
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
