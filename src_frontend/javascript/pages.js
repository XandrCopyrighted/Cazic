function openSettingsPage() {
    const settingsOverlay = document.getElementById('page-overlay');
  
    if (settingsOverlay) {
      settingsOverlay.style.display = 'block';
  
      const saveButton = document.getElementById('saveSettings');
      const closeButton = document.getElementById('closeSettings');
  
      saveButton.addEventListener('click', saveSettings);
      closeButton.addEventListener('click', closeSettings);
  
      function saveSettings() {
        // Save settings to localStorage
        const settings = {
          // Get the values from the form elements
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        closeSettings();
      }
  
      function closeSettings() {
        settingsOverlay.style.display = 'none';
        saveButton.removeEventListener('click', saveSettings);
        closeButton.removeEventListener('click', closeSettings);
      }
    } else {
      console.error('Settings overlay element not found');
    }
}