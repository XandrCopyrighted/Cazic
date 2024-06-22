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
        originalQueue = queue.slice();
        shuffleQueue();
    } else {
        originalQueue = queue.slice();
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

function updateMetadata() {
    const currentTrack = queue[currentIndex];
    const albumArtElement = document.getElementById('album-art');
    const songTitleElement = document.getElementById('song-title');
    const songArtistElement = document.getElementById('song-artist');

    if (currentTrack.image) {
        albumArtElement.src = currentTrack.image;
    } else {
        albumArtElement.src = '../../icons/Cazic/Default_Artwork.jpg';
    }

    songTitleElement.textContent = currentTrack.title || 'Unknown Title';
    songArtistElement.textContent = currentTrack.artist || 'Unknown Artist';
}