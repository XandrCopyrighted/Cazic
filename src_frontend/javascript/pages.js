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

function toggleQueuePage() {
    const queuePage = document.getElementById('queue-page');

    queuePage.style.display = queuePage.style.display === 'none' ? 'block' : 'none';
    updateQueueList();
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