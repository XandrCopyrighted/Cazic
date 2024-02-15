// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::sync::Mutex;

const DISCORDRPC_APPLICATION_ID: &str = "1207492076057665608";

// static mut DISCORDRPC_SONG_NAME: &str = "song name";

lazy_static! {
    static ref DISCORDRPC_SONG_NAME: Mutex<String> = Mutex::new(String::new());
}

#[tauri::command]
fn set_song(new_name: String) {
    *DISCORDRPC_SONG_NAME.lock().unwrap() = new_name;
} 

#[tauri::command]
fn set_rpc_thread() {
    std::thread::spawn(move || {
        // this code is reused from https://github.com/WilliamAnimate/discord-rpc/blob/main/src-tauri/src/main.rs
        // I, WilliamAnimate, literally wrote this code and i give this usage the green light yeah etc
        let discordrpc_song_name = DISCORDRPC_SONG_NAME.lock().unwrap();
        let mut client = DiscordIpcClient::new(&DISCORDRPC_APPLICATION_ID).unwrap();

        let _ = client.connect();

        let mut activity_base = activity::Activity::new();
        let activity_assets = activity::Assets::new();

        activity_base = activity_base.details("Listening to music on Cazic!");
        activity_base = activity_base.state(&discordrpc_song_name);

        let _ = client.set_activity(activity_base.assets(activity_assets));
        std::thread::sleep(std::time::Duration::from_secs(500));
    });
}

#[tauri::command]
fn main() -> std::io::Result<()> {
    // set_rpc_thread();

    // std::thread::sleep(std::time::Duration::from_secs(500));
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            set_rpc_thread,
            set_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
