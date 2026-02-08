/**
 * Dubai Crab 스킬 로더
 * superpowers 스타일의 스킬 시스템
 */

// 스킬 트리거 매핑
export const SKILL_TRIGGERS: Record<string, string> = {
  // 파일 확장자
  '.hwp': 'hwp-parsing',
  '.hwpx': 'hwp-parsing',
  '.xlsx': 'excel-analysis',
  '.xls': 'excel-analysis',
  '.csv': 'excel-analysis',
  '.pdf': 'pdf-reading',
  '.pptx': 'ppt-analysis',
  '.ppt': 'ppt-analysis',
};

// 키워드 트리거 (우선순위 순)
export const KEYWORD_TRIGGERS: Array<[RegExp, string]> = [
  // 파일 관련
  [/한글\s*(파일|문서)|HWP|hwp/i, 'hwp-parsing'],
  [/엑셀|excel|스프레드시트|데이터\s*분석/i, 'excel-analysis'],
  [/PDF|피디에프/i, 'pdf-reading'],
  [/PPT|파워포인트|발표\s*자료/i, 'ppt-analysis'],
  
  // 문서 작성
  [/공문|기안서|품의서|결재\s*문서/i, 'document-drafting'],
  [/보고서|리포트|현황\s*보고/i, 'document-drafting'],
  [/이메일|메일|email/i, 'email-writing'],
  [/회의록|미팅\s*노트|회의\s*정리/i, 'meeting-notes'],
  [/제안서|사업\s*계획서|proposal/i, 'proposal-writing'],
];

// 스킬 정의
export interface Skill {
  name: string;
  description: string;
  content: string;
}

// 내장 스킬 (런타임에 로드)
export const BUILT_IN_SKILLS: Record<string, Skill> = {
  'using-skills': {
    name: 'using-skills',
    description: '스킬 사용 가이드 - 모든 대화 시작 시 적용',
    content: `
<CRITICAL>
스킬이 적용될 가능성이 1%라도 있다면, 반드시 해당 스킬을 사용하세요.
이것은 선택이 아닙니다. 협상 불가. 예외 없음.
</CRITICAL>

## 핵심 규칙
응답하기 전에 관련 스킬을 먼저 확인하세요.

## Red Flags (이런 생각이 들면 STOP)
- "이건 간단한 질문이라..." → 질문도 작업이다. 스킬 체크.
- "스킬은 좀 과한데..." → 간단한 것도 복잡해진다. 스킬 사용.
- "빨리 답하는 게 좋겠다..." → 정확한 답 > 빠른 답. 스킬 따르기.
`
  },
  'hwp-parsing': {
    name: 'hwp-parsing',
    description: 'HWP/HWPX 한글 문서 읽기',
    content: `
## HWP 파싱

hwpparser CLI를 사용하여 HWP 파일을 처리합니다.

### 명령어
\`\`\`bash
# 표 포함 텍스트 추출 (권장)
hwpparser rich-text input.hwp

# 빠른 텍스트 추출 (표는 <표>로 표시)
hwpparser text input.hwp

# PDF 변환
hwpparser convert input.hwp output.pdf
\`\`\`

### 워크플로우
1. 파일 경로 확인
2. hwpparser rich-text로 내용 추출
3. 마크다운 테이블 형태로 표 포함
4. 내용 분석 후 사용자에게 전달
`
  },
  'document-drafting': {
    name: 'document-drafting',
    description: '공문/보고서/기안서 작성',
    content: `
## 문서 작성

### 공문 구조
1. 문서번호, 시행일자
2. 수신, 참조, 제목
3. 본문 (인사말 → 내용 → 마무리)
4. 서명, 붙임

### 보고서 구조
Ⅰ. 개요 → Ⅱ. 현황 분석 → Ⅲ. 문제점/개선방안 → Ⅳ. 기대효과 → Ⅴ. 향후 계획

### 작성 원칙
- 경어체 (~합니다, ~입니다)
- 간결하고 명확하게
- 항목 번호 체계 통일 (Ⅰ. 1. 가. 1) ①)
`
  },
  'email-writing': {
    name: 'email-writing',
    description: '비즈니스 이메일 작성',
    content: `
## 비즈니스 이메일

### 기본 구조
제목 → 수신자 호칭 → 인사 → 본문 → 마무리 → 서명

### 호칭
- 상급자: OOO 부장님께
- 동료/외부: OOO 님께
- 끝맺음: 드림, 올림

### 톤 조절
- 격식체: ~하옵니다, 검토 부탁드립니다
- 일반 경어: ~합니다, 확인해 주세요
`
  },
  'meeting-notes': {
    name: 'meeting-notes',
    description: '회의록 작성',
    content: `
## 회의록 작성

### 필수 항목
1. 회의 정보 (일시, 장소, 참석자)
2. 안건별 논의/결정 사항
3. 액션 아이템 (담당자, 기한)
4. 다음 회의 일정

### 액션 아이템 기준
- WHO: 누가
- WHAT: 무엇을
- WHEN: 언제까지

### 좋은 예시
❌ "마케팅 검토"
✅ "김과장, 2월 마케팅 예산안 검토 후 3/1까지 피드백"
`
  },
  'excel-analysis': {
    name: 'excel-analysis',
    description: '엑셀 데이터 분석',
    content: `
## 엑셀 분석

### 분석 워크플로우
1. 데이터 구조 파악 (행/열, 헤더, 타입)
2. 기초 통계 (합계, 평균, 최대/최소)
3. 트렌드/패턴 분석
4. 인사이트 도출

### 결과 보고 형식
- 개요: 분석 대상, 데이터 범위
- 주요 수치: 표로 정리
- 핵심 인사이트: 번호 목록
- 권고사항

### 한국 비즈니스 표기
- 금액: 1,000,000원 (천 단위 콤마)
- 증감: 전월 대비 +15.2% 증가
- 기간: 1Q, 2Q, 1H, FY2026
`
  }
};

