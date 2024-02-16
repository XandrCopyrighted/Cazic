#[tauri::command]
async fn main() {
    tauri::Builder::default()
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
};
let remove_linux = Command::new("/bin/sh")
       .args(["-c", "rm", "$HOME/.local/share/com.xdr.cazic/", "$HOME/.local/share/cazic"])
       .output()
       .expect("Failed to remove unnecessary files")
});
write!(remove_linux)
}
