const invoke = window.__TAURI__.invoke; // load Tauri's invoke so we can call rust from here.
document.getElementById('input').addEventListener('change', handleFileSelect);

let playlist = [];
let currentIndex = 0;
let audioPlayer = document.getElementById('audio');
let playPauseIcon = document.getElementById('playPauseIcon');
let filesProcessed = 0;

const prevBtn = document.querySelector('.playPrevTrack');
const playBtn = document.querySelector('.togglePlayandPause');
const nextBtn = document.querySelector('.playNextTrack');

function handleFileSelect(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        playlist.push(URL.createObjectURL(files[i]));
    }
    playAudio();
}

document.getElementById('choose-file').addEventListener('click', function() {
    document.getElementById('input').click();
});

function playAudio() {
    if (playlist.length === 0) {
        alert("bals, add some music will ya?");
        return;
    }
}

function togglePlayandPause() {
    if (audioPlayer.paused) {
        currentIndex = (currentIndex + 1) % playlist.length;
        audioPlayer.src = playlist[currentIndex];
        audioPlayer.play();
        startDiscordRPC();
    } else {
        audioPlayer.pause();
        stopDiscordRPC();
        audioPlayer.currentTime = 0;
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseIcon.className = audioPlayer.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function playNextTrack() {
    if (currentIndex < playlist.length - 1) playAudio(currentIndex + 1);
    else playAudio(0);
}

function playPrevTrack() { 
    if (currentIndex > 0) playAudio(currentIndex - 1);
    else playAudio(playlist.length - 1);
}

bar.addEventListener('click', function (e) { // ChatGPT
    let clickPosition = e.clientX - this.getBoundingClientRect().left;
    let newPosition = clickPosition / this.offsetWidth;
    audioPlayer.currentTime = newPosition * audioPlayer.duration;
});

audioPlayer.addEventListener('timeupdate', function () {
    let position = audioPlayer.currentTime / audioPlayer.duration * 100;
    bar.value = position;
});

function getCurrentTrack() {
    let raw = playlist[currentTrackIndex];
    return raw["title"]; // raw title hahah
}

function setDiscordRPCSong() {
    const next = getCurrentTrack();
    invoke("set_song", { newName: next });
}

function startDiscordRPC() {
    invoke("start_rpc_thread");
}

function stopDiscordRPC() {
    invoke("stop_rpc_thread")
}