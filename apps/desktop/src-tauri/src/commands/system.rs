use serde::{Deserialize, Serialize};
use sysinfo::System;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os_name: String,
    pub os_version: String,
    pub arch: String,
    pub cpu_cores: usize,
    pub total_memory: u64,
    pub free_memory: u64,
    pub hostname: String,
}

#[command]
pub async fn get_system_info() -> Result<SystemInfo, String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    Ok(SystemInfo {
        os_name: System::name().unwrap_or_default(),
        os_version: System::os_version().unwrap_or_default(),
        arch: std::env::consts::ARCH.to_string(),
        cpu_cores: sys.cpus().len(),
        total_memory: sys.total_memory(),
        free_memory: sys.available_memory(),
        hostname: System::host_name().unwrap_or_default(),
    })
}

#[command]
pub async fn get_app_version(app: tauri::AppHandle) -> Result<String, String> {
    let version = app.config().version.clone().unwrap_or_default();
    Ok(version)
}

#[command]
pub async fn open_in_browser(url: String) -> Result<(), String> {
    open::that(&url).map_err(|e| e.to_string())
}

#[command]
pub async fn get_platform() -> Result<String, String> {
    Ok(std::env::consts::OS.to_string())
}
