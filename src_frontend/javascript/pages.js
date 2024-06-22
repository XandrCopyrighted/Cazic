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

        const songTitle = document.createElement('span');
        songTitle.textContent = `${track.title} - ${track.artist}`;

        const removeButton = document.createElement('icon-default');
        removeButton.classList.add('default-button');
        removeButton.innerHTML = '<i class="bx bx-x bx-xs"></i>';
        removeButton.dataset.index = i;
        removeButton.addEventListener('click', removeSongFromQueue);

        listItem.appendChild(songTitle);
        listItem.appendChild(removeButton);
        queueList.appendChild(listItem);
    }
}

function removeSongFromQueue(event) {
    const index = event.currentTarget.dataset.index;
    const removedTrack = queue.splice(index, 1)[0];
    if (removedTrack.image) {
        URL.revokeObjectURL(removedTrack.image);
    }
    queue.splice(index, 1);
    updateQueueList();

    if (index === currentIndex) {
        playNextTrack();
    } else if (index < currentIndex) {
        currentIndex--;
    }
} // This code is kinda bugged