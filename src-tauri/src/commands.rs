use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub memory_gb: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HwpParseResult {
    pub success: bool,
    pub text: Option<String>,
    pub error: Option<String>,
}

/// Ollama 서버 상태 확인
#[tauri::command]
pub async fn check_ollama() -> Result<bool, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:11434/api/tags")
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await
    {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}

/// 시스템 정보 조회
#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        memory_gb: 0.0, // TODO: 실제 메모리 조회
    }
}

/// HWP 파일 파싱 (hwpparser CLI 사용)
#[tauri::command]
pub fn parse_hwp(path: String, include_tables: bool) -> HwpParseResult {
    // hwpparser CLI 명령 선택: rich-text (표 포함) 또는 text (빠른 추출)
    let subcommand = if include_tables { "rich-text" } else { "text" };
    
    // hwpparser CLI 실행
    let output = Command::new("hwpparser")
        .arg(subcommand)
        .arg(&path)
        .output();
    
    match output {
        Ok(output) => {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout).to_string();
                HwpParseResult {
                    success: true,
                    text: Some(stdout),
                    error: None,
                }
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                // hwpparser가 없는 경우 설치 안내
                if stderr.contains("not found") || stderr.contains("No such file") {
                    HwpParseResult {
                        success: false,
                        text: None,
                        error: Some(
                            "hwpparser가 설치되지 않았습니다.\n\n설치 방법:\n1. pip install pyhwp beautifulsoup4 lxml\n2. pip install -e ~/Documents/snovium/hwp-parser".to_string()
                        ),
                    }
                } else {
                    HwpParseResult {
                        success: false,
                        text: None,
                        error: Some(format!("HWP 파싱 실패: {}", stderr)),
                    }
                }
            }
        }
        Err(e) => {
            // hwpparser 명령이 없는 경우
            HwpParseResult {
                success: false,
                text: None,
                error: Some(format!(
                    "hwpparser 실행 실패: {}\n\n설치 방법:\npip install -e ~/Documents/snovium/hwp-parser",
                    e
                )),
            }
        }
    }
}

/// HWP를 PDF로 변환
#[tauri::command]
pub fn convert_hwp_to_pdf(input_path: String, output_path: String) -> HwpParseResult {
    let output = Command::new("hwpparser")
        .arg("convert")
        .arg(&input_path)
        .arg(&output_path)
        .output();
    
    match output {
        Ok(output) => {
            if output.status.success() {
                HwpParseResult {
                    success: true,
                    text: Some(format!("PDF 생성 완료: {}", output_path)),
                    error: None,
                }
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                HwpParseResult {
                    success: false,
                    text: None,
                    error: Some(format!("PDF 변환 실패: {}", stderr)),
                }
            }
        }
        Err(e) => HwpParseResult {
            success: false,
            text: None,
            error: Some(format!("hwpparser 실행 실패: {}", e)),
        },
    }
}
