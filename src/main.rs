use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;

use once_cell::sync::Lazy;

const DISCORDRPC_APPLICATION_ID: &str = "1207492076057665608";

static STOP_FLAG: Lazy<Arc<AtomicBool>> = Lazy::new(|| Arc::new(AtomicBool::new(false))); // FIXME: how to not once_cell?

lazy_static! {
    static ref DISCORDRPC_SONG_NAME: Mutex<String> = Mutex::new(String::new());
    // static ref STOP_FLAG: Mutex<Arc<AtomicBool>> = Mutex::new();
}

#[tauri::command]
fn set_song(new_name: String) {
    *DISCORDRPC_SONG_NAME.lock().unwrap() = new_name;
}

// fn set_rpc_thread(stop_flag: Arc<AtomicBool>) {
fn set_rpc_thread(stop_flag: Arc<AtomicBool>) {
    let stop_flag_clone = stop_flag.clone();
    thread::spawn(move || {
        let mut client = DiscordIpcClient::new(&DISCORDRPC_APPLICATION_ID).unwrap();
        let _ = client.connect();

        let song_name = DISCORDRPC_SONG_NAME.lock().unwrap().clone();

        let mut activity_base = activity::Activity::new();
        let activity_assets = activity::Assets::new();

        activity_base = activity_base.details("Listening to music on Cazic!");
        activity_base = activity_base.state(&song_name);

        let _ = client.set_activity(activity_base.assets(activity_assets));

        while !stop_flag_clone.load(Ordering::Relaxed) {
            thread::sleep(std::time::Duration::from_secs(1));
        }
        println!("got stop signal");
        let _ = client.close();
    });
}

#[tauri::command]
fn start_rpc_thread() {
    // let stop_flag = STOP_FLAG.lock().unwrap();
    set_rpc_thread(STOP_FLAG.clone());
}

fn stop_rpc_thread(stop_flag: Arc<AtomicBool>) {
    stop_flag.store(true, Ordering::Relaxed);

    thread::sleep(std::time::Duration::from_millis(1100));
    stop_flag.store(false, Ordering::Relaxed);
}

#[tauri::command]
fn stop_rpc_thread_wrapper() {
    println!("trying to stop");
    stop_rpc_thread(STOP_FLAG.clone());
}

fn main() -> std::io::Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_rpc_thread,
            stop_rpc_thread_wrapper,
            set_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

