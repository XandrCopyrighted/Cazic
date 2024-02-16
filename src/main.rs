// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn main() {
    tauri::Builder::default()
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}

#[cfg(target_os = "linux")]
let remove_linux = thread::spawn(|| {
   Command::new("/bin/sh")
       .args(["-c", "rm", "$HOME/.local/share/com.xdr.cazic/", "$HOME/.local/share/cazic"])
       .output()
       .expect("Failed to remove unnecessary files")
});
write!(remove_linux)