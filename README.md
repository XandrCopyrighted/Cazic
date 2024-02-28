<!-- markdownlint-disable MD033 MD041 -->

<img width="64" height="64" align="left" style="float: left; margin: 20 10px 0 10;" src="assets/logo.png" alt="Logo for Cazic">

# Cazic

Another music application created with [Tauri](https://tauri.app/)

## Table of contents

- [Features](#features)
- [Troubleshooting](#troubleshooting)

## Features

- Discord RPC
- Album art as background (okay this isn't merged yet)
- Playlist support
- Can become the system handler for media files (okay this isn't merged either)
- Keyboard shortcuts to efficiently manage what's playing (partial support as of right now)
- Loop, shuffle, everything you would expect from a modern music player

and much more!

## Troubleshooting

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
