#[tokio::main]       // is there even a need for this?
pub async fn run() { // dunno.
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("Error running Cazic");
}
