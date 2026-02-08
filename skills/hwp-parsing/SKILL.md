---
name: hwp-parsing
description: Use when user uploads or mentions HWP/HWPX files, asks to read 한글 documents, or needs to extract content from Korean word processor files
---

# HWP 파싱

## Overview

HWP/HWPX 파일에서 텍스트와 표를 추출합니다. hwpparser CLI를 사용합니다.

## When to Use

- 사용자가 HWP/HWPX 파일을 업로드했을 때
- "한글 파일 읽어줘", "HWP 내용 확인해줘" 요청
- 공문, 보고서, 양식 등 한글 문서 분석 필요 시

## Commands

```bash
# 기본 텍스트 추출 (표는 <표>로 표시)
hwpparser text input.hwp

# 표 포함 추출 (마크다운 테이블) ⭐ 권장
hwpparser rich-text input.hwp

# PDF 변환
hwpparser convert input.hwp output.pdf
```

## Quick Reference

| 명령 | 용도 | 속도 |
|------|------|------|
| `text` | 빠른 텍스트 추출 | 빠름 |
| `rich-text` | 표 포함 추출 | 중간 |
| `convert` | PDF/HTML 변환 | 느림 |

## 워크플로우

```
HWP 파일 수신
    ↓
표가 있는 문서인가?
    ↓ YES → hwpparser rich-text
    ↓ NO → hwpparser text
    ↓
내용 분석 → 사용자에게 전달
```

## Common Patterns

### 양식 문서 분석
```bash
# 1. 표 포함 추출
hwpparser rich-text 입주신청서.hwp -o /tmp/parsed.md

# 2. 마크다운 분석 → 항목 파악
# 3. 사용자에게 필요한 정보 질문
```

### 여러 파일 처리
```bash
for f in *.hwp; do
  hwpparser rich-text "$f" -o "${f%.hwp}.md"
done
```

## Error Handling

| 에러 | 원인 | 해결 |
|------|------|------|
| 파일 없음 | 경로 오류 | 파일 경로 확인 |
| pyhwp 없음 | 의존성 미설치 | `pip install pyhwp` |
| 인코딩 오류 | 구버전 HWP | hwp5txt 대신 hwp5html 시도 |
