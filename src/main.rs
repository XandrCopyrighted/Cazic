// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};

const DISCORDRPC_APPLICATION_ID: &str = "1207492076057665608";

static mut DISCORDRPC_SONG_NAME: &str = "song name";
static mut DISCORDRPC_ARTIST: &str = "artist";

#[tauri::command]
unsafe fn set_rpc_thread() {
    std::thread::spawn(move || {
        // this code is reused from https://shorturl.at/foDJU
        let mut client = DiscordIpcClient::new(&DISCORDRPC_APPLICATION_ID).unwrap();

        let _ = client.connect();

        let mut activity_base = activity::Activity::new();
        let mut activity_assets = activity::Assets::new();

        activity_base = activity_base.details(DISCORDRPC_ARTIST);
        activity_base = activity_base.state(&DISCORDRPC_SONG_NAME);

        let _ = client.set_activity(activity_base.assets(activity_assets));
        std::thread::sleep(std::time::Duration::from_secs(500));
    });
}

#[tauri::command]
fn main() -> std::io::Result<()> {
    unsafe {
        set_rpc_thread();
    }

    std::thread::sleep(std::time::Duration::from_secs(500));
    // tauri::Builder::default()
    //     .invoke_handler(tauri::generate_handler![
    //         set_rpc_thread
    //     ])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");

    Ok(())
}
