// Some of the code here is from ChatGPT, since I just started learning JavaScript... - XandrCopyrighted
var playlist = [];
var currentTrackIndex = 0;
var audioPlayer = document.getElementById('play');
var playPauseIcon = document.getElementById('playPauseIcon');
var bar = document.getElementById('bar');
var audio = document.getElementById('audio');

navigator.mediaSession.setActionHandler('play', () => {audioPlayer.play();});
navigator.mediaSession.setActionHandler('pause', () => {audioPlayer.pause();});
navigator.mediaSession.setActionHandler('nexttrack', () => {nextTrack();});
navigator.mediaSession.setActionHandler('previoustrack', () => {prevTrack();}); // Browser, not Tauri, smh - XandrCopyrighted

function loadAndPlaySelectedFile() {
    var fileselect = document.getElementById('audio');
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
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseIcon.className = audioPlayer.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function nextTrack() {
    if (currentTrackIndex < playlist.length - 1) {
        playTrack(currentTrackIndex + 1);
    } else {
        playTrack(0);
    }
}

function prevTrack() {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    } else {
        playTrack(playlist.length - 1);
    }
}

function selectFile() {
    audio.type = 'file';
    audio.multiple = "multiple"
    audio.accept = "audio/mp3, audio/wav, audio/flac, audio/ogg"
    audio.click();
}

function bar() {
    if (playTrack > 0) {
        setInterval(() => {
            bar.value = audioPlayer.currentTime;
        }, 500);
    }
}