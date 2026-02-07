# OpenKlaw - 빌드 & 실행 가이드

## 프로젝트 경로
```
~/Documents/snovium/OpenKlaw/
```

## 개발 환경 요구사항

- Node.js 20+
- Rust (Tauri용)
- Python 3.12+ (pyhwp용)
- Ollama

---

## 빌드 명령어

### 프론트엔드 (SvelteKit)
```bash
cd src/web
pnpm install
pnpm dev        # 개발 서버
pnpm build      # 빌드
```

### Tauri 앱
```bash
cd src/tauri
cargo tauri dev     # 개발 모드
cargo tauri build   # 릴리스 빌드
```

### 전체 빌드
```bash
pnpm run build:all
```

---

## 테스트 명령어

### 유닛 테스트
```bash
pnpm test
```

### 타입체크
```bash
pnpm run typecheck
```

### 린트
```bash
pnpm run lint
```

### 전체 검증 (커밋 전 필수)
```bash
pnpm run validate
# = typecheck + lint + test
```

---

## 설치 테스트

### Windows
```bash
# 빌드 후 설치 파일 실행
./target/release/bundle/nsis/OpenKlaw_*.exe
```

### macOS (npm)
```bash
# 로컬 테스트
npm link
openklaw --version

# 글로벌 설치 시뮬레이션
npm pack
npm install -g ./openklaw-*.tgz
```

---

## Git 커밋 규칙

```bash
# 커밋 전 검증 필수
pnpm run validate

# 커밋 메시지 형식
git commit -m "feat: 기능 설명"
git commit -m "fix: 버그 수정 설명"
git commit -m "docs: 문서 업데이트"
git commit -m "refactor: 리팩토링 설명"
```

---

## 에이전트별 명령어

### PM 에이전트
```bash
# 문서 업데이트 후
git add docs/
git commit -m "docs: [설명]"
git push
```

### Developer 에이전트
```bash
# 구현 후
pnpm run validate
git add .
git commit -m "feat: [기능명]"
git push
```

### QA 에이전트
```bash
# 테스트 실행
pnpm test
pnpm run e2e

# 버그 발견 시
echo "## Bug: [제목]" >> docs/bugs/$(date +%Y%m%d).md
git add docs/bugs/
git commit -m "docs: bug report - [설명]"
```

---

## 종료 조건

1. ✅ 모든 fix_plan.md 태스크 완료
2. ✅ pnpm run validate 통과
3. ✅ Windows 설치 테스트 통과
4. ✅ macOS npm 설치 테스트 통과
