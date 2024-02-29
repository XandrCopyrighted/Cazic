document.getElementById('input').addEventListener('change', handleFileSelect);
document.getElementById('choose-file').addEventListener('click', () => document.getElementById('input').click());

let playlist = [];
let currentIndex = 0;
let audioPlayer = document.getElementById('audio');
let playPauseIcon = document.getElementById('playPauseIcon');
audioPlayer.autoplay = true;

const invoke = window.__TAURI__.invoke; // Calls rust from here.
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

function playAudio(index) {
    if (index !== undefined) currentIndex = index;
    audioPlayer.src = playlist[currentIndex];
    audioPlayer.currentTime = 0;
    audioPlayer.play();
}


function togglePlayandPause() {
    if (audioPlayer.paused) {
		startDiscordRPC();
		audioPlayer.play();
    } else {
        stopDiscordRPC();
        audioPlayer.pause();
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
    return audioPlayer.src["title"];
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