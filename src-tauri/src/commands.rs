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

/// HWP 파일 파싱
#[tauri::command]
pub fn parse_hwp(path: String) -> HwpParseResult {
    // Python 스크립트 경로 (앱 리소스 또는 시스템 경로)
    let script_path = "scripts/parse_hwp.py";
    
    let output = Command::new("python3")
        .arg(script_path)
        .arg(&path)
        .output();
    
    match output {
        Ok(output) => {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                match serde_json::from_str::<HwpParseResult>(&stdout) {
                    Ok(result) => result,
                    Err(e) => HwpParseResult {
                        success: false,
                        text: None,
                        error: Some(format!("JSON 파싱 실패: {}", e)),
                    },
                }
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                HwpParseResult {
                    success: false,
                    text: None,
                    error: Some(format!("Python 스크립트 실패: {}", stderr)),
                }
            }
        }
        Err(e) => HwpParseResult {
            success: false,
            text: None,
            error: Some(format!("Python 실행 실패: {}. pyhwp가 설치되어 있는지 확인하세요.", e)),
        },
    }
}
