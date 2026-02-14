use std::process::Command;

pub fn get_process_id() -> u32 {
    std::process::id()
}

pub fn get_cpu_count() -> usize {
    num_cpus::get()
}

pub fn get_available_memory() -> u64 {
    use sysinfo::System;
    let mut sys = System::new();
    sys.refresh_memory();
    sys.available_memory()
}

pub fn kill_process(pid: u32) -> bool {
    #[cfg(target_os = "windows")]
    {
        Command::new("taskkill")
            .args(["/PID", &pid.to_string(), "/F"])
            .spawn()
            .is_ok()
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Command::new("kill")
            .args(["-9", &pid.to_string()])
            .spawn()
            .is_ok()
    }
}

pub fn is_process_running(pid: u32) -> bool {
    use sysinfo::{System, ProcessRefreshKind};
    let mut sys = System::new();
    sys.refresh_processes_specifics(ProcessRefreshKind::new());
    sys.process(sysinfo::Pid::from_u32(pid)).is_some()
}
