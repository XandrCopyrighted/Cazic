// Initialize WebView2
const webViewContainer = document.getElementById('progress');
const webView = new WebView2({
    hostWindow: window,
    visible: true,
    parentElement: webViewContainer,
});

// Handle initialization completed event
webView.addEventListener('CoreWebView2InitializationCompleted', (e) => {
    // Apply styles after initialization
    applySliderStyles();
});

// Handle navigation completed event
webView.addEventListener('CoreWebView2NavigationCompleted', (e) => {
    // Apply styles after each navigation
    applySliderStyles();
});

// Function to apply slider styles
function applySliderStyles() {
    // Execute JavaScript code within WebView2 to apply styles
    webView.executeScript(`
        const slider = document.getElementById('progress');
        slider.style.backgroundColor = '#a5adce';
        slider.style.border = '3px solid #51576d';
        slider.style.width = '10px';
        slider.style.height = '10px';
    `);
}
