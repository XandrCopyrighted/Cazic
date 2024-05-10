document.getElementById('input').addEventListener('change', handleFileSelect);
document.getElementById('chooseFile').addEventListener('click', () => document.getElementById('input').click());

let queue = [];
let originalQueue = [];
let currentIndex = 0;
let audioPlayer = new Audio();
let playPauseIcon = document.getElementById('playPauseIcon');
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const invoke = window.__TAURI__.invoke; // Calls Rust from here.

function handleFileSelect(event) {
   const files = event.target.files;
   for (let i = 0; i < files.length; i++) {
      const file = files[i];
      jsmediatags.read(file, {
         onSuccess: function (tag) {
            const tags = tag.tags;
            const artist = tags.artist || 'Unknown Artist';
            const title = tags.title || file.name;
            const album = tags.album || 'Unknown Album';
            const image = tags.image;
            const src = URL.createObjectURL(file);
            queue.push({
               src: src,
               title: title,
               artist: artist,
               album: album,
               image: image
            });
            queue.sort((a, b) => a.title.localeCompare(b.title)); // Alphabetically
            if (!isPlaying) {
               playAudio(0);
            }
         },
         onError: function (error) {
            console.log('Error reading tags: ', error);
         }
      });
   }
}

function playAudio(index) {
    if (index !== undefined) currentIndex = index;
    if (isPlaying) {
        audioPlayer.pause();
        invoke("stop_rpc_thread"); // Stops the Discord RPC
    }
    audioPlayer.src = queue[currentIndex].src;
    audioPlayer.play();
    isPlaying = true;
    updateMusicInfo();
    updatePlayPauseIcon();
    startDiscordRPC();
}

audioPlayer.addEventListener('canplay', function () {
    audioPlayer.play();
});

progressbar.addEventListener('click', e => {
    const clickPosition = e.clientX - progressbar.getBoundingClientRect().left;
    const newPosition = clickPosition / progressbar.offsetWidth;
    audioPlayer.currentTime = newPosition * audioPlayer.duration;
});

audioPlayer.addEventListener('timeupdate', function () {
    let position = audioPlayer.currentTime / audioPlayer.duration * 100;
    document.getElementById('progressbar').value = position;
});

audioPlayer.addEventListener('ended', function () {
    invoke("stop_rpc_thread");
    if (isRepeat) {
        playAudio(currentIndex);
    } else {
        playNextTrack();
    }
    updateMusicInfo();
    startDiscordRPC();
});

function togglePlayandPause() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    updatePlayPauseIcon();
    isPlaying = !isPlaying;
}

function updatePlayPauseIcon() {
    playPauseIcon.className = audioPlayer.paused ? 'bx bx-play-circle bx-md' : 'bx bx-pause-circle bx-md';
}

function playNextTrack() {
    if (isShuffle) {
        currentIndex = getRandomIndex(queue.length, currentIndex);
    } else {
        currentIndex = (currentIndex + 1) % queue.length;
    }
    playAudio(currentIndex);
    updateMusicInfo();
}

function playPrevTrack() {
    if (isShuffle) {
        currentIndex = getRandomIndex(queue.length, currentIndex);
    } else {
        currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    }
    playAudio(currentIndex);
    updateMusicInfo();
}

function toggleRepeat() {
    isRepeat = !isRepeat;
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

function getCurrentTrack() {
    return queue[currentIndex].title;
}

function setDiscordRPCSong() {
    const currentTrack = queue[currentIndex];
    const metadata = {
        newName: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album
    };
    invoke("set_song", metadata);
}

function startDiscordRPC() {
    setDiscordRPCSong();
    invoke("start_rpc_thread");
}

function updateMusicInfo() {
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const album = document.getElementById('album');
    const musicInfo = document.querySelector('.music-info > p:first-child');
    // const musicInfoImg = document.getElementById('img');
    if (queue.length > 0) {
        const currentTrack = queue[currentIndex];
        title.textContent = currentTrack.title || 'Unknown Title';
        artist.textContent = currentTrack.artist || 'Unknown Artist';
        album.textContent = currentTrack.album || 'Unknown Album';
        musicInfo.style.display = 'none'; // Hide the default text (the first line under "music-info") (Click on the button to start.. you get the point.)
        // musicInfoImg.src = currentTrack.image || '/../../assets/default_artwork.jpg';
    } else {
        title.textContent = '';
        artist.textContent = '';
        album.textContent = '';
        musicInfo.style.display = 'block'; // Show the default text
        musicInfoImg.src = '';
    }
}