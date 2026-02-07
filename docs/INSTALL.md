# 📦 OpenKlaw 설치 가이드

> **Version:** 0.1 MVP  
> **최종 업데이트:** 2025-02-07

---

## 🖥️ 시스템 요구사항

| 항목 | 최소 | 권장 |
|------|------|------|
| **CPU** | Intel i5 / Ryzen 5 | Intel i7 / Ryzen 7 |
| **RAM** | 8GB | 16GB |
| **저장공간** | 10GB 여유 | 20GB 여유 |
| **GPU** | 내장 그래픽 | 내장/외장 |
| **OS** | Windows 10/11, macOS 12+ | 동일 |

---

## 🪟 Windows 설치

### 방법 1: 원클릭 설치 (권장)

```
1. OpenKlaw-Setup-x.x.x.exe 다운로드
   → https://github.com/snovium/OpenKlaw/releases

2. 설치파일 더블클릭

3. "설치" 버튼 클릭

4. 자동으로 진행됨:
   ✓ OpenKlaw 설치
   ✓ Ollama 설치 (없는 경우)
   ✓ Qwen2.5-3B 모델 다운로드

5. 완료! 바탕화면 아이콘 또는 시스템 트레이에서 실행
```

**설치 시간:** 약 5분 (모델 다운로드 시간 별도)

### 방법 2: 수동 설치

```bash
# 1. Ollama 설치
# https://ollama.ai 에서 Windows 버전 다운로드

# 2. 모델 다운로드
ollama pull qwen2.5:3b-instruct

# 3. OpenKlaw 설치
# 릴리스 페이지에서 설치파일 다운로드 후 실행
```

---

## 🍎 macOS 설치

### 방법 1: npm 설치 (권장)

```bash
# 터미널에서 한 줄 실행
npm install -g openklaw

# 실행
openklaw
```

**첫 실행 시 자동 설정:**
1. Ollama 설치 확인 (없으면 Homebrew로 설치)
2. Qwen2.5-3B 모델 다운로드
3. GUI 앱 실행

### 방법 2: Homebrew 수동 설치

```bash
# 1. Ollama 설치
brew install ollama

# 2. Ollama 서비스 시작
brew services start ollama

# 3. 모델 다운로드
ollama pull qwen2.5:3b-instruct

# 4. OpenKlaw 설치
npm install -g openklaw

# 5. 실행
openklaw
```

### Apple Silicon (M1/M2/M3) 지원

OpenKlaw는 Apple Silicon을 네이티브로 지원합니다.
- Ollama가 자동으로 Metal 가속 사용
- 별도 설정 필요 없음

---

## 🐧 Linux 설치

```bash
# 1. Ollama 설치
curl -fsSL https://ollama.ai/install.sh | sh

# 2. 모델 다운로드
ollama pull qwen2.5:3b-instruct

# 3. OpenKlaw 설치
npm install -g openklaw

# 4. 실행
openklaw
```

---

## 🔧 설치 후 설정

### 첫 실행

```
1. OpenKlaw 실행

2. 환영 화면에서 시스템 점검
   ✓ Ollama 연결 확인
   ✓ 모델 로드 확인
   ✓ 시스템 사양 체크

3. "시작하기" 클릭

4. 첫 대화 시작! 🎉
```

### 모델 변경 (선택)

```bash
# 더 큰 모델로 변경 (16GB RAM 권장)
ollama pull qwen2.5:7b-instruct

# OpenKlaw 설정에서 모델 선택 변경
```

### 시스템 트레이

- Windows: 우측 하단 시스템 트레이에 아이콘 표시
- macOS: 메뉴바에 아이콘 표시
- 클릭하면 OpenKlaw 창 열기
- 우클릭하면 빠른 메뉴

---

## ❓ 문제 해결

### Ollama가 실행되지 않음

```bash
# Windows
# 시작 메뉴에서 "Ollama" 검색 후 실행

# macOS
brew services restart ollama

# Linux
sudo systemctl restart ollama
```

### 모델 다운로드 실패

```bash
# 네트워크 확인 후 재시도
ollama pull qwen2.5:3b-instruct

# 저장공간 확인
# 모델은 약 2GB 필요
```

### 응답이 너무 느림

1. 메모리 부족 확인 (최소 8GB 필요)
2. 더 작은 모델 사용 고려
3. 다른 프로그램 종료 후 재시도

### 완전 삭제

```bash
# Windows
# 제어판 → 프로그램 제거에서 OpenKlaw 삭제
# %USERPROFILE%\.ollama 폴더 삭제 (모델 포함)

# macOS
npm uninstall -g openklaw
rm -rf ~/.ollama  # 모델 포함 삭제
brew uninstall ollama  # Ollama도 삭제할 경우

# Linux
npm uninstall -g openklaw
rm -rf ~/.ollama
```

---

## 📝 오프라인 설치

인터넷 연결이 불가능한 환경에서:

### 1. 다른 PC에서 준비
```bash
# 설치파일 다운로드
# Ollama 설치파일 다운로드
# 모델 파일 다운로드 (ollama pull 후 ~/.ollama 폴더)
```

### 2. USB로 복사

### 3. 오프라인 PC에서 설치
```bash
# 설치파일 실행
# ~/.ollama 폴더에 모델 파일 복사
```

---

## 🆘 지원

- **GitHub Issues:** https://github.com/snovium/OpenKlaw/issues
- **문서:** https://github.com/snovium/OpenKlaw/wiki
