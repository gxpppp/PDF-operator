use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MenuItem {
    pub id: String,
    pub label: String,
    pub icon: Option<String>,
    pub shortcut: Option<String>,
    pub enabled: bool,
    pub children: Option<Vec<MenuItem>>,
}

#[command]
pub async fn get_menu_items() -> Result<Vec<MenuItem>, String> {
    Ok(vec![
        MenuItem {
            id: "file".to_string(),
            label: "File".to_string(),
            icon: None,
            shortcut: None,
            enabled: true,
            children: Some(vec![
                MenuItem {
                    id: "file.open".to_string(),
                    label: "Open".to_string(),
                    icon: Some("folder-open".to_string()),
                    shortcut: Some("Ctrl+O".to_string()),
                    enabled: true,
                    children: None,
                },
                MenuItem {
                    id: "file.save".to_string(),
                    label: "Save".to_string(),
                    icon: Some("save".to_string()),
                    shortcut: Some("Ctrl+S".to_string()),
                    enabled: true,
                    children: None,
                },
                MenuItem {
                    id: "file.save_as".to_string(),
                    label: "Save As".to_string(),
                    icon: Some("save".to_string()),
                    shortcut: Some("Ctrl+Shift+S".to_string()),
                    enabled: true,
                    children: None,
                },
            ]),
        },
        MenuItem {
            id: "edit".to_string(),
            label: "Edit".to_string(),
            icon: None,
            shortcut: None,
            enabled: true,
            children: Some(vec![
                MenuItem {
                    id: "edit.undo".to_string(),
                    label: "Undo".to_string(),
                    icon: Some("undo".to_string()),
                    shortcut: Some("Ctrl+Z".to_string()),
                    enabled: true,
                    children: None,
                },
                MenuItem {
                    id: "edit.redo".to_string(),
                    label: "Redo".to_string(),
                    icon: Some("redo".to_string()),
                    shortcut: Some("Ctrl+Y".to_string()),
                    enabled: true,
                    children: None,
                },
            ]),
        },
    ])
}

#[command]
pub async fn handle_menu_click(menu_id: String) -> Result<String, String> {
    Ok(format!("Handled menu action: {}", menu_id))
}
