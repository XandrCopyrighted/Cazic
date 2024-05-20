var fullscreenButton = document.getElementById('fullscreen');
var fullscreenIcon = fullscreenButton.querySelector('i');
fullscreenButton.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
    }
    updateFullscreenIcon()
}

function updateFullscreenIcon() {
    fullscreenIcon.className = document.fullscreenElement ? 'bx bx-fullscreen bx-xs' : 'bx bx-exit-fullscreen bx-xs'
}