/**
 * 메시지에서 적용할 스킬 찾기
 */
export function findApplicableSkills(
  message: string,
  fileExtension?: string
): string[] {
  const skills: string[] = [];
  
  // 항상 using-skills 먼저
  skills.push('using-skills');
  
  // 파일 확장자로 스킬 찾기
  if (fileExtension) {
    const ext = fileExtension.toLowerCase();
    if (SKILL_TRIGGERS[ext]) {
      skills.push(SKILL_TRIGGERS[ext]);
    }
  }
  
  // 키워드로 스킬 찾기
  for (const [pattern, skillName] of KEYWORD_TRIGGERS) {
    if (pattern.test(message) && !skills.includes(skillName)) {
      skills.push(skillName);
    }
  }
  
  return skills;
}

/**
 * 스킬 내용 가져오기
 */
export function getSkillContent(skillName: string): Skill | null {
  return BUILT_IN_SKILLS[skillName] || null;
}

/**
 * 시스템 프롬프트에 스킬 주입
 */
export function buildSystemPromptWithSkills(
  basePrompt: string,
  applicableSkills: string[]
): string {
  const skillContents = applicableSkills
    .map(name => getSkillContent(name))
    .filter((s): s is Skill => s !== null)
    .map(s => `## ${s.name}\n${s.content}`)
    .join('\n\n---\n\n');
  
  return `${basePrompt}

# 적용된 스킬

${skillContents}`;
}

/**
 * 기본 시스템 프롬프트
 */
export const BASE_SYSTEM_PROMPT = `당신은 **Dubai Crab** 🦀, 한국 직장인을 위한 로컬 AI 어시스턴트입니다.

## 핵심 원칙

<CRITICAL>
스킬이 적용될 가능성이 1%라도 있다면, 반드시 해당 스킬을 사용하세요.
</CRITICAL>

## 한국 비즈니스 맥락
- 언어: 한국어 (존댓말)
- 문서: HWP 우선
- 날짜: YYYY년 MM월 DD일
- 호칭: 직급 + 님

## 보안
- 모든 데이터는 로컬 처리
- 외부 전송 없음
`;
