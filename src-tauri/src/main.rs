// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sysinfo::{PidExt, ProcessExt, System, SystemExt};
use tauri::Manager;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
async fn check(proc_name: &str, app_handle: tauri::AppHandle) -> Result<(), String> {
    let s = System::new_all();

    if let Some(process) = s.processes_by_name(&proc_name).next() {
        let i: u32 = process.pid().as_u32();
        app_handle
            .emit_all(
                "setstatus",
                Payload {
                    message: format!("Process found {}", i),
                },
            )
            .unwrap();
        return Ok(());
    }
    return Err(format!("{} not found", proc_name));
}

fn main() {
    tauri::Builder::default()
        .on_page_load(|window, _payload| {
            window.show().unwrap();
        })
        .invoke_handler(tauri::generate_handler![check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
