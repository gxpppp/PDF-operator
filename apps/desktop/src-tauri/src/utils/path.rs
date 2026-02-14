use std::path::{Path, PathBuf};

pub fn get_app_data_dir() -> PathBuf {
    let base_dirs = directories::BaseDirs::new().unwrap();
    base_dirs.data_dir().join("pdf-master")
}

pub fn get_config_dir() -> PathBuf {
    get_app_data_dir().join("config")
}

pub fn get_cache_dir() -> PathBuf {
    get_app_data_dir().join("cache")
}

pub fn get_temp_dir() -> PathBuf {
    std::env::temp_dir().join("pdf-master")
}

pub fn ensure_dir_exists(path: &Path) -> std::io::Result<()> {
    if !path.exists() {
        std::fs::create_dir_all(path)?;
    }
    Ok(())
}

pub fn get_file_extension(path: &Path) -> Option<String> {
    path.extension()
        .map(|ext| ext.to_string_lossy().to_lowercase())
}

pub fn get_file_name(path: &Path) -> Option<String> {
    path.file_name()
        .map(|name| name.to_string_lossy().to_string())
}

pub fn get_parent_dir(path: &Path) -> Option<PathBuf> {
    path.parent().map(|p| p.to_path_buf())
}

pub fn is_absolute_path(path: &str) -> bool {
    Path::new(path).is_absolute()
}

pub fn join_paths(base: &Path, relative: &str) -> PathBuf {
    base.join(relative)
}

pub fn normalize_path(path: &Path) -> PathBuf {
    path.canonicalize().unwrap_or_else(|_| path.to_path_buf())
}
