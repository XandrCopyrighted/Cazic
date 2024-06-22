window.onload = function() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    const savedTheme = settings.theme || 'dark';

    applyTheme(savedTheme);

    const themeRadios = document.querySelectorAll('input[name="theme"]');
    for (const radio of themeRadios) {
        radio.checked = (radio.value === savedTheme);
    }
    applyTheme(savedTheme);
};

function toggleSettingsPage() {
    const saveButton = document.getElementById('saveSettings');
    const settingsOverlay = document.getElementById('settings-page');

    if (settingsOverlay.style.display === 'none') {
        settingsOverlay.style.display = 'block';
        saveButton.addEventListener('click', saveSettings);
    } else {
        closeSettings();
    }

    function saveSettings() {
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        let selectedTheme;

        for (const radio of themeRadios) {
            if (radio.checked) {
                selectedTheme = radio.value;
                break;
            }
        }

        const settings = {
            theme: selectedTheme
        };

        localStorage.setItem('settings', JSON.stringify(settings));
        closeSettings();
        applyTheme(selectedTheme);
    }

    function closeSettings() {
        settingsOverlay.style.display = 'none';
        saveButton.removeEventListener('click', saveSettings);
    }
}

function applyTheme(theme) {
    const body = document.body;

    body.classList.remove('theme-amoled', 'theme-rose-pine', 'theme-dracula');

    if (theme === 'amoled') {
        body.classList.add('theme-amoled');
    } else if (theme === 'rose-pine') {
        body.classList.add('theme-rose-pine');
    } else if (theme === 'dracula') {
        body.classList.add('theme-dracula');
    }
}

function toggleQueuePage() {
    const queuePage = document.getElementById('queue-page');

    queuePage.style.display = queuePage.style.display === 'none' ? 'block' : 'none';
    updateQueueList();
}

function updateQueueList() {
    const queueList = document.getElementById('queue-list');
    queueList.innerHTML = '';

    for (let i = 0; i < queue.length; i++) {
        const track = queue[i];
        const listItem = document.createElement('li');
        listItem.classList.add('queue-item');

        const container = document.createElement('div');
        container.id = 'container';

        const albumArt = document.createElement('img');
        albumArt.id = 'album-art';
        albumArt.src = track.image ? track.image : '../../icons/Cazic/Default_Artwork.jpg';
        container.appendChild(albumArt);

        const songInfo = document.createElement('div');
        songInfo.id = 'song-info';

        const songTitle = document.createElement('span');
        songTitle.id = 'song-title';
        songTitle.textContent = track.title;
        songInfo.appendChild(songTitle);

        const songArtist = document.createElement('span');
        songArtist.id = 'song-artist';
        songArtist.textContent = track.artist;
        songInfo.appendChild(songArtist);

        container.appendChild(songInfo);

        const removeButton = document.createElement('button');
        removeButton.classList.add('icon-default');
        removeButton.innerHTML = '<i class="bx bx-x bx-xs"></i>';
        removeButton.dataset.index = i;
        removeButton.addEventListener('click', removeSongFromQueue);

        listItem.appendChild(container);
        listItem.appendChild(removeButton);
        queueList.appendChild(listItem);
    }
}

function removeSongFromQueue(event) {
    const index = parseInt(event.currentTarget.getAttribute('data-index'), 10);
    const removedTrack = queue.splice(index, 1)[0];

    if (removedTrack.image) {
        URL.revokeObjectURL(removedTrack.image);
    }

    if (index < currentIndex) {
        currentIndex--;
    } else if (index === currentIndex && queue.length > 0) {
        playNextTrack();
    }
    updateQueueList();
}