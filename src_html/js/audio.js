const invoke = window.__TAURI__.invoke; // load Tauri's invoke so we can call rust from here.

var playlist = [];
var currentTrackIndex = 0;
var audioPlayer = document.getElementById('play');
var playPauseIcon = document.getElementById('playPauseIcon');
var select = document.getElementById('audio');
var fileselect = document.getElementById('audio');
var songTitleElement = document.getElementById('songTitle');
var filesProcessed = 0;


function selectFile() {
    select.type = 'file';
    select.multiple = "multiple"
    select.accept = "audio/mp3, audio/flac"
    select.click();
}

function loadAndPlaySelectedFile() {
    for (var i =  0; i < fileselect.files.length; i++) {
        (function (selectedFile) {
            jsmediatags.read(selectedFile, {
                onSuccess: function (tag) {
                    var title = tag.tags.title ? tag.tags.title : selectedFile.name;
                    playlist.push({ src: URL.createObjectURL(selectedFile), title: title });
                    if (songTitleElement) {
                        songTitleElement.textContent = title;
                    }
                    filesProcessed++;
                    if (filesProcessed === fileselect.files.length) {
                        playTrack(0);
                    }
                }
            });
        })(fileselect.files[i]);
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