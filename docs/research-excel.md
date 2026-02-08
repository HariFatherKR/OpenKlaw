# 엑셀/CSV 분석 기능 리서치

> 작성일: 2026-02-08
> 목적: P1 기능 구현을 위한 기술 조사

---

## 1. JavaScript 엑셀 파싱 라이브러리

### 1.1 SheetJS (xlsx)
- **npm**: `xlsx`
- **크기**: ~500KB (minified)
- **장점**:
  - 가장 널리 사용됨 (주간 다운로드 300만+)
  - .xlsx, .xls, .csv, .ods 등 다양한 포맷
  - 브라우저 + Node.js 모두 지원
  - WASM 불필요, 순수 JS
- **단점**:
  - Community Edition은 읽기 전용 (쓰기 제한)
  - Pro 버전 유료
- **추천도**: ⭐⭐⭐⭐⭐ (읽기 전용 용도로 최적)

### 1.2 ExcelJS
- **npm**: `exceljs`
- **크기**: ~400KB
- **장점**:
  - 읽기/쓰기 모두 완전 무료
  - 스타일링, 차트 등 고급 기능
  - 스트리밍 지원 (대용량 파일)
- **단점**:
  - Node.js 주력 (브라우저 지원 제한적)
  - Tauri 환경에서 fs 의존성 문제 가능
- **추천도**: ⭐⭐⭐ (서버 사이드 적합)

### 1.3 read-excel-file
- **npm**: `read-excel-file`
- **크기**: ~70KB
- **장점**:
  - 매우 가벼움
  - 브라우저 친화적
  - TypeScript 지원
- **단점**:
  - xlsx만 지원 (xls 미지원)
  - 쓰기 불가
- **추천도**: ⭐⭐⭐⭐ (경량화 필요시)

### 🎯 결론: **SheetJS (xlsx)** 선택
- 브라우저 환경 완벽 지원
- 다양한 포맷 호환
- OpenKlaw는 읽기 분석 용도이므로 CE 버전 충분

---

## 2. CSV 파싱 라이브러리

### 2.1 PapaParse
- **npm**: `papaparse`
- **크기**: ~20KB
- **장점**:
  - 업계 표준
  - 스트리밍 파싱 (대용량)
  - 자동 타입 추론
  - 헤더 자동 감지
  - Worker 스레드 지원 (UI 블로킹 방지)
- **단점**:
  - 없음 (완벽함)
- **추천도**: ⭐⭐⭐⭐⭐

### 2.2 csv-parse
- **npm**: `csv-parse`
- **장점**: Node.js 스트리밍 최적화
- **단점**: 브라우저 미지원
- **추천도**: ⭐⭐ (Node 전용)

### 🎯 결론: **PapaParse** 선택
- 브라우저 환경 완벽
- 대용량 파일 스트리밍
- SheetJS도 CSV 지원하지만, PapaParse가 더 강력

---

## 3. 데이터 시각화 라이브러리

### 3.1 Chart.js
- **크기**: ~200KB
- **장점**: 가장 대중적, 쉬운 API
- **단점**: 성능 한계 (대용량)
- **Svelte 래퍼**: `svelte-chartjs`

### 3.2 ECharts
- **크기**: ~1MB
- **장점**: 매우 강력, 한국어 지원 우수
- **단점**: 무거움
- **Svelte 래퍼**: `svelte-echarts`

### 3.3 Layerchart (추천)
- **npm**: `layerchart`
- **크기**: ~50KB
- **장점**:
  - Svelte 전용 설계
  - D3 기반, 경량
  - 선언적 API
- **단점**: 커뮤니티 작음

### 3.4 자체 구현 (테이블 + 기본 차트)
- **장점**: 의존성 최소화
- **단점**: 개발 시간
- **추천**: MVP는 테이블만, 차트는 후순위

### 🎯 결론: **테이블 미리보기 우선 + Chart.js 선택적**
- MVP: HTML 테이블로 데이터 미리보기
- 추후: Chart.js로 기본 차트 (막대, 라인, 파이)

---

## 4. 사용자 시나리오

### 시나리오 1: 엑셀 파일 분석
```
1. 사용자가 .xlsx 파일 드래그앤드롭
2. OpenKlaw가 파일 파싱 → 첫 10행 미리보기
3. "이 데이터 요약해줘" 요청
4. AI가 컬럼 분석, 통계 요약, 인사이트 제공
```

### 시나리오 2: CSV 데이터 질문
```
1. 매출 데이터.csv 업로드
2. "2024년 Q4 매출 합계 알려줘"
3. AI가 데이터 필터링 후 계산 결과 제공
```

### 시나리오 3: 간단한 시각화
```
1. 데이터 업로드 후 분석
2. "월별 추이 그래프로 보여줘"
3. 막대/라인 차트 생성
```

---

## 5. 기술 스택 결정

| 기능 | 선택 | 이유 |
|------|------|------|
| 엑셀 파싱 | SheetJS (xlsx) | 브라우저 지원, 다양한 포맷 |
| CSV 파싱 | PapaParse | 업계 표준, 스트리밍 |
| 시각화 | HTML Table (MVP) | 의존성 최소화 |
| 시각화 확장 | Chart.js (옵션) | 필요시 추가 |

---

## 6. 구현 접근법

### 6.1 파일 업로드
- 드래그앤드롭 + 파일 선택 버튼
- 지원 형식: .xlsx, .xls, .csv
- 파일 크기 제한: 10MB (MVP)

### 6.2 데이터 처리
```typescript
// 엑셀 파싱
import * as XLSX from 'xlsx';

async function parseExcel(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet);
}

// CSV 파싱
import Papa from 'papaparse';

function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data)
    });
  });
}
```

### 6.3 AI 연동
- 파싱된 데이터를 JSON으로 프롬프트에 포함
- 대용량 시 샘플링 (첫 100행 + 컬럼 메타데이터)
- 컨텍스트 윈도우 초과 방지

---

## 7. 예상 작업량

| 태스크 | 예상 시간 |
|--------|----------|
| 라이브러리 설치 | 10분 |
| 파일 업로드 UI | 1시간 |
| 파싱 로직 | 30분 |
| 테이블 미리보기 | 1시간 |
| AI 연동 | 1시간 |
| 테스트 | 30분 |
| **총계** | **~4시간** |

---

## 8. 리스크

1. **대용량 파일**: 브라우저 메모리 한계 → 샘플링으로 해결
2. **한글 인코딩**: CSV의 EUC-KR → PapaParse의 인코딩 감지 활용
3. **복잡한 엑셀**: 수식, 매크로 → 값만 추출 (수식 무시)

---

## 9. 참고 자료

- SheetJS 문서: https://docs.sheetjs.com/
- PapaParse 문서: https://www.papaparse.com/
- Chart.js 문서: https://www.chartjs.org/
