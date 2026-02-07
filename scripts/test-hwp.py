#!/usr/bin/env python3
"""
HWP 파싱 테스트 스크립트
사용법: source .venv/bin/activate && python scripts/test-hwp.py <hwp파일경로>
"""

import sys
import os

def main():
    if len(sys.argv) < 2:
        print("Usage: python test-hwp.py <hwp_file_path>")
        print("Example: python test-hwp.py sample.hwp")
        sys.exit(1)
    
    hwp_path = sys.argv[1]
    
    if not os.path.exists(hwp_path):
        print(f"Error: File not found: {hwp_path}")
        sys.exit(1)
    
    try:
        from hwp5.hwp5html import open_hwpfile
        from hwp5.plat import get_olestorage_class
        
        # OLE Storage 클래스 가져오기
        OleStorage = get_olestorage_class()
        
        print(f"Parsing: {hwp_path}")
        print("-" * 50)
        
        # HWP 파일 열기
        with open(hwp_path, 'rb') as f:
            ole = OleStorage(f)
            
            # 문서 정보 출력
            print("Streams found:")
            for entry in ole.listdir():
                print(f"  - {'/'.join(entry)}")
        
        print("-" * 50)
        print("✓ HWP parsing successful!")
        
    except ImportError as e:
        print(f"Import error: {e}")
        print("Make sure pyhwp is installed: pip install pyhwp")
        sys.exit(1)
    except Exception as e:
        print(f"Error parsing HWP: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
