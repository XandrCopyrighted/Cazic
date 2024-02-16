use std::process::Command;
use std::thread;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn main() {
    // Your existing Tauri initialization code
    tauri::Builder::default()
       .run(tauri::generate_context!())
       .expect("error while running tauri application");

    // Check if the target OS is Linux and remove unnecessary files
    #[cfg(target_os = "linux")]
    {
        let remove_linux = thread::spawn(|| {
            Command::new("/bin/sh")
                .arg("-c")
                .arg("rm -rf $HOME/.local/share/com.xdr.cazic/ $HOME/.local/share/cazic")
                .output()
                .expect("Failed to remove unnecessary files");
        });

        // Wait for the thread to finish before exiting the program
        remove_linux.join().unwrap();
    }
}
