# OpenKlaw - 자율 개발 루프

## 프로젝트 목표

**OpenKlaw**: 한국 사무직을 위한 로컬 AI 비서
- OpenClaw 경량화 포크
- 로컬 LLM (Ollama + Qwen2.5-3B)
- HWP 파싱, 이메일 작성, 회의록 정리

### 최종 목표
- **Windows**: 설치파일 하나로 설치 완료
- **macOS**: `npm install -g openklaw` 한 줄로 설치 완료

---

## 개발 워크플로우 (Multi-Agent)

### Phase 1: PM (기획)
1. docs/ 문서 업데이트
2. 설치 경험 목표 반영
3. git commit

### Phase 2: Research (리서치)
1. 사무직 워크플로우 리서치
2. 경쟁 제품 분석
3. 리서치 결과 문서화
4. git commit

### Phase 3: PM (의사결정)
1. 리서치 vs 현재 문서 비교
2. 우선순위 결정
3. fix_plan.md 업데이트
4. git commit

### Phase 4: Developer (개발)
1. fix_plan.md 태스크 순서대로 구현
2. 테스트 실행
3. 성공 시 git commit
4. 실패 시 PM 호출

### Phase 5: QA (테스트)
1. 기능 테스트 실행
2. 버그 발견 시 docs/bugs/ 기록
3. git commit
4. 100% 통과 아니면 Developer로 돌아감

### 반복 조건
- 모든 P0 기능 완료
- QA 100% 통과
- 설치 테스트 통과 (Windows + Mac)

---

## 기술 스택

- **Desktop**: Tauri (Rust + SvelteKit)
- **LLM Runtime**: Ollama
- **Default Model**: Qwen2.5-3B-Instruct
- **HWP Parser**: pyhwp (Python subprocess)
- **Package Manager**: npm (CLI 배포)

---

## 원칙

1. **가볍게**: 설치 파일 < 50MB (LLM 제외)
2. **쉽게**: 5분 안에 첫 대화 시작
3. **안전하게**: 100% 로컬, 네트워크 요청 없음
4. **한국어 우선**: UI + 모델 모두 한국어

---

## 참고 문서

- `docs/PRD.md` - 제품 요구사항
- `docs/BRAINSTORM.md` - 아이디어 정리
- `.ralph/fix_plan.md` - 현재 태스크 리스트
- `.ralph/specs/` - 상세 스펙
