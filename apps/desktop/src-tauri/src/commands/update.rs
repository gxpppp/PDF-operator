use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateInfo {
    pub current_version: String,
    pub latest_version: String,
    pub has_update: bool,
    pub release_notes: Option<String>,
    pub download_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProgress {
    pub downloaded: u64,
    pub total: u64,
    pub percentage: f64,
}

#[command]
pub async fn check_for_update() -> Result<UpdateInfo, String> {
    Ok(UpdateInfo {
        current_version: env!("CARGO_PKG_VERSION").to_string(),
        latest_version: env!("CARGO_PKG_VERSION").to_string(),
        has_update: false,
        release_notes: None,
        download_url: None,
    })
}

#[command]
pub async fn download_update(
    app: tauri::AppHandle,
    url: String,
) -> Result<String, String> {
    Ok("Update downloaded".to_string())
}
