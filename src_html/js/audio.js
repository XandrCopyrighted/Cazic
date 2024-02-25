const invoke = window.__TAURI__.invoke; // load Tauri's invoke so we can call rust from here.

var playlist = [];
let currentIndex = 0;
let audioPlayer = new Audio();
var playPauseIcon = document.getElementById('playPauseIcon');
var select = document.getElementById('audio');
var fileselect = document.getElementById('audio');
var songTitleElement = document.getElementById('songTitle');
var filesProcessed = 0;

const prevBtn = document.querySelector('.playPrevTrack');
const playBtn = document.querySelector('.togglePlayandPause');
const nextBtn = document.querySelector('.playNextTrack');

document.getElementById('audioInput').addEventListener('change', handleFileSelect);
  
function handleFileSelect(event) {
  const files = event.target.files;
    
  for (let i = 0; i < files.length; i++) {
    playlist.push(URL.createObjectURL(files[i]));
  }
}

function playAudio() {
  if (playlist.length === 0) {
    alert("bals");
    return;
  }
  audioPlayer.src = playlist[currentIndex];
  audioPlayer.play();
  audioPlayer.addEventListener('ended', playNext);
}

function togglePlayandPause() {
    if (audioPlayer.paused) {
		startDiscordRPC();
		currentIndex = (currentIndex + 1) % playlist.length;
		audioPlayer.play();
    } else {
        stopDiscordRPC();
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseIcon.className = audioPlayer.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function playNextTrack() {
    if (currentTrackIndex < playlist.length - 1) {
        playTrack(currentTrackIndex + 1);
    } else {
        playTrack(0);
    }
}

function playPrevTrack() { 
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    } else {
        playTrack(playlist.length - 1);
    }
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

audioPlayer.addEventListener('ended', function () {
    if (currentTrackIndex < playlist.length - 1) {
        playTrack(currentTrackIndex + 1); // Play the next track
    } else {
        audioPlayer.pause(); // Stop playing when it's the end of the playlist
        updatePlayPauseIcon();
    }
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
