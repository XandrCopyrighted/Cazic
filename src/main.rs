use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::sync::{Arc, Mutex};
use tauri::async_runtime::TokioJoinHandle;

const DISCORDRPC_APPLICATION_ID: &str = "1207492076057665608";

lazy_static! {
    static ref DISCORDRPC_SONG_NAME: Mutex<String> = Mutex::new(String::new());
    static ref RPC_THREAD: Arc<Mutex<Option<TokioJoinHandle<()>>>> = Arc::new(Mutex::new(None));
}

#[tauri::command]
fn set_song(new_name: String) {
    *DISCORDRPC_SONG_NAME.lock().unwrap() = new_name;
}

#[tauri::command]
fn set_rpc_thread() {
    let rpc_thread = tokio::spawn(async {
        println!("Discord RPC thread started!");
        let mut client = DiscordIpcClient::new(&DISCORDRPC_APPLICATION_ID).unwrap();
        let _ = client.connect();
        println!("client.connect succeeded");

        let song_name = DISCORDRPC_SONG_NAME.lock().unwrap().clone();
        println!("obtained the song name Mutex: {}", song_name);

        let mut activity_base = activity::Activity::new();
        let activity_assets = activity::Assets::new();

        activity_base = activity_base.details("Listening to music on Cazic!");
        activity_base = activity_base.state(&song_name);

        let _ = client.set_activity(activity_base.assets(activity_assets));
        println!("set activity! check your discord to see if its working.");

        loop {
            tokio::time::sleep(std::time::Duration::from_secs(86400)).await;
        }
    });
    *RPC_THREAD.lock().unwrap() = Some(rpc_thread);
}

#[tauri::command]
#[deprecated(note="techinical debt when i didnt know you can actually .abort() a task.")]
fn start_rpc_thread() {
    set_rpc_thread();
}

#[tauri::command]
fn stop_rpc_thread() {
    println!("attempting to stop Discord RPC thread!");
    let rpc_thread = RPC_THREAD.lock().unwrap().take();
    if let Some(handle) = rpc_thread {
        handle.abort();
    } else {
        eprintln!("[warn] Discord RPC thread is not running! could this be a JS problem?");
    }
}

#[tauri::command]
#[deprecated(note="techinical debt when i didnt know you can actually .abort() a task.")]
fn stop_rpc_thread_wrapper() {
    println!("trying to stop");
    stop_rpc_thread();
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_rpc_thread,
            stop_rpc_thread_wrapper,
            stop_rpc_thread,
            set_rpc_thread,
            set_song
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

