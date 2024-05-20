function updatePlaybackIcon() {
    playbackState.className = audio.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function updateArtworkBgIcon() {
    artworkBgState.className = document.fullscreenElement ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}