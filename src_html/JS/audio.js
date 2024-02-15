const invoke = window.__TAURI__.invoke; // load tauri's invoke so we can call rust from here.

// *Some* of the code here is from ChatGPT
var playlist = [];
var currentTrackIndex = 0;
var audioPlayer = document.getElementById('play');
var playPauseIcon = document.getElementById('playPauseIcon');

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

    setDiscordRPCSong();
    startDiscordRPC();
}

function togglePlayPause() {
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

function selectFile() {
    var select = document.getElementById('audio');
    select.type = 'file';
    select.multiple = "multiple"
    select.accept = "audio/mp3, audio/wav, audio/flac, audio/ogg"
    select.click();
}

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
    invoke("stop_rpc_thread_wrapper")
}

