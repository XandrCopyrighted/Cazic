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
fn start_rpc_thread() {
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
/// Lets you know whether the Discord RPC thread is up.
///
/// This code will try and get a Mutex to the RPC_THREAD mutex lock from lazy_static. This can
/// potentally deadlock if something is hogging the Mutex. This returns true if it is up, false if
/// its down.
///
/// Append `true` to the parameters to kill the thread. If you do that, then the `true` return
/// value should be intrepreted as "the thread was up".
///
/// Example:
///
/// ```rust
/// if is_rpc_thread_up(false) { // change to true to kill the thread, if its up.
///     println!("RPC thread is up!");
/// } else {
///     println!("RPC thread is down!");
/// }
/// ```
fn is_rpc_thread_up(kill: bool) -> bool {
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
fn stop_rpc_thread() {
    println!("attempting to stop Discord RPC thread!");
    if is_rpc_thread_up(true) {
        println!("thread was up and should be stopped.");
    } else {
        eprintln!("[warn] Discord RPC thread is not running! could this be a JS problem?");
    }
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_rpc_thread,
            stop_rpc_thread,
            set_song,
            is_rpc_thread_up
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

