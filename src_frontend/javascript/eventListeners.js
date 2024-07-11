const progressBar = document.getElementById('progressBar');
const repeat = document.getElementById('repeat-button');
const shuffle = document.getElementById('shuffle-button');
const volumeBar = document.getElementById('volumeBar');

function handleKeydown(event) {
    switch (event.key) {
        case ' ':
            togglePlaybackState();
            break;
        case 'ArrowLeft':
            audio.currentTime -= 5;
            break;
        case 'ArrowRight':
            audio.currentTime += 5;
            break;
        case 'f':
            toggleFullscreen();
            break;
        case 'r':
            toggleRepeat();
            break;
        case 's':
            toggleShuffle();
            break;
        default:
            break;
    }
}

audio.addEventListener('ended', () => {
    stopDiscordRPC();
    updatePlaybackIcon();
    if (isRepeat) {
        playAudio(currentIndex);
    } else if (queue.length > 1) {
        if (queue[currentIndex].image) {
            URL.revokeObjectURL(queue[currentIndex].image);
        }
        playNextTrack();
    } else {
        isPlaying = false;
        if (queue[currentIndex].image) {
            URL.revokeObjectURL(queue[currentIndex].image);
        }
    }
});

audio.addEventListener('timeupdate', function() {
    if (audio.duration !== 0) {
        const position = (audio.currentTime / audio.duration) * 100;
        progressBar.value = position;
    }
});

document.addEventListener('contextmenu', event => event.preventDefault()); // Disables right click
document.addEventListener('keydown', handleKeydown);
input.addEventListener('change', handleFileSelect);
fileSelectButton.addEventListener('click', () => input.click());

progressBar.addEventListener('click', e => {
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newPosition = clickPosition / progressBar.offsetWidth;
    audio.currentTime = newPosition * audio.duration;
});

volumeBar.addEventListener('input', function() {audio.volume = volumeBar.value});
document.addEventListener('DOMContentLoaded', toggleMetadataVisibility);