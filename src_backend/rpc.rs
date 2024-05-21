use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use crate::{DISCORDRPC_SONG_NAME, RPC_THREAD};
use std::sync::atomic::{AtomicBool, Ordering::Relaxed};

const DISCORDRPC_APPLICATION_ID: &str = "1207492076057665608";

lazy_static::lazy_static!{
    static ref RPC_ENABLED: AtomicBool = AtomicBool::new(true);
}

pub fn toggle_rpc() {
    let rpc_enabled = RPC_ENABLED.load(Relaxed);
    println!("\x1b[33m[DEBUG]\x1b[0m Toggling RPC! Current RPC_ENABLED status: {rpc_enabled}");
    RPC_ENABLED.store(!rpc_enabled, Relaxed);
}

#[tauri::command]
pub fn start_rpc_thread() {
    if !RPC_ENABLED.load(Relaxed) {
        println!("\x1b[33m[DEBUG]\x1b[0m RPC is disabled! RPC thread will not be spawned and returning");
        return;
    }
    let rpc_thread = tokio::spawn(async {
        println!("\x1b[35mDiscord RPC\x1b[0m thread started!");
        let mut client = DiscordIpcClient::new(DISCORDRPC_APPLICATION_ID).unwrap();
        if let Err(err) = client.connect() {
            eprintln!("Failed to connect to RPC endpoint! {}", err);
            return;
        }
        println!("Client connected \x1b[1;32msuccessfully!\x1b[0m");

        let song_name = DISCORDRPC_SONG_NAME.lock().unwrap().clone();
        println!("Obtained the song name Mutex: \x1b[1;32m{}\x1b[0m", song_name);

        let (new_name_no_format, artist) = match song_name.split_once(" - ") {
            Some((title, artist)) => (title.to_string(), artist.to_string()),
            None => (song_name.clone(), "".to_string()),
        };

        let mut activity_base = activity::Activity::new();
        let activity_assets = activity::Assets::new();

        activity_base = activity_base.state(&new_name_no_format);
        activity_base = activity_base.details(&artist); // These 2 are the opposite??!?
        activity_base = activity_base.timestamps(activity::Timestamps::new().start(std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs() as i64));

        if let Err(err) = client.set_activity(activity_base.assets(activity_assets)) {
            eprintln!("Failed to set activity! {}", err);
            return;
        }
        println!("\x1b[1;32mActivity set!\x1b[0m Check your Discord client and see if it's working.");

        loop {
            tokio::time::sleep(std::time::Duration::from_secs(86400)).await;
        }
    });
    *RPC_THREAD.lock().unwrap() = Some(rpc_thread);
}

#[tauri::command]
pub fn is_rpc_thread_up(kill: bool) -> bool {
    let rpc_thread = RPC_THREAD.lock().unwrap().take();
    if let Some(handle) = rpc_thread {
        if kill {
            handle.abort();
        }
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn stop_rpc_thread() {
    println!("Attempting to stop \x1b[35mDiscord RPC\x1b[0m thread!");
    if is_rpc_thread_up(true) {
        println!("Thread was up and should be stopped.");
    } else {
        eprintln!("\x1b[1;31m[WARN]\x1b[0m Discord RPC thread is not running! Could this be a \x1b[3mJS problem?\x1b[0m");
    }
}