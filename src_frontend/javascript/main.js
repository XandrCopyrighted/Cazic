const input = document.getElementById('input');
const fileSelectButton = document.getElementById('fileSelectButton');
const playbackState = document.getElementById('playbackState');
const titleElement = document.getElementById('title');
const artistElement = document.getElementById('artist');
const albumElement = document.getElementById('album');
const audio = new Audio();

let queue = [];
let originalQueue = [];
let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

function handleFileSelect(event) {
    const files = event.target.files;
    for (const file of files) {
        readTags(file);
    }
}

function playAudio(index) {
    if (index !== undefined) currentIndex = index;
    audio.src = queue[currentIndex].src;
    audio.play();
    isPlaying = true;
    //updateMusicInfo();
    updatePlaybackIcon();
    startDiscordRPC();
}

function togglePlaybackState() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlaybackIcon();
}

/*
function togglePlaybackState() {
    if (!isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    updatePlaybackIcon();
}
*/

function updatePlaybackIcon() {
    playbackState.className = audio.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function playNextTrack() {
    if (isShuffle) {
        currentIndex = getRandomIndex(queue.length, currentIndex);
    } else {
        currentIndex = (currentIndex + 1) % queue.length;
    }
    playAudio(currentIndex);
}

function playPrevTrack() {
    if (isShuffle) {
        currentIndex = getRandomIndex(queue.length, currentIndex);
    } else {
        currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    }
    playAudio(currentIndex);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    toggleRepeatColor();
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        originalQueue = [...queue];
        shuffleQueue();
    } else {
        queue = [...originalQueue];
        currentIndex = 0;
    }
    toggleShuffleColor();
}

function shuffleQueue() {
    for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    currentIndex = 0;
}

function getRandomIndex(max, exclude) {
    let index = Math.floor(Math.random() * max);
    while (index === exclude) {
        index = Math.floor(Math.random() * max);
    }
    return index;
}

//function updateMusicInfo() {
//    const currentTrack = queue[currentIndex];
//    titleElement.textContent = currentTrack ? currentTrack.title || 'Unknown Title' : '';
//    artistElement.textContent = currentTrack ? currentTrack.artist || 'Unknown Artist' : '';
//    albumElement.textContent = currentTrack ? currentTrack.album || 'Unknown Album' : '';
//}

window.onload = function() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};

    // Apply the settings to the application
    // Example: applyTheme(settings.theme);
}