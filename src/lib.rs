#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
mod discord_rpc;

use lazy_static::lazy_static;
use std::{sync::{Arc, Mutex}, path::Path, ffi::OsStr};
use tauri::{menu::{MenuBuilder, MenuItemBuilder}, tray::TrayIconBuilder, Manager, async_runtime::TokioJoinHandle};
use crate::discord_rpc::{start_thread, stop_thread, is_thread_up};

lazy_static! {
    static ref DISCORDRPC_SONG_NAME: Mutex<String> = Mutex::new(String::new());
    static ref RPC_THREAD: Arc<Mutex<Option<TokioJoinHandle<()>>>> = Arc::new(Mutex::new(None));
    static ref DISCORD_RPC_ENABLED: Mutex<bool> = Mutex::new(true);
}

#[tauri::command]
fn set_song(song_name: String, artist: String) {
    let song_name_format = if song_name.contains('/') || song_name.contains('\\') {
        Path::new(&song_name)
            .file_stem()
            .unwrap_or_else(|| OsStr::new(&song_name))
            .to_str()
            .unwrap_or(&song_name)
            .to_string()
    } else {
        song_name
    };

    *DISCORDRPC_SONG_NAME.lock().unwrap() = format!("{} - {}", artist, song_name_format);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() -> std::io::Result<()> {
    tauri::Builder::default()
        .setup(|app| {
            let play_pause_item = MenuItemBuilder::new("Play/Pause").id("play_pause").build(app)?;
            let next_item = MenuItemBuilder::new("Next").id("next").build(app)?;
            let prev_item = MenuItemBuilder::new("Previous").id("prev").build(app)?;
            let toggle_rpc_item = MenuItemBuilder::new("Enable/Disable Discord RPC").id("toggle_rpc").build(app)?;
            let show_hide_item = MenuItemBuilder::new("Show/Hide Window").id("show_hide").build(app)?;
            let quit_item = MenuItemBuilder::new("Quit").id("quit").build(app)?;

            let menu = MenuBuilder::new(app)
                .items(&[&play_pause_item, &next_item, &prev_item, &toggle_rpc_item, &show_hide_item, &quit_item])
                .build()?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().expect("Failed to get the Cazic icon").clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => app.exit(0),
                    "play_pause" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.eval("togglePlaybackState()").unwrap();
                    }
                    "next" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.eval("playNextTrack()").unwrap();
                    }
                    "prev" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.eval("playPrevTrack()").unwrap();
                    }
                    "toggle_rpc" => {
                        discord_rpc::toggle_rpc();
                    }
                    "show_hide" => {
                        let window = app.get_webview_window("main").unwrap();
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                        }
                    }
                    _ => {}
                })
                .build(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            is_thread_up,
            set_song,
            start_thread,
            stop_thread
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|error| {
            eprintln!("Error running Cazic: {}", error);
            std::process::exit(1);
        });
    Ok(())
}
