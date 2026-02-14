use std::process::Command;
use tauri::command;

#[command]
pub async fn execute_command(
    program: String,
    args: Vec<String>,
) -> Result<String, String> {
    let output = Command::new(&program)
        .args(&args)
        .output()
        .map_err(|e| e.to_string())?;
    
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[command]
pub async fn open_file_with_default(path: String) -> Result<(), String> {
    open::that(&path).map_err(|e| e.to_string())
}
