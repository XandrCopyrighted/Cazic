use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use crate::{DISCORDRPC_APPLICATION_ID, DISCORDRPC_SONG_NAME, RPC_THREAD};
use colored::Colorize;
use std::sync::atomic::{AtomicBool, Ordering::Relaxed};

lazy_static::lazy_static!{
    static ref RPC_ENABLED: AtomicBool = AtomicBool::new(true);
}

pub fn toggle_rpc() {
    let rpc_enabled = RPC_ENABLED.load(Relaxed);
    println!("[DEBUG] toggling RPC! current RPC_ENABLED: {rpc_enabled}");
    RPC_ENABLED.store(!rpc_enabled, Relaxed);
}

#[tauri::command]
pub fn start_rpc_thread() {
    if !RPC_ENABLED.load(Relaxed) {
        println!("[DEBUG] RPC is disabled! not spawning RPC thread and returning");
        return;
    }
    let rpc_thread = tokio::spawn(async {
        println!("{} thread started!", "Discord RPC".magenta());
        let mut client = DiscordIpcClient::new(DISCORDRPC_APPLICATION_ID).unwrap();
        if let Err(err) = client.connect() {
            eprintln!("Failed to connect to RPC endpoint! {}", err);
            return;
        }
        println!("Client connected {}", "successfully!".green().bold());

        let song_name = DISCORDRPC_SONG_NAME.lock().unwrap().clone();
        println!("Obtained the song name Mutex: {}", song_name.green().bold());

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
        println!("{} Check your Discord client and see if it's working.", "Activity set!".green().bold());

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
    println!("Attempting to stop {} thread!", "Discord RPC".magenta());
    if is_rpc_thread_up(true) {
        println!("Thread was up and should be stopped.");
    } else {
        eprintln!("[{}] Discord RPC thread is not running! Could this be a {}", "WARN".red().bold(), "JS problem?".italic());
    }
}