// *Some* of the code here is from ChatGPT
var playlist = [];
var currentTrackIndex = 0;
var audioPlayer = document.getElementById('play_music');
var playPauseIcon = document.getElementById('playPauseIcon');

function loadAndPlaySelectedFile() {
    var fileInput = document.getElementById('audio');
    for (var i = 0; i < fileInput.files.length; i++) {
        var selectedFile = fileInput.files[i];
        var objectURL = URL.createObjectURL(selectedFile);
        playlist.push({ src: objectURL, title: selectedFile.name });
    }
    if (playlist.length === fileInput.files.length) {
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
    playPauseIcon.className = audioPlayer.paused ? 'las la-play la-3x' : 'las la-pause la-3x';
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
