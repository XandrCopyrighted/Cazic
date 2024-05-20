const invoke = window.__TAURI__.invoke;

function startDiscordRPC() {
    setDiscordRPCSong();
    invoke("start_rpc_thread");
}

function setDiscordRPCSong() {
    const currentTrack = queue[currentIndex];
    const metadata = {
        newName: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album
    };
    invoke("set_song", metadata);
}

function stopDiscordRPC() {
    invoke("stop_rpc_thread");
}