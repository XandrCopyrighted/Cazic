document.addEventListener("DOMContentLoaded", function () {
    // Wait for the DOM to be fully loaded

    // Access the WebView2 control
    const webView = document.querySelector("#bar");

    // Apply styles after initialization
    webView.CoreWebView2InitializationCompleted = (sender, args) => {
        ApplySliderStyles();
    };

    // Apply styles after each navigation
    webView.CoreWebView2NavigationCompleted = (sender, args) => {
        ApplySliderStyles();
    };
});

function ApplySliderStyles() {
    // Apply any additional styles or logic if needed after initialization or navigation
}