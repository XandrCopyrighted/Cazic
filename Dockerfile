FROM gitpod/workspace-rust
USER gitpod
RUN sudo apt install mingw-w64 libwebkit2gtk-4.0-dev build-essential curl wget file libssl-dev libgtk-3-dev librsvg2-dev -y
RUN cargo install tauri-cli
RUN cargo build