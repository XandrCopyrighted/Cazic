#![deny(unsafe_code)]

#[macro_use]
mod rpc;

use lazy_static::lazy_static;
use std::{sync::{Arc, Mutex}, path::Path};
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri::async_runtime::TokioJoinHandle;
use crate::rpc::{start_rpc_thread, stop_rpc_thread, is_rpc_thread_up};

const DISCORDRPC_APPLICATION_ID: &str = "1207492076057665608";

lazy_static! {
    static ref DISCORDRPC_SONG_NAME: Mutex<String> = Mutex::new(String::new());
    static ref RPC_THREAD: Arc<Mutex<Option<TokioJoinHandle<()>>>> = Arc::new(Mutex::new(None));
    static ref DISCORD_RPC_ENABLED: Mutex<bool> = Mutex::new(true);
}

#[tauri::command]
fn set_song(new_name: String, artist: String) {
    let new_name_no_format = Path::new(&new_name)
        .file_stem()
        .and_then(|stem| stem.to_str())
        .map_or_else(|| new_name.clone(), |s| s.to_string());

    *DISCORDRPC_SONG_NAME.lock().unwrap() = format!("{} - {}", artist, new_name_no_format);
}

#[tauri::command]
fn playnexttrack(app_handle: tauri::AppHandle) {
    let window = app_handle.get_window("main").unwrap();
    window.eval("playNextTrack()").unwrap();
}

#[tauri::command]
fn playprevtrack(app_handle: tauri::AppHandle) {
    let window = app_handle.get_window("main").unwrap();
    window.eval("playPrevTrack()").unwrap();
}

#[tauri::command]
fn toggleplayandpause(app_handle: tauri::AppHandle) {
    let window = app_handle.get_window("main").unwrap();
    window.eval("togglePlayandPause()").unwrap();
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let play_pause_item = CustomMenuItem::new("play_pause".to_string(), "Play/Pause");
    let next_item = CustomMenuItem::new("next".to_string(), "Next");
    let prev_item = CustomMenuItem::new("prev".to_string(), "Previous");
    let disable_discord_rpc = CustomMenuItem::new("toggle_rpc".to_string(), "Disable Discord RPC");
    let show_hide_window = CustomMenuItem::new("show__hide".to_string(), "Show/Hide Window");
    let quit_item = CustomMenuItem::new("quit".to_string(), "Quit Cazic");
    
    let context_menu = SystemTrayMenu::new()
        .add_item(play_pause_item)
        .add_item(next_item)
        .add_item(prev_item)
        .add_item(disable_discord_rpc)
        .add_item(show_hide_window)
        .add_item(quit_item);
    
    let desktop_tray = SystemTray::new().with_menu(context_menu);
    
    #[cfg(unix)]
    tauri::Builder::default()
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            start_rpc_thread,
            stop_rpc_thread,
            set_song,
            is_rpc_thread_up,
            playnexttrack,
            playprevtrack,
            toggleplayandpause
        ])
        .setup(|app| {
            app.get_window("main").unwrap().show().unwrap();
            Ok(())
        })
        .system_tray(desktop_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "play_pause" => {
                        toggleplayandpause(app.app_handle());
                    }
                    "next" => {
                        playnexttrack(app.app_handle());
                    }
                    "prev" => {
                        playprevtrack(app.app_handle());
                    }
                    "toggle_rpc" => {
                        println!("gay");
                        rpc::toggle_rpc();
                    }
                    "show__hide" => {
                        let window = app.get_window("main").unwrap();
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                    "quit" => std::process::exit(0),

                    _ => {}
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            eprintln!("Error while running Cazic: {}", e);
            std::process::exit(1);
        });
    Ok(())
}