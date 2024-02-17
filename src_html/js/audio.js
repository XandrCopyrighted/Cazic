// Some of the code here is from ChatGPT, since I just started learning JavaScript... - XandrCopyrighted
var playlist = [];
var currentTrackIndex = 0;
var audioPlayer = document.getElementById('play');
var playPauseIcon = document.getElementById('playPauseIcon');

navigator.mediaSession.setActionHandler('play', () => {audioPlayer.play();});
navigator.mediaSession.setActionHandler('pause', () => {audioPlayer.pause();});
navigator.mediaSession.setActionHandler('nexttrack', () => {nextTrack();});
navigator.mediaSession.setActionHandler('previoustrack', () => {prevTrack();}); // Only work on browsers, not the Tauri app

function selectFile() {
    var select = document.getElementById('audio');
    select.type = 'file';
    select.multiple = "multiple"
    select.accept = "audio/mp3, audio/wav, audio/flac, audio/ogg"
    select.click();
}

function loadAndPlaySelectedFile() { // ChatGPT
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

function playTrack(index) { // Edited by ChatGPT
    currentTrackIndex = index;
    audioPlayer.src = playlist[index].src;
    audioPlayer.load();
    audioPlayer.play().then(() => {
        updatePlayPauseIcon();
    });
}

function togglePlayandPause() {
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

/*
function start_rpc() {
    invoke("start_rpc_thread");
}

function stop_rpc() {
    // TODO: implement
    invoke("stop_rpc_thread_wrapper")
}
*/


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