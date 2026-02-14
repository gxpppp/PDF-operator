pub fn is_windows() -> bool {
    cfg!(target_os = "windows")
}

pub fn is_macos() -> bool {
    cfg!(target_os = "macos")
}

pub fn is_linux() -> bool {
    cfg!(target_os = "linux")
}

pub fn get_os_name() -> String {
    std::env::consts::OS.to_string()
}

pub fn get_arch() -> String {
    std::env::consts::ARCH.to_string()
}

pub fn get_exe_path() -> std::io::Result<std::path::PathBuf> {
    std::env::current_exe()
}

pub fn get_current_dir() -> std::io::Result<std::path::PathBuf> {
    std::env::current_dir()
}

pub fn get_home_dir() -> Option<std::path::PathBuf> {
    directories::BaseDirs::new()
        .map(|dirs| dirs.home_dir().to_path_buf())
}

pub fn get_documents_dir() -> Option<std::path::PathBuf> {
    directories::BaseDirs::new()
        .map(|dirs| dirs.document_dir().to_path_buf())
}

pub fn get_downloads_dir() -> Option<std::path::PathBuf> {
    directories::BaseDirs::new()
        .map(|dirs| dirs.download_dir().to_path_buf())
}

pub fn get_desktop_dir() -> Option<std::path::PathBuf> {
    directories::BaseDirs::new()
        .map(|dirs| dirs.desktop_dir().to_path_buf())
}
