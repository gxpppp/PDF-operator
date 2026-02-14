#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod utils;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            commands::file::get_file_info,
            commands::file::read_file,
            commands::file::write_file,
            commands::file::delete_file,
            commands::file::file_exists,
            commands::file::create_directory,
            commands::file::list_directory,
            commands::file::get_file_hash,
            commands::system::get_system_info,
            commands::system::get_app_version,
            commands::system::open_in_browser,
            commands::system::get_platform,
            commands::window::minimize_window,
            commands::window::maximize_window,
            commands::window::close_window,
            commands::window::set_window_title,
            commands::menu::get_menu_items,
            commands::menu::handle_menu_click,
            commands::tray::update_tray_icon,
            commands::tray::set_tray_tooltip,
            commands::update::check_for_update,
            commands::update::download_update,
            commands::shell::execute_command,
            commands::shell::open_file_with_default,
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
