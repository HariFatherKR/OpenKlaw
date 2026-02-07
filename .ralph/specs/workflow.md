# OpenKlaw - Multi-Agent Workflow Spec

## 에이전트 역할

### 1. PM 에이전트 (Product Manager)
- **역할**: 기획, 문서화, 의사결정
- **입력**: 리서치 결과, 개발 진행 상황
- **출력**: PRD, 우선순위, 방향성 결정

### 2. Research 에이전트
- **역할**: 시장 조사, 사용자 리서치
- **입력**: 리서치 질문
- **출력**: 리서치 문서, 인사이트

### 3. Developer 에이전트
- **역할**: 코드 구현, 테스트 작성
- **입력**: fix_plan.md 태스크
- **출력**: 코드, 커밋

### 4. QA 에이전트
- **역할**: 기능 테스트, 버그 리포트
- **입력**: 빌드된 앱
- **출력**: 테스트 결과, 버그 리포트

---

## 워크플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ralph Loop Controller                         │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ PM Agent    │    │ Research    │    │ Developer   │
    │             │    │ Agent       │    │ Agent       │
    │ • 문서 작성  │    │ • 워크플로우 │    │ • 코드 구현  │
    │ • 의사결정   │    │   리서치     │    │ • 테스트    │
    │ • 방향 설정  │    │ • 경쟁 분석  │    │ • 커밋      │
    └─────────────┘    └─────────────┘    └─────────────┘
           │                  │                  │
           └──────────────────┼──────────────────┘
                              ▼
                       ┌─────────────┐
                       │ QA Agent    │
                       │             │
                       │ • 기능 테스트│
                       │ • 버그 리포트│
                       └─────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              [100% Pass]          [Bugs Found]
                    │                   │
                    ▼                   ▼
               [완료!]            [Developer로]
                                  [또는 PM 호출]
```

---

## Phase 전환 조건

### PM → Research
- 조건: docs/ 초기 문서 완료
- 커밋 필수

### Research → PM (의사결정)
- 조건: 리서치 문서 완료
- 커밋 필수

### PM (의사결정) → Developer
- 조건: fix_plan.md 개발 태스크 정의됨
- 커밋 필수

### Developer → QA
- 조건: fix_plan.md 현재 Phase 태스크 완료
- validate 통과
- 커밋 필수

### QA → Developer (버그 발견)
- 조건: 테스트 실패 또는 버그 발견
- docs/bugs/ 기록 필수

### QA → PM (방향 수정 필요)
- 조건: 개발 블로커 발생
- 기술적 한계 발견
- 스펙 수정 필요

### QA → 완료
- 조건: 100% 테스트 통과
- 설치 테스트 통과 (Windows + Mac)

---

## 에이전트 호출 템플릿

### PM 에이전트
```
프로젝트: ~/Documents/snovium/OpenKlaw
역할: PM (Product Manager)

현재 상태:
- Phase: [현재 Phase]
- 이전 에이전트 결과: [요약]

태스크:
1. docs/ 문서 업데이트
2. 의사결정 사항 반영
3. fix_plan.md 업데이트
4. git commit & push

참고:
- .ralph/PROMPT.md
- .ralph/fix_plan.md
- docs/PRD.md
```

### Research 에이전트
```
프로젝트: ~/Documents/snovium/OpenKlaw
역할: Research

리서치 주제:
1. 한국 사무직 일일 업무 워크플로우
2. AI 도구 사용 현황 (ChatGPT 제한 환경)
3. 경쟁 제품 분석 (Ollama, LM Studio)

출력:
- .ralph/specs/research-workflow.md
- .ralph/specs/research-competitors.md
- git commit & push
```

### Developer 에이전트
```
프로젝트: ~/Documents/snovium/OpenKlaw
역할: Developer

현재 태스크: .ralph/fix_plan.md 참조

워크플로우:
1. 태스크 확인
2. 구현
3. pnpm run validate
4. 성공 시 git commit & push
5. 실패 시 수정 또는 PM 호출

참고:
- .ralph/AGENT.md (빌드 명령어)
- docs/ARCHITECTURE.md
```

### QA 에이전트
```
프로젝트: ~/Documents/snovium/OpenKlaw
역할: QA

테스트 항목:
1. pnpm test (유닛 테스트)
2. 설치 테스트 (Windows)
3. 설치 테스트 (macOS npm)
4. 기능 테스트 (매뉴얼)

출력:
- 테스트 결과 요약
- 버그 발견 시: docs/bugs/YYYY-MM-DD.md
- git commit & push

완료 조건: 모든 테스트 100% 통과
```

---

## 종료 조건 체크리스트

- [ ] fix_plan.md 모든 Phase 완료
- [ ] pnpm run validate 통과
- [ ] Windows 설치 테스트 통과
- [ ] macOS npm 설치 테스트 통과
- [ ] QA 100% 통과
- [ ] GitHub에 최종 push 완료
