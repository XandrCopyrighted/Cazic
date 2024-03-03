<!-- markdownlint-disable MD033 MD041 MD051 MD026 -->

<img width="64" height="64" align="left" style="float: left; margin: 20 10px 0 10;" src="assets/logo.png" alt="Logo for Cazic">

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

<p align="center" style="margin-bottom: -118px;"><img width="100%" src="assets/README.md/hOBNEGaFxyqx.svg"></p>

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

<p align="center" style="margin-bottom: -85px;"><img width="100%" src="assets/README.md/tJQyJEgGBXim.svg"></p>

<!-- To compile this app from source, you will need the [Rust Toolchain](https://rustup.rs) and [Tauri's build deps](https://tauri.app/v1/guides/getting-started/prerequisites#1-system-dependencies) if you are on Linux. -->

This section assumes you have everything needed to build a Tauri app. That includes the [Rust Toolchain](https://rustup.rs) and [Tauri-CLI](https://beta.tauri.app/references/v2/cli/#tab-panel-454), along with [Git](https://git-scm.com)

```shell
git clone https://codeberg.org/XDR/Cazic.git
cd Cazic
cargo tauri dev
```

To access the most cutting-edge version, download the latest build artifacts from [actions](https://ci.codeberg.org/repos/13123).
