/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!********************************!*\
  !*** ./src/content/content.ts ***!
  \********************************/

// Extract relevant content from the page
function extractPageContent() {
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1Text = Array.from(document.getElementsByTagName('h1'))
        .map(h1 => h1.textContent)
        .join(' ');
    return {
        title,
        metaDescription,
        h1Text,
        url: window.location.href
    };
}
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXTRACT_CONTENT') {
        const content = extractPageContent();
        sendResponse(content);
    }
    return true;
});

/******/ })()
;
//# sourceMappingURL=content.js.map