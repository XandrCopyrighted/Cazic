<!-- markdownlint-disable MD033 MD041 MD051 MD026 -->

<img width="64" height="64" align="left" style="float: left; margin: 20 10px 0 10;" src="assets/logo.png" alt="Logo for Cazic">

# Cazic

Another music application created with [Tauri](https://tauri.app/).

## Table of contents

- [🧠 Features](#🧠-features)
- [🛠️ Troubleshooting](#🛠️-troubleshooting)
- [📦 Development & manual installation](#📦-development--manual-installation)

## 🧠 Features

- Discord RPC
- Album art as background (okay this isn't merged yet)
- Playlist support
- Can become the system handler for media files (okay this isn't merged either)
- Keyboard shortcuts to efficiently manage what's playing (partial support as of right now)
- Loop, shuffle, everything you would expect from a modern music player
- Memory safety with Rust 🦀🦀🦀

and much more!

## 🛠️ Troubleshooting

### The app isn't starting!

**On Windows**, please ensure you have [Microsoft Edge Webview 2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/?form=MA13LH#download) installed.

**On Linux**, please ensure you have `webkit2gtk` or `libwebkitgtk` installed. If that doesn't work, try [this step in Tauri's documentation](https://tauri.app/v1/guides/getting-started/prerequisites#1-system-dependencies).

> [!IMPORTANT]
> You do **NOT** need Rust to run Cazic.

### Audio doesn't work! (Linux)

Try installing the `gst-plugins-good` or `gstreamer1.0-plugins-good` package:

**Arch Linux**:

```shell
sudo pacman -S gst-plugins-good
```

**Debian**:

```shell
sudo apt install gstreamer1.0-plugins-good
```

**Gentoo**:

```shell
emerge -av media-libs/gst-plugins-good
```

# 📦 Development & manual installation

> [!NOTE]
> This section is for developers & advanced users. If you are looking for downloads, view the [releases page](https://github.com/XandrCopyrighted/Cazic/releases)

<!-- To compile this app from source, you will need the [Rust Toolchain](https://rustup.rs) and [Tauri's build deps](https://tauri.app/v1/guides/getting-started/prerequisites#1-system-dependencies) if you are on Linux. -->

This section assumes you have everything needed to build a Tauri app. That includes the [Rust Toolchain](https://rustup.rs) and [tauri-cli](https://tauri.app/v1/api/cli/) (which can be installed with `cargo install tauri-cli`), along with git (if you're planning to download this repo from the command line)

```shell
git clone https://github.com/XandrCopyrighted/Cazic.git
cd Cazic
cargo tauri dev
```

If you would like to download the latest bleeding-edge version, download the build artifacts from the [actions](https://github.com/XandrCopyrighted/Cazic/actions) section.
