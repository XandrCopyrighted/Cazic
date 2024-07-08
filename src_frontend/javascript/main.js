const playbackState = document.getElementById('playbackState');
const titleElement = document.getElementById('title');
const artistElement = document.getElementById('artist');
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
    setTimeout(updateQueueList, 0);
}

function playAudio(index) {
    if (index !== undefined) currentIndex = index;
    audio.src = queue[currentIndex].src;
    updateQueueList();
    updateMetadata();
    audio.play();
    isPlaying = true;
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

function updatePlaybackIcon() {
    playbackState.className = audio.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function playNextTrack() {
    stopDiscordRPC()
    if (isShuffle) {
        currentIndex = getRandomIndex(queue.length, currentIndex);
    } else {
        currentIndex = (currentIndex + 1) % queue.length;
    }
    playAudio(currentIndex);
}

function playPrevTrack() {
    stopDiscordRPC()
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    playAudio(currentIndex);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeat.classList.toggle('icon-default');
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        originalQueue = queue.slice();
        shuffleQueue();
    } else {
        originalQueue = queue.slice();
        currentIndex = 0;
    }
}

function toggleMetadataVisibility() {
    const ui = document.querySelector('.metadata');
    if (queue.length === 0) {
        ui.style.display = 'none';
    } else {
        ui.style.display = 'flex';
    }
}

function updateMetadata() {
    const currentTrack = queue[currentIndex];
    const albumArtElement = document.getElementById('album-art');
    const titleElement = document.getElementById('song-title');
    const artistElement = document.getElementById('song-artist');

    if (currentTrack.image) {
        albumArtElement.src = currentTrack.image;
    } else {
        albumArtElement.src = '../../icons/Cazic/Default_Artwork.jpg';
    }

    titleElement.textContent = currentTrack.title || 'Unknown Title';
    artistElement.textContent = currentTrack.artist || 'Unknown Artist';

    toggleMetadataVisibility();
}

function getRandomIndex(max, exclude) {
    let index = Math.floor(Math.random() * max);
    while (index === exclude) {
        index = Math.floor(Math.random() * max);
    }
    return index;
}

toggleMetadataVisibility();