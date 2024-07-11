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
    const settingsOverlay = document.getElementById('settingsPage');

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
    body.classList.remove('theme-amoled', 'theme-dracula', 'theme-light');

    if (theme !== 'default') {
        body.classList.add(`theme-${theme}`);
    }
}

function toggleQueuePage() {
    const queuePage = document.getElementById('queuePage');

    queuePage.style.display = queuePage.style.display === 'none' ? 'block' : 'none';
    updateQueueList();
}

function updateQueueList() {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';

    for (let i = 0; i < queue.length; i++) {
        const track = queue[i];
        const listItem = document.createElement('li');
        listItem.classList.add('queueItem');

        const container = document.createElement('div');
        container.id = 'container';

        const songArt = document.createElement('img');
        songArt.id = 'songArt';
        songArt.src = track.image ? track.image : '../../icons/Cazic/Default_Artwork.jpg';
        container.appendChild(songArt);

        const songInfo = document.createElement('div');
        songInfo.className = 'songInfo';

        const songTitle = document.createElement('span');
        songTitle.id = 'songTitle';
        songTitle.textContent = track.title;
        songInfo.appendChild(songTitle);

        const songArtist = document.createElement('span');
        songArtist.id = 'songArtist';
        songArtist.textContent = track.artist;
        songInfo.appendChild(songArtist);

        container.appendChild(songInfo);

        const removeButton = document.createElement('button');
        removeButton.classList.add('defaultIcons');
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