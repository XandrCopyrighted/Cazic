const invoke = window.__TAURI__.invoke;

function startDiscordRPC() {
    const currentTrack = queue[currentIndex];
    const metadata = {
        songName: currentTrack.title,
        artist: currentTrack.artist
        /* album: currentTrack.album,
        image: currentTrack.image */
    };
    invoke("set_song", metadata);
    invoke("start_rpc_thread");
}

function stopDiscordRPC() {
    invoke("stop_rpc_thread");
}