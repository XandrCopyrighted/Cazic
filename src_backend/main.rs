#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(desktop)]
    cazic_lib::run().expect("Failed to Cazic (Desktop)");

    #[cfg(mobile)]
    cazic_lib::mobile::run().expect("Failed to Cazic (Mobile)");
}
