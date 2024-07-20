#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    cazic_lib::run().expect("Failed to run Cazic");
}
