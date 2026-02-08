# Dubai Crab 스킬 인덱스

## 메타 스킬
| 스킬 | 설명 |
|------|------|
| [using-skills](./using-skills/SKILL.md) | 스킬 사용 가이드 - 모든 대화 시작 시 적용 |

## 파일 처리
| 스킬 | 설명 | 트리거 |
|------|------|--------|
| [hwp-parsing](./hwp-parsing/SKILL.md) | HWP/HWPX 한글 문서 읽기 | .hwp, .hwpx 파일, "한글 파일" |
| [excel-analysis](./excel-analysis/SKILL.md) | 엑셀 데이터 분석 | .xlsx, .xls, .csv, "데이터 분석" |

## 문서 작성
| 스킬 | 설명 | 트리거 |
|------|------|--------|
| [document-drafting](./document-drafting/SKILL.md) | 공문/보고서/기안서 작성 | "공문", "보고서", "기안서" |
| [email-writing](./email-writing/SKILL.md) | 비즈니스 이메일 작성 | "이메일", "메일" |
| [meeting-notes](./meeting-notes/SKILL.md) | 회의록 작성 | "회의록", "미팅 노트" |

## 트리거 키워드 매핑

```javascript
const SKILL_TRIGGERS = {
  // 파일 확장자
  '.hwp': 'hwp-parsing',
  '.hwpx': 'hwp-parsing',
  '.xlsx': 'excel-analysis',
  '.xls': 'excel-analysis',
  '.csv': 'excel-analysis',
  
  // 키워드 (한글)
  '한글 파일': 'hwp-parsing',
  '한글 문서': 'hwp-parsing',
  'HWP': 'hwp-parsing',
  '엑셀': 'excel-analysis',
  '데이터 분석': 'excel-analysis',
  '공문': 'document-drafting',
  '보고서': 'document-drafting',
  '기안서': 'document-drafting',
  '품의서': 'document-drafting',
  '이메일': 'email-writing',
  '메일': 'email-writing',
  '회의록': 'meeting-notes',
  '미팅 노트': 'meeting-notes',
};
```

## 스킬 로드 순서

1. `using-skills` - 항상 먼저 (메타 스킬)
2. 파일 처리 스킬 - 파일이 있으면
3. 작성/분석 스킬 - 요청에 따라

## 스킬 추가 가이드

새 스킬 추가 시:
1. `skills/[skill-name]/SKILL.md` 생성
2. frontmatter에 `name`과 `description` 필수
3. 이 인덱스에 추가
4. 트리거 키워드 매핑 업데이트
