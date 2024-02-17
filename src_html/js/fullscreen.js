var fullscreenButton = document.getElementById('fullscreen');
/* JavaScript is a pain in the ass.
This took me 15 mins, maybe it's a skill issue. - XandrCopyrighted */

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
    updateFullscreenIcon();
}

function updateFullscreenIcon() {
    fullscreenIcon.className = document.fullscreenElement ?
    'bx bx-fullscreen bx-xs' : 'bx bx-exit-fullscreen bx-xs';
}

fullscreenButton.addEventListener('click', toggleFullscreen);
