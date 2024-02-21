const invoke = window.__TAURI__.invoke; // load Tauri's invoke so we can call rust from here.

var playlist = [];
var currentTrackIndex = 0;
var audioPlayer = document.getElementById('play');
var playPauseIcon = document.getElementById('playPauseIcon');
var select = document.getElementById('audio');
var fileselect = document.getElementById('audio');


function selectFile() {
    select.type = 'file';
    select.multiple = "multiple"
    select.accept = "audio/mp3, audio/wav, audio/flac, audio/ogg"
    select.click();
}

function loadAndPlaySelectedFile() { // ChatGPT
    for (var i = 0; i < fileselect.files.length; i++) {
        var selectedFile = fileselect.files[i];
        var objectURL = URL.createObjectURL(selectedFile);
        playlist.push({ src: objectURL, title: selectedFile.name });
    }
    if (playlist.length === fileselect.files.length) {
        playTrack(0);
    }
}

function playTrack(index) {
	currentTrackIndex = index;
	audioPlayer.src = playlist[index].src;
	audioPlayer.load();
	audioPlayer.play();
	updatePlayPauseIcon();
	stopDiscordRPC(); // TODO: add check to see if rpc is actually running
	setDiscordRPCSong();
	startDiscordRPC();
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