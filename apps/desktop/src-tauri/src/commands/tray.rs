use tauri::{command, AppHandle, Manager};

#[command]
pub async fn update_tray_icon(app: AppHandle, icon_path: String) -> Result<(), String> {
    Ok(())
}

#[command]
pub async fn set_tray_tooltip(app: AppHandle, tooltip: String) -> Result<(), String> {
    Ok(())
}
