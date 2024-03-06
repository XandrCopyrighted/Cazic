<!-- markdownlint-disable MD033 MD041 MD051 MD026 -->

<img width="64" height="64" align="left" style="float: left; margin: 20 10px 0 10;" src="assets/logo.png" alt="Logo">

# Cazic

Another music application created with [Tauri](https://tauri.app/).

## Table of contents

- [🧠 Features](#features)
- [🛠️ Troubleshooting](#troubleshooting)
- [📦 Development & manual installation](#development--manual-installation)

## Features

- Discord RPC
- Album art as background (okay this isn't merged yet)
- Playlist support
- Can become the system handler for media files (okay this isn't merged either)
- Keyboard shortcuts to efficiently manage what's playing (partial support as of right now)
- Loop, shuffle, everything you would expect from a modern music player
- Memory safety with Rust 🦀🦀🦀

and much more!

## Troubleshooting

### The app isn't starting!

**On Windows**, please ensure you have [Microsoft Edge WebView2](https://go.microsoft.com/fwlink/p/?LinkId=2124703) installed.

**On Linux**, please ensure you have `webkit2gtk` or `libwebkitgtk` installed. If that doesn't work, try [this step in Tauri's documentation](https://beta.tauri.app/guides/prerequisites/#linux).

<div align="center">
   <img width="32" src="assets/README.md/pin.svg">
   <p>You do <b>NOT</b> need Rust to run Cazic.</p>
</div>

### Audio doesn't work! (Linux)

Try installing the `gst-plugins-good` package:

**Arch Linux**:

```shell
sudo pacman -S gst-plugins-good
```

**Fedora**:

```shell
sudo dnf install gstreamer1-plugins-good
```

**Gentoo**:

```shell
emerge -av media-libs/gst-plugins-good
```

**Debian**:

```shell
sudo apt install gstreamer1.0-plugins-good
```

# Development & manual installation

<div align="center">
   <img width="32" src="assets/README.md/pin.svg">
   <p>This section is for developers &amp; advanced users: If you're seeking downloads, please check out our <b><a href="https://codeberg.org/XDR/Cazic/releases">releases page</a></b>.</p>
</div>

This section assumes you have everything needed to build a Tauri app. That includes the [Rust Toolchain](https://rustup.rs) and [Tauri-CLI](https://beta.tauri.app/references/v2/cli/#tab-panel-454), along with [Git](https://git-scm.com)

```shell
git clone https://codeberg.org/XDR/Cazic.git
cd Cazic
cargo tauri dev
```

To access the most cutting-edge version, download the latest build artifacts from [actions](https://github.com/XandrCopyrighted/Cazic/Actions).