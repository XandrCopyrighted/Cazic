document.getElementById('input').addEventListener('change', handleFileSelect);
document.getElementById('choose-file').addEventListener('click', () => document.getElementById('input').click());

let queue = [];
let currentIndex = 0;
let audioPlayer = document.getElementById('audio');
let playPauseIcon = document.getElementById('playPauseIcon');
let isPlaying = false;

const invoke = window.__TAURI__.invoke; // Calls Rust from here.

function handleFileSelect(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        queue.push({
            src: URL.createObjectURL(files[i]),
            title: files[i].name
        });
    }
    queue.sort((a, b) => a.title.localeCompare(b.title)); // Alphabetically
    if (!isPlaying) {
        playNextTrack();
    }
}

function playAudio(index) {
    if (index !== undefined) currentIndex = index;
    if (isPlaying) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    audioPlayer.src = queue[currentIndex].src;
    audioPlayer.play();
    isPlaying = true;
    updatePlayPauseIcon();
}

audioPlayer.addEventListener('canplay', function () {
    audioPlayer.play();
    startDiscordRPC();
});

bar.addEventListener('click', e => {
    const clickPosition = e.clientX - bar.getBoundingClientRect().left;
    const newPosition = clickPosition / bar.offsetWidth;
    audioPlayer.currentTime = newPosition * audioPlayer.duration;
});

audioPlayer.addEventListener('timeupdate', function () {
    let position = audioPlayer.currentTime / audioPlayer.duration * 100;
    document.getElementById('bar').value = position;
});

audioPlayer.addEventListener('ended', function () {
    stopDiscordRPC();
    playNextTrack();
});

function togglePlayandPause() {
    if (audioPlayer.paused) {
        startDiscordRPC();
        audioPlayer.play();
        isPlaying = true;
    } else {
        stopDiscordRPC();
        audioPlayer.pause();
        isPlaying = false;
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseIcon.className = audioPlayer.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function playNextTrack() {
    currentIndex = (currentIndex + 1) % queue.length;
    playAudio(currentIndex);
}

function playPrevTrack() {
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    playAudio(currentIndex);
}

function getCurrentTrack() {
    return queue[currentIndex].title;
}

function setDiscordRPCSong() {
    const next = getCurrentTrack();
    invoke("set_song", { newName: next });
}

function startDiscordRPC() {
    setDiscordRPCSong();
    invoke("start_rpc_thread");
}

function stopDiscordRPC() {
    invoke("stop_rpc_thread");
